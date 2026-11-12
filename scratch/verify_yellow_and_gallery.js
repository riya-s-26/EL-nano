const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8192;
const CDP_PORT = 9299;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1c5867c2-1f21-401d-8597-dd683112d73e';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/contact.html';
  const filePath = path.join(BASE_DIR, reqPath);

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
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  let list;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
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
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact.html` });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll through page to trigger lazy loading
  await send('Runtime.evaluate', {
    expression: `(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 800));

  const evalQuicklinks = await send('Runtime.evaluate', {
    expression: `(() => {
      const icons = Array.from(document.querySelectorAll('.quicklink-item-icon')).map(el => window.getComputedStyle(el).color);
      const labels = Array.from(document.querySelectorAll('.quicklink-item-label')).map(el => el.innerText.trim());
      const firstImg = document.querySelector('.contact-gallery-card img');
      return {
        iconsColors: icons,
        labels: labels,
        firstImgSrc: firstImg ? firstImg.currentSrc || firstImg.src : null,
        naturalWidth: firstImg ? firstImg.naturalWidth : null,
        naturalHeight: firstImg ? firstImg.naturalHeight : null,
        complete: firstImg ? firstImg.complete : false
      };
    })()`,
    returnByValue: true
  });

  console.log('=== CONTACT PAGE EVALUATION ===');
  console.log(JSON.stringify(evalQuicklinks.result.value, null, 2));

  // Screenshot helper using absolute document coordinates
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
      console.log(`Clipping ${selector} at:`, b);
      const shot = await send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 90,
        clip: { x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width, height: b.height, scale: 1 },
        captureBeyondViewport: true
      });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, filename), Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    }
  };

  await clipSection('.contact-quicklinks-panel', 'quicklinks_yellow.jpg');
  await clipSection('.contact-gallery-card:first-child', 'gallery_card1_bottom_fixed.jpg');
  await clipSection('.contact-gallery-grid', 'gallery_all_cards.jpg');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});
