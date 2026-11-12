const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8201;
const CDP_PORT = 9314;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
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
    '.svg': 'image/svg+xml'
  };
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_test_profile4');
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

  const clipSection = async (selector, filename) => {
    const box = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.round(rect.left + window.scrollX),
          y: Math.round(rect.top + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })()`,
      returnByValue: true
    });
    if (box.result.value) {
      const b = box.result.value;
      const shot = await send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 90,
        clip: { x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width, height: b.height, scale: 1 },
        captureBeyondViewport: true
      });
      const outPath = path.join(ARTIFACTS_DIR, filename);
      fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    } else {
      console.error(`Could not clip ${selector}: element not found`);
    }
  };

  // 1. Desktop test
  await setViewport(1366, 900);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html?lang=es` });
  await new Promise(r => setTimeout(r, 1200));

  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const homeEsData = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.atmosphere-grid .atmo-card')).map(c => ({
        title: c.querySelector('h3')?.innerText.trim(),
        desc: c.querySelector('p')?.innerText.trim()
      }));
      const highlights = Array.from(document.querySelectorAll('.atmo-features .feat-item')).map(f => ({
        title: f.querySelector('h3')?.innerText.trim(),
        desc: f.querySelector('p')?.innerText.trim()
      }));
      return { lang: document.documentElement.lang, cards, highlights };
    })()`,
    returnByValue: true
  });

  console.log('=== HOMEPAGE ATMOSPHERE SECTION (ES) ===');
  console.log(JSON.stringify(homeEsData.result.value, null, 2));

  await clipSection('.atmosphere', 'task4_homepage_atmosphere_es.jpg');

  // Switch to English
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="en"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const homeEnData = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.atmosphere-grid .atmo-card')).map(c => ({
        title: c.querySelector('h3')?.innerText.trim(),
        desc: c.querySelector('p')?.innerText.trim()
      }));
      const highlights = Array.from(document.querySelectorAll('.atmo-features .feat-item')).map(f => ({
        title: f.querySelector('h3')?.innerText.trim(),
        desc: f.querySelector('p')?.innerText.trim()
      }));
      return { lang: document.documentElement.lang, cards, highlights };
    })()`,
    returnByValue: true
  });

  console.log('=== HOMEPAGE ATMOSPHERE SECTION (EN) ===');
  console.log(JSON.stringify(homeEnData.result.value, null, 2));

  await clipSection('.atmosphere', 'task4_homepage_atmosphere_en.jpg');

  console.log('=== CONSOLE LOGS ===');
  console.log(JSON.stringify(consoleLogs, null, 2));

  ws.close();
  chrome.kill();
  server.close();
  console.log('HOMEPAGE VERIFICATION COMPLETE!');
  process.exit(0);
});

