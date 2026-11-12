const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8206;
const CDP_PORT = 9319;
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

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_test_profile_fog');
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

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1500));

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
    await new Promise(r => setTimeout(r, 200));
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
    console.log(`Saved screenshot to ${outFilename}`);
  };

  const variants = [
    {
      name: 'fog_v1_subtle_reduction',
      // slightly smaller radius, lower mid-stop opacity
      grad: 'radial-gradient(ellipse 520px 360px at 50% 28%, rgba(255, 253, 248, 0.90) 0%, rgba(255, 253, 248, 0.70) 40%, rgba(255, 253, 248, 0.20) 70%, rgba(255, 253, 248, 0) 100%)'
    },
    {
      name: 'fog_v2_moderate_vibrant',
      // more focused halo behind text, leaves flowers very clear
      grad: 'radial-gradient(ellipse 460px 320px at 50% 28%, rgba(255, 253, 248, 0.85) 0%, rgba(255, 253, 248, 0.55) 45%, rgba(255, 253, 248, 0) 75%)'
    },
    {
      name: 'fog_v3_balanced',
      // balanced: clean contrast for "339 Miracle Mile", vibrant foliage left & right
      grad: 'radial-gradient(ellipse 490px 340px at 50% 28%, rgba(255, 253, 248, 0.88) 0%, rgba(255, 253, 248, 0.60) 42%, rgba(255, 253, 248, 0.12) 68%, rgba(255, 253, 248, 0) 100%)'
    }
  ];

  for (const v of variants) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          let s = document.getElementById('fog-test-style');
          if (!s) {
            s = document.createElement('style');
            s.id = 'fog-test-style';
            document.head.appendChild(s);
          }
          s.innerHTML = '.about-visit-sec { background-image: ${v.grad}, url("../img/Floral-Pattern.jpeg") !important; }';
        })()
      `
    });
    await new Promise(r => setTimeout(r, 200));
    await captureElementClip('.visit-content-wrap', `${v.name}.jpg`);
  }

  chrome.kill();
  try { fs.rmSync(testProfile, { recursive: true, force: true }); } catch (e) {}
  server.close();
  process.exit(0);
});

