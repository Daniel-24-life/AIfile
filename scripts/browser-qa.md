# Browser verification

Core checks run through `python scripts/verify_public_packages.py`.
Optional browser QA also exercises task creation, duplicate blocking, closure,
role restrictions, stale evidence, demand filters, queue pause and 390px layouts.

From the repository root, install the browser test dependency:

```powershell
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
```

The code now lives in independently maintained repositories. Clone those projects
outside AIfile, then start them from their own roots in two separate terminals:

```powershell
git clone https://github.com/Daniel-24-life/logistics-workbench.git
cd logistics-workbench
python -m http.server 4181 --bind 127.0.0.1 --directory dist
```

```powershell
git clone https://github.com/Daniel-24-life/buyer-research-agent.git
cd buyer-research-agent
python server.py
```

From the repository root:

```powershell
node scripts/browser-qa.cjs
```

The test adds a synthetic queue row. Screenshots go to ignored `tmp/browser-checks/`.
Historical v2.3 images remain unchanged. `BROWSER_PATH` can select an installed
Chromium executable. The script does not rewrite tracked public screenshots.

Recorded release check: desktop 1440px, mobile 390px, both workflows passed;
no browser runtime errors were observed. This is not a production security audit.
