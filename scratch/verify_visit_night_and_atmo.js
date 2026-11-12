const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8196;
const CDP_PORT = 9310;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1c5867c2-1f21-401d-8597-dd683112d73e';

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
      fs.writeFileSync(path.join(ARTIFACTS_DIR, filename), Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    }
  };

  // 1. VERIFY ABOUT.HTML VISIT SECTION PHOTOS
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1000));

  const aboutVisitEval = await send('Runtime.evaluate', {
    expression: `(async () => {
      const el = document.querySelector('.visit-gallery-grid');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(r => setTimeout(r, 600));
      const imgs = Array.from(document.querySelectorAll('.visit-gallery-grid img'));
      await Promise.all(imgs.map(img => img.decode().catch(() => {})));
      return {
        visitPhotos: imgs.map(img => ({
          currentSrc: img.currentSrc || img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          alt: img.alt
        }))
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('=== ABOUT.HTML VISIT SECTION NIGHT PHOTOS ===');
  console.log(JSON.stringify(aboutVisitEval.result.value, null, 2));

  await clipSection('#visit', 'about_visit_night_photos.jpg');

  // 2. VERIFY INDEX.HTML ATMOSPHERE SECTION COPY & CARD 4
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll through to load lazy images
  await send('Runtime.evaluate', {
    expression: `(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 1000));

  const indexAtmoEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const atmo = document.querySelector('.atmosphere');
      if (!atmo) return { error: 'No .atmosphere' };
      const kicker = atmo.querySelector('.kicker')?.innerText.trim();
      const title = atmo.querySelector('h2')?.innerText.trim();
      const desc = atmo.querySelector('p')?.innerText.trim();
      const card4Img = atmo.querySelectorAll('.atmo-card img')[3]?.currentSrc || atmo.querySelectorAll('.atmo-card img')[3]?.src;
      const card4Desc = atmo.querySelectorAll('.atmo-card p')[3]?.innerText.trim();
      return { kicker, title, desc, card4Img, card4Desc };
    })()`,
    returnByValue: true
  });
  console.log('=== INDEX.HTML ATMOSPHERE COPY (EN) ===');
  console.log(JSON.stringify(indexAtmoEval.result.value, null, 2));

  await clipSection('.atmosphere', 'index_atmosphere_updated.jpg');

  // Switch index to Spanish
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="es"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const indexAtmoEsEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const atmo = document.querySelector('.atmosphere');
      const kicker = atmo.querySelector('.kicker')?.innerText.trim();
      const title = atmo.querySelector('h2')?.innerText.trim();
      const desc = atmo.querySelector('p')?.innerText.trim();
      return { kicker, title, desc };
    })()`,
    returnByValue: true
  });
  console.log('=== INDEX.HTML ATMOSPHERE COPY (ES) ===');
  console.log(JSON.stringify(indexAtmoEsEval.result.value, null, 2));

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});
