const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8204;
const CDP_PORT = 9317;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/about.html';
  const filePath = path.join(BASE_DIR, reqPath.replace(/^[/\\]+/, ''));

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2'
  };
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_test_profile_pt');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${testProfile}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  let list;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      list = await res.json();
      if (list && list.length > 0) break;
    } catch (e) {}
  }

  const ws = new WebSocket((list.find(t => t.type === 'page') || list[0]).webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const cid = id++;
    const h = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === cid) {
        ws.removeEventListener('message', h);
        if (msg.error) reject(msg.error); else resolve(msg.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cid, method, params }));
  });

  const consoleLogs = [];
  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({ type: msg.params.type, args: msg.params.args.map(a => a.value || a.description) });
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });

  const setViewport = async (w, h) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: w <= 768
    });
  };

  const navigateTo = async (url) => {
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1000));
    await send('Runtime.evaluate', {
      expression: 'new Promise(resolve => { if (document.readyState === "complete") resolve(); else window.addEventListener("load", resolve); })',
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 600));
  };

  const captureElementClip = async (selector, outFilename) => {
    const boxResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
          const r = el.getBoundingClientRect();
          return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
        })()
      `,
      returnByValue: true
    });
    const box = boxResult.result.value;
    if (!box) {
      console.error('Element not found:', selector);
      return;
    }
    await new Promise(r => setTimeout(r, 300));
    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 92,
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: box.width,
        height: box.height,
        scale: 1
      }
    });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(path.join(ARTIFACTS_DIR, outFilename), buf);
    console.log(`Saved screenshot to ${outFilename} (${buf.length} bytes)`);
  };

  try {
    console.log('=== VERIFYING ABOUT US VISIT SECTION FONT FAMILY ===');
    await setViewport(1200, 900);
    await navigateTo(`http://127.0.0.1:${PORT}/about.html?lang=en`);

    const result = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sec = document.querySelector('.about-visit-sec');
          const pill = document.querySelector('.visit-pill-badge');
          const h2 = document.querySelector('.visit-main-heading');
          const city = document.querySelector('.visit-city-line');
          const phone = document.querySelector('.phone-text');
          const cardTitle = document.querySelector('.card-title-text');
          const daysCol = document.querySelector('.hours-days-col');
          const timesCol = document.querySelector('.hours-times-col');

          // Unrelated elements on the same page
          const heroDesc = document.querySelector('.about-hero-desc');
          const storyP = document.querySelector('.about-story-p');
          const diffCardDesc = document.querySelector('.about-diff-card-desc');
          const body = document.body;

          return {
            visitSection: {
              sectionFont: window.getComputedStyle(sec).fontFamily,
              pillFont: window.getComputedStyle(pill).fontFamily,
              h2Font: window.getComputedStyle(h2).fontFamily,
              cityFont: window.getComputedStyle(city).fontFamily,
              phoneFont: window.getComputedStyle(phone).fontFamily,
              cardTitleFont: window.getComputedStyle(cardTitle).fontFamily,
              daysColFont: window.getComputedStyle(daysCol).fontFamily,
              timesColFont: window.getComputedStyle(timesCol).fontFamily,
            },
            unrelatedElements: {
              bodyFont: window.getComputedStyle(body).fontFamily,
              heroDescFont: heroDesc ? window.getComputedStyle(heroDesc).fontFamily : null,
              storyPFont: storyP ? window.getComputedStyle(storyP).fontFamily : null,
              diffCardDescFont: diffCardDesc ? window.getComputedStyle(diffCardDesc).fontFamily : null
            }
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Verification Data:', JSON.stringify(result.result.value, null, 2));

    await captureElementClip('.visit-content-wrap', 'paytone_one_visit_content_wrap.jpg');
    await captureElementClip('.about-visit-sec', 'paytone_one_about_visit_sec.jpg');

    // Test in Spanish
    await navigateTo(`http://127.0.0.1:${PORT}/about.html?lang=es`);
    await captureElementClip('.visit-content-wrap', 'paytone_one_visit_content_wrap_es.jpg');

    console.log('Console Errors:', consoleLogs.filter(l => l.type === 'error'));

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    try { chrome.kill(); } catch (e) {}
    server.close();
    process.exit(0);
  }
});

