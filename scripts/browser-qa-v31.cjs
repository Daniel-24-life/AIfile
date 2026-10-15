// Local synthetic fixtures only. No personal browser profile or remote services.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = path.resolve(__dirname, '../tmp/ui-v31');
const projects = [
  ['logistics', 'http://127.0.0.1:4181'],
  ['buyer', 'http://127.0.0.1:4182'],
  ['btc', 'http://127.0.0.1:4183/demo/'],
  ['agentplatform', 'http://127.0.0.1:4184/case-study/']
];
const only = process.env.QA_PROJECT;
const results = [];
async function check(name, run) {
  try { await run(); results.push({name, status:'pass'}); }
  catch (error) { results.push({name, status:'fail', evidence:error.stack}); }
  console.log(results.at(-1).status, name);
}
const fits = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
(async () => {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_PATH});
  try {
    for (const [id,url] of projects.filter(p => !only || p[0] === only)) {
      const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
      page.setDefaultTimeout(10000);
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(url); await page.waitForTimeout(600);
      await page.locator('img').evaluateAll(imgs => imgs.forEach(img => { img.loading = 'eager'; }));
      await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
      await check(`${id}: representative computed text contrast`, async () => {
        const selectors = {
          logistics:['h1','.page-subtitle','.nav-item.active','.tag.high','.field label','.button.primary','.deadline.safe'],
          buyer:['h1','.intro > p:last-child','.record-meta','.tag','.nav.active','.primary'],
          btc:['h1','.lede','.scenario-button span','.badge','.site-header a'],
          agentplatform:['h1','.lede','.label','.site-header a','.status-strip','.task-section p']
        }[id];
        const pairs = await page.evaluate(selectors => {
          const rgb = color => (color.match(/[\d.]+/g)||[]).map(Number);
          const luminance = color => color.slice(0,3).map(n => { n/=255; return n<=.04045?n/12.92:((n+.055)/1.055)**2.4; }).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
          return selectors.map(selector => {
            const el=document.querySelector(selector); if(!el) throw Error(`Missing contrast sample ${selector}`);
            const ancestry=[]; for(let item=el;item;item=item.parentElement) ancestry.unshift(item);
            let bg=[255,255,255];
            ancestry.forEach(item => {const c=rgb(getComputedStyle(item).backgroundColor), a=c[3]??1;bg=bg.map((n,i)=>c[i]*a+n*(1-a));});
            const style=getComputedStyle(el), fg=rgb(style.color), a=fg[3]??1;
            const foreground=bg.map((n,i)=>fg[i]*a+n*(1-a));
            const x=luminance(foreground),y=luminance(bg);
            const large=parseFloat(style.fontSize)>=24 || (parseFloat(style.fontSize)>=18.66 && Number(style.fontWeight)>=700);
            return {selector,foreground:style.color,background:bg,ratio:(Math.max(x,y)+.05)/(Math.min(x,y)+.05),minimum:large?3:4.5};
          });
        },selectors);
        fs.writeFileSync(path.join(output,`${id}-contrast.json`),JSON.stringify(pairs,null,2));
        assert.deepEqual(pairs.filter(pair=>pair.ratio<pair.minimum),[]);
      });
      for (const width of [320,375,768,1440]) {
        await check(`${id}: layout ${width}`, async () => {
          await page.setViewportSize({width,height:1000});
          await page.waitForTimeout(100);
          assert.equal(await fits(page),true,'document horizontal overflow');
          await page.screenshot({path:path.join(output,`${id}-${width}.png`),fullPage:true});
          if(width === 1440) await page.screenshot({path:path.join(output,`${id}-preview.png`)});
        });
      }
      await check(`${id}: 200% text at 375`, async () => {
        await page.setViewportSize({width:375,height:1000});
        await page.waitForTimeout(100);
        await page.evaluate(() => {
          const sizes = [...document.querySelectorAll('*')].map(el => [el,parseFloat(getComputedStyle(el).fontSize)]);
          sizes.forEach(([el,size]) => el.style.setProperty('font-size',`${size*2}px`,'important'));
        });
        assert.equal(await fits(page),true,'document horizontal overflow with enlarged text');
        await page.screenshot({path:path.join(output,`${id}-text200.png`),fullPage:true});
      });
      await page.reload(); await page.waitForTimeout(300);
      await check(`${id}: text spacing at 375`, async () => {
        await page.addStyleTag({content:'* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; } p { margin-bottom:2em !important; }'});
        assert.equal(await fits(page),true,'document horizontal overflow with spacing');
        await page.screenshot({path:path.join(output,`${id}-spacing.png`),fullPage:true});
      });
      await page.reload(); await page.waitForTimeout(300);
      await check(`${id}: keyboard / reduced-motion`, async () => {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement !== document.body),true);
        assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),true);
      });
      if(id === 'logistics') {
        await check('logistics: review / keyboard / role / stale / duplicate / close', async () => {
          await page.setViewportSize({width:1440,height:1000});
          const trigger = page.locator('[data-open="EX-1042"]'); await trigger.click();
          await page.locator('#detailSheet.open').waitFor();
          await page.screenshot({path:path.join(output,'logistics-detail.png'),fullPage:true});
          await page.keyboard.press('Shift+Tab');
          assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-reject')),true);
          await page.locator('[data-edit]').click();
          await page.locator('#suggestionText').waitFor(); await page.waitForTimeout(50);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#editModal').isHidden(),true);
          assert.equal(await page.locator('#detailSheet').getAttribute('aria-hidden'),'false');
          assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-edit')),true);
          await page.keyboard.press('Escape');
          assert.equal(await page.evaluate(() => document.activeElement.dataset.open),'EX-1042');
          await trigger.click(); await page.locator('[data-accept]').click();
          const count = await page.evaluate(() => tasks.length);
          await page.evaluate(() => createTaskFromSuggestion(exceptions[0], 'duplicate', 'demo'));
          assert.equal(await page.evaluate(() => tasks.length),count);
          await page.locator('#roleSelect').selectOption('dispatcher');
          await page.locator('[data-view="tasks"]').click();
          await page.getByRole('button',{name:'开始执行',exact:true}).first().click();
          await page.getByRole('button',{name:'提交完成证据',exact:true}).first().click();
          await page.getByRole('button',{name:'验证并回写',exact:true}).first().click();
          assert.equal(await page.evaluate(() => exceptions[0].status),'已关闭');
          await page.locator('#roleSelect').selectOption('customer');
          assert.equal(await page.locator('#detailSheet').getAttribute('aria-hidden'),'true');
          await page.evaluate(() => createTaskFromSuggestion(exceptions[1], 'unauthorized', 'demo'));
          assert.equal(await page.evaluate(() => tasks.length),count);
          await page.locator('#roleSelect').selectOption('operator');
          await page.evaluate(() => openDetail('EX-1039'));
          assert.equal(await page.locator('[data-accept]').isDisabled(),true);
          await page.setViewportSize({width:320,height:1000});
          await page.waitForTimeout(100);
          assert.equal(await fits(page),true);
          await page.screenshot({path:path.join(output,'logistics-detail-mobile.png'),fullPage:true});
        });
      }
      if(id === 'btc') {
        await check('btc: four scenarios / null / JSON / no authority', async () => {
          const payload = await (await page.request.get('http://127.0.0.1:4183/sample.fake.json')).json();
          assert.equal(await page.locator('[data-scenario="dry_run_lifecycle"]').getAttribute('aria-pressed'),'true');
          for(const scenario of payload.scenarios) {
            await page.locator(`[data-scenario="${scenario.scenario}"]`).click();
            assert.deepEqual(JSON.parse(await page.locator('#raw-json').textContent()),scenario);
            assert.equal(scenario.release.execution_authority,false);
            if(!scenario.lifecycle) assert.match(await page.locator('#stage-list').textContent(),/未运行/);
            await page.locator('#raw-record > summary').click();
            assert.equal(await fits(page),true);
            await page.locator('#raw-record > summary').click();
          }
        });
      }
      if(id === 'buyer') {
        await check('buyer: filters / selected evidence / create / pause / resume / cancel / export', async () => {
          for(const [filter,count] of [['explicit',1],['opportunity',1],['pending',2],['all',4]]) {
            await page.locator(`[data-filter="${filter}"]`).click();
            assert.equal(await page.locator('[data-record-id]').count(),count);
          }
          await page.locator('[data-record-id]').last().click();
          assert.match(await page.locator('#detail').textContent(),/需求原文/);
          assert.match(await page.locator('#detail').textContent(),/未知/);
          await page.locator('#product').fill('离线UI验收样例');
          await page.locator('#enqueue').click();
          await page.getByText('演示任务已保存。结果固定，不代表实际搜索。',{exact:true}).waitFor();
          await page.locator('#pause').click();
          await page.getByText('队列已暂停，不领取任务。',{exact:true}).waitFor();
          assert.equal(await page.locator('#next').isDisabled(),true);
          await page.locator('#resume').click(); await page.locator('#next').click();
          await page.getByText(/DEMO-\d+ · 演示完成/).first().waitFor();
          await page.locator('#enqueue').click();
          await page.getByText('演示任务已保存。结果固定，不代表实际搜索。',{exact:true}).waitFor();
          await page.locator('[data-cancel]').last().click();
          await page.getByText(/DEMO-\d+ · 已取消/).first().waitFor();
          const downloading = page.waitForEvent('download'); await page.locator('#export').click();
          const download = await downloading; assert.equal(download.suggestedFilename(),'buyer-research.fake.json');
          await page.reload(); await page.locator('.connection[data-state="ready"]').waitFor();
          assert.equal(await page.locator('#product').inputValue(),'离线UI验收样例');
        });
        await check('buyer: connection / request failure / old state / invalid state / stale', async () => {
          await page.route('**/api/state', route => route.abort());
          await page.reload(); await page.locator('.connection[data-state="error"]').waitFor();
          assert.equal(await page.locator('#enqueue').isDisabled(),true);
          await page.unroute('**/api/state'); await page.locator('#retry').click();
          await page.locator('.connection[data-state="ready"]').waitFor();
          const key = await page.evaluate(() => requestId);
          await page.route('**/api/enqueue', route => route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'合成请求失败'})}));
          await page.locator('#enqueue').click(); await page.locator('.connection[data-state="error"]').waitFor();
          assert.equal(await page.evaluate(() => requestId),key);
          assert.match(await page.locator('#connectionStatus').textContent(),/旧状态/);
          assert.equal(await page.locator('#enqueue').isDisabled(),true);
          assert.equal(await page.locator('#product').inputValue(),'离线UI验收样例');
          await page.unroute('**/api/enqueue');
          await page.route('**/api/state', route => route.fulfill({status:200,contentType:'application/json',body:'{}'}));
          await page.locator('#retry').click(); await page.locator('.connection[data-state="error"]').waitFor();
          assert.match(await page.locator('#errorMessage').textContent(),/格式无效/);
          await page.unroute('**/api/state'); await page.locator('#retry').click(); await page.locator('.connection[data-state="ready"]').waitFor();
          await page.clock.install(); await page.evaluate(() => scheduleStaleState()); await page.clock.fastForward(61000);
          await page.locator('.connection[data-state="stale"]').waitFor();
          assert.equal(await page.locator('#enqueue').isDisabled(),true);
          for(const button of await page.locator('[data-cancel]').all()) assert.equal(await button.isDisabled(),true);
        });
      }
      if(id === 'agentplatform') {
        await check('agentplatform: navigation / local source links / stopped / fixture', async () => {
          const targets = await page.locator('a[href]').evaluateAll(els => els.map(e => e.getAttribute('href')));
          for(const target of targets) {
            if(target.startsWith('#')) assert.equal(await page.locator(target).count(),1);
            else if(!target.startsWith('http')) assert.equal((await page.request.get(new URL(target,url).href)).ok(),true,target);
          }
          assert.match(await page.locator('.status-strip').textContent(),/已停止开发/);
          assert.match(await page.locator('figcaption').textContent(),/离线合成夹具/);
          await page.locator('nav a[href="#pilot"]').click();
          await page.locator('nav a[href="#source"]').click();
          assert.equal(await fits(page),true);
        });
      }
      await check(`${id}: no browser script errors`, async () => assert.deepEqual(errors,[]));
      await page.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(output,`results-${only || 'all'}.json`),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  if(results.some(r => r.status==='fail')) process.exitCode=1;
})().catch(e => {console.error(e);process.exitCode=1;});
