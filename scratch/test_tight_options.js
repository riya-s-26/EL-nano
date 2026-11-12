const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8245;
const CDP_PORT = 9355;
const BASE_DIR = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/about.html';
  const filePath = path.join(BASE_DIR, reqPath.replace(/^[/\\]+/, ''));
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'
  };
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${path.join(BASE_DIR, 'scratch', 'chrome_visit_test_tight')}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  let list;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      list = await res.json();
      if (list && list.length > 0) break;
    } catch (e) {}
  }

  const wsUrl = (list.find(t => t.type === 'page') || list[0]).webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let idCounter = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = idCounter++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');

  async function testOption(gradientCSS, outName) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
    await new Promise(r => setTimeout(r, 1200));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.about-visit-sec');
        sec.style.backgroundImage = '${gradientCSS}, url("../img/Floral-Pattern.jpeg")';
        document.querySelectorAll('[data-reveal]').forEach(r => {
          r.classList.add('revealed');
          r.style.opacity = '1';
          r.style.transform = 'none';
        });
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    const pm = (await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.about-visit-sec');
        const r = sec.getBoundingClientRect();
        return {
          totalHeight: document.documentElement.scrollHeight,
          secX: r.left + window.scrollX,
          secY: r.top + window.scrollY,
          secWidth: r.width,
          secHeight: r.height
        };
      })()`,
      returnByValue: true
    })).result.value;

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: pm.totalHeight + 100,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 300));

    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
      clip: {
        x: Math.max(0, pm.secX),
        y: Math.max(0, pm.secY),
        width: Math.min(1024, pm.secWidth),
        height: pm.secHeight,
        scale: 1
      }
    });

    fs.writeFileSync(path.join(BASE_DIR, 'scratch', outName), Buffer.from(shot.data, 'base64'));
    console.log(`Saved scratch/${outName}`);
  }

  // Test 1: Tight ellipse 480px 220px at 50% 165px
  await testOption(
    'radial-gradient(ellipse 480px 220px at 50% 165px, #FAF4E8 0%, #FAF4E8 50%, rgba(250, 244, 232, 0.7) 70%, rgba(250, 244, 232, 0) 100%)',
    'option_tight_480.jpg'
  );

  // Test 2: Ellipse 420px 180px at 50% 165px
  await testOption(
    'radial-gradient(ellipse 420px 180px at 50% 165px, #FAF4E8 0%, #FAF4E8 45%, rgba(250, 244, 232, 0.6) 70%, rgba(250, 244, 232, 0) 100%)',
    'option_tight_420.jpg'
  );

  // Test 3: Ellipse 520px 240px at 50% 165px
  await testOption(
    'radial-gradient(ellipse 520px 240px at 50% 165px, #FAF4E8 0%, #FAF4E8 55%, rgba(250, 244, 232, 0.65) 75%, rgba(250, 244, 232, 0) 100%)',
    'option_tight_520.jpg'
  );

  // Test 4: Soft subtle radial-gradient
  await testOption(
    'radial-gradient(ellipse 450px 200px at 50% 160px, rgba(250, 244, 232, 0.95) 0%, rgba(250, 244, 232, 0.8) 40%, rgba(250, 244, 232, 0) 80%)',
    'option_soft_450.jpg'
  );

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

