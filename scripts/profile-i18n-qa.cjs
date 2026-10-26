// Local Markdown approximation, not a claim about GitHub's live CSS or UI.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const profile=process.env.PROFILE_DIR;
if(!profile)throw Error('Set PROFILE_DIR to the profile repository checkout.');
const out=path.join(root,'tmp','english-profile-qa');fs.mkdirSync(out,{recursive:true});
const checks=[];
async function check(name,fn){try{await fn();checks.push({name,status:'pass'});}catch(error){checks.push({name,status:'fail',evidence:error.message});}console.log(checks.at(-1).status,name);}
(async()=>{
 const {marked}=await import(pathToFileURL(require.resolve('marked')).href);
 const css=`html{font:16px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#1f2328;background:#fff}body{max-width:900px;margin:24px auto;padding:0 20px;overflow-wrap:anywhere}img{max-width:100%;height:auto}h1{font-size:2em;line-height:1.3}h2{margin-top:1.5em;font-size:1.5em}h3{font-size:1.25em}a{color:#0969da;text-underline-offset:3px}a:focus-visible{outline:3px solid #0969da;outline-offset:3px}p[align=right]{text-align:right}table{display:block;max-width:100%;overflow:auto;border-collapse:collapse}td,th{border:1px solid #d0d7de;padding:12px}hr{border:0;border-top:1px solid #d0d7de;margin:24px 0}@media(prefers-color-scheme:dark){html{color:#f0f3f6;background:#0d1117}a{color:#79c0ff}td,th,hr{border-color:#54616e}}`;
 const server=http.createServer(async(req,res)=>{
   try{
     const url=new URL(req.url,'http://local');
     const match=url.pathname.match(/^\/(profile|portfolio)\/(.*)$/);if(!match){res.writeHead(404);return res.end();}
     const base=match[1]==='profile'?profile:root,target=path.resolve(base,decodeURIComponent(match[2]));
     if(!target.startsWith(path.resolve(base)+path.sep)){res.writeHead(403);return res.end();}
     let content=fs.readFileSync(target);
     if(target.endsWith('.md')){
       let markdown=content.toString().replace(/https:\/\/raw\.githubusercontent\.com\/Daniel-24-life\/AIfile\/[a-f0-9]{40}\//g,'/portfolio/');
       markdown=markdown.replace(/https:\/\/github\.com\/Daniel-24-life\/Daniel-24-life\/blob\/main\/README.en.md/g,'/profile/README.en.md')
          .replace(/href="https:\/\/github\.com\/Daniel-24-life"/g,'href="/profile/README.md"');
       const language=target.endsWith('README.en.md')?'en':'zh-CN';
       content=Buffer.from(`<!doctype html><html lang="${language}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local profile QA</title><style>${css}</style></head><body>${await marked.parse(markdown)}</body></html>`);
       res.setHeader('Content-Type','text/html; charset=utf-8');
     }else res.setHeader('Content-Type',target.endsWith('.svg')?'image/svg+xml':'image/png');
     res.end(content);
   }catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH});
 try{
   for(const language of ['en','zh'])for(const theme of ['light','dark']){
     const name=language==='en'?'README.en.md':'README.md';
     const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
     await page.goto(`${base}/profile/${name}`);await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode())));
     await check(`${language}-${theme}: images / language switch`,async()=>{
       assert.equal(await page.locator('body > p').first().getAttribute('align'),'right');
       assert.equal(await page.locator('body > p').first().getByRole('link').count(),1);
       assert.equal(await page.locator('img').count(),6);
       if(language==='en'){
         assert.equal(await page.locator('picture img').evaluate((img,theme)=>img.currentSrc.includes(`cover-en-${theme}.svg`),theme),true);
         const text=await page.locator('body').innerText();assert.doesNotMatch(text.replace(/^.*\n/,''),/[\u3400-\u9fff]/);
       }
     });
     for(const width of [320,375,768,1440])await check(`${language}-${theme}: ${width}px`,async()=>{
       await page.setViewportSize({width,height:1000});await page.waitForTimeout(80);
       assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
       await page.screenshot({path:path.join(out,`${language}-${theme}-${width}.png`),fullPage:false});
     });
     await check(`${language}-${theme}: keyboard language switch`,async()=>{
       await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.tagName),'A');
       await page.keyboard.press('Enter');await page.waitForURL(`${base}/profile/${language==='en'?'README.md':'README.en.md'}`);
       assert.equal(new URL(page.url()).pathname,`/profile/${language==='en'?'README.md':'README.en.md'}`);
     });
     await page.close();
   }
   const page=await browser.newPage({viewport:{width:375,height:1000}});
   await page.goto(`${base}/profile/README.en.md`);
   await check('English text: 200% enlargement',async()=>{
     await page.evaluate(()=>{const sizes=[...document.querySelectorAll('*')].map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]);for(const [el,size]of sizes)el.style.setProperty('font-size',`${size*2}px`,'important');});
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
   });
   await page.reload();await check('English text: spacing override',async()=>{
     await page.addStyleTag({content:'*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'});
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
   });
   await page.close();
   const data=JSON.parse(fs.readFileSync(path.join(root,'catalog/projects.json'),'utf8'));
   const assetPaths=data.projects.filter(item=>item.featured_order).map(item=>item.cover_en).concat(['assets/cover-en-light.svg','assets/cover-en-dark.svg']);
   for(const asset of assetPaths)await check(`SVG bounds: ${path.basename(asset)}`,async()=>{
     const page=await browser.newPage();await page.goto(`${base}/portfolio/${asset}`);
     const overflow=await page.evaluate(()=>[...document.querySelectorAll('text')].map(el=>({text:el.textContent,box:el.getBBox()})).filter(({box})=>box.x<0||box.x+box.width>1280||box.y<0||box.y+box.height>490).map(item=>item.text));
     assert.deepEqual(overflow,[]);await page.screenshot({path:path.join(out,path.basename(asset)+'.png')});await page.close();
   });
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(checks,null,2));
 if(checks.some(item=>item.status==='fail'))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
