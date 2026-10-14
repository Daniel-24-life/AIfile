# Browser verification

Core checks run through `python scripts/verify_public_packages.py`.
Optional browser QA also exercises task creation, duplicate blocking, closure,
role restrictions, stale evidence, demand filters, queue pause and 390px layouts.

From the repository root, install the browser test dependency:

```powershell
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
```

In two separate terminals, start the demos:

```powershell
python -m http.server 4181 --bind 127.0.0.1 --directory shelves/code/logistics-workbench-demo/dist
```

```powershell
cd shelves/code/buyer-research-demo
python server.py
```

From the repository root:

```powershell
node scripts/browser-qa.cjs
```

The test adds a synthetic queue row. Screenshots go to ignored `tmp/browser-checks/`.
Set `QA_CAPTURE_PUBLIC=1` only to intentionally regenerate the tracked screenshot
assets. `BROWSER_PATH` can select an installed Chromium executable.

Recorded release check: desktop 1440px, mobile 390px, both workflows passed;
no browser runtime errors were observed. This is not a production security audit.
