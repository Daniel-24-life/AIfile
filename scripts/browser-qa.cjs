const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = name => {
  const folder = process.env.QA_CAPTURE_PUBLIC === '1'
    ? path.join(root, 'showcases', name, 'assets')
    : path.join(root, 'tmp', 'browser-checks', name);
  fs.mkdirSync(folder, {recursive:true});
  return folder;
};
(async () => {
  const browser = await chromium.launch({headless:true,...(process.env.BROWSER_PATH ? {executablePath:process.env.BROWSER_PATH} : {})});
  const failures = [];
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror', e => failures.push(e.message));
    await page.goto('http://127.0.0.1:4181');
    await page.getByRole('heading',{name:'异常中心',exact:true}).waitFor();
    await page.screenshot({path:path.join(out('logistics-workbench'),'workbench-desktop.png'),fullPage:true});
    await page.getByRole('button',{name:'查看 →'}).first().click();
    await page.getByRole('heading',{name:'AI 处置建议'}).waitFor();
    await page.waitForTimeout(350);
    await page.screenshot({path:path.join(out('logistics-workbench'),'review-desktop.png'),fullPage:true});
    await page.getByRole('button',{name:'审核并创建任务'}).click();
    const taskCount = await page.evaluate(() => tasks.length);
    await page.evaluate(() => createTaskFromSuggestion(exceptions[0], 'duplicate', 'demo'));
    assert.equal(await page.evaluate(() => tasks.length),taskCount);
    await page.locator('#roleSelect').selectOption('dispatcher');
    await page.getByText('调度任务',{exact:true}).first().click();
    await page.getByRole('button',{name:'开始执行'}).first().click();
    await page.getByRole('button',{name:'提交完成证据'}).first().click();
    await page.getByRole('button',{name:'验证并回写'}).first().click();
    assert.equal(await page.evaluate(() => exceptions[0].status),'已关闭');
    await page.locator('#roleSelect').selectOption('customer');
    await page.getByRole('heading',{name:'进口集装箱运输中'}).waitFor();
    const before = await page.evaluate(() => tasks.length);
    await page.evaluate(() => createTaskFromSuggestion(exceptions[1], 'unauthorized', 'demo'));
    assert.equal(await page.evaluate(() => tasks.length),before);
    assert.equal(await page.locator('#detailSheet').getAttribute('aria-hidden'),'true');
    await page.locator('#roleSelect').selectOption('operator');
    await page.evaluate(() => openDetail('EX-1039'));
    assert.equal(await page.locator('[data-accept]').isDisabled(),true);
    await page.evaluate(() => closeDetail());
    await page.setViewportSize({width:390,height:844});
    await page.reload();
    await page.getByRole('heading',{name:'异常中心',exact:true}).waitFor();
    await page.screenshot({path:path.join(out('logistics-workbench'),'workbench-mobile.png')});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);

    const buyer = await browser.newPage({viewport:{width:1440,height:1000}});
    buyer.on('pageerror', e => failures.push(e.message));
    await buyer.goto('http://127.0.0.1:4182');
    await buyer.locator('.record').nth(3).waitFor();
    await buyer.screenshot({path:path.join(out('buyer-research-agent'),'workbench-desktop.png'),fullPage:true});
    await buyer.locator('[data-filter=explicit]').click();
    assert.equal(await buyer.locator('.record').count(),1);
    await buyer.locator('[data-filter=pending]').click();
    assert.equal(await buyer.locator('.record').count(),2);
    await buyer.locator('[data-filter=all]').click();
    await buyer.locator('summary').first().click();
    await buyer.screenshot({path:path.join(out('buyer-research-agent'),'evidence-desktop.png'),fullPage:true});
    await buyer.locator('#product').fill('演示队列验证');
    await buyer.locator('#enqueue').click();
    await buyer.getByText('演示任务已保存。结果固定，不代表实际搜索。',{exact:true}).waitFor();
    await buyer.locator('#pause').click();
    await buyer.getByText('队列已暂停，不领取任务。',{exact:true}).waitFor();
    assert.equal(await buyer.locator('#next').isDisabled(),true);
    await buyer.locator('#resume').click();
    await buyer.locator('#next').click();
    await buyer.getByText(/DEMO-\d+ · 演示完成/).first().waitFor();
    await buyer.setViewportSize({width:390,height:844});
    await buyer.screenshot({path:path.join(out('buyer-research-agent'),'workbench-mobile.png')});
    assert.equal(await buyer.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
    assert.deepEqual(failures,[]);
    console.log('PASS: logistics review/task/closure/role/stale/duplicate checks; buyer filters/queue/pause/resume; both 390px layouts; no browser errors.');
  } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exitCode=1;});
