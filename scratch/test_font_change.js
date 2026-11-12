const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8203;
const CDP_PORT = 9316;
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

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_test_profile_font');
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
    await new Promise(r => setTimeout(r, 300));
    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
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

  // Original state clip
  await captureElementClip('.about-visit-sec', 'font_comparison_original.jpg');

  // Test Option A: Only heading changed to Paytone One
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const style = document.createElement('style');
        style.id = 'test-opt-a';
        style.innerHTML = '.visit-main-heading { font-family: var(--font-display) !important; }';
        document.head.appendChild(style);
      })()
    `
  });
  await captureElementClip('.about-visit-sec', 'font_comparison_optA_heading_only.jpg');

  // Test Option B: All text in .visit-content-wrap changed to Paytone One
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('test-opt-a').remove();
        const style = document.createElement('style');
        style.id = 'test-opt-b';
        style.innerHTML = '.about-visit-sec, .about-visit-sec * { font-family: var(--font-display) !important; }';
        document.head.appendChild(style);
      })()
    `
  });
  await captureElementClip('.about-visit-sec', 'font_comparison_optB_all_text.jpg');

  // Test Option C: .about-visit-sec has font-family: var(--font-display), and headings/pills use Paytone One while keeping table legible, OR
  // Let's also capture .visit-content-wrap specific clip
  await captureElementClip('.visit-content-wrap', 'font_comparison_optB_content_wrap.jpg');

  chrome.kill();
  server.close();
  process.exit(0);
});

