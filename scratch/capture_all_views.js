const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8240;
const CDP_PORT = 9350;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

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
    `--user-data-dir=${path.join(BASE_DIR, 'scratch', 'chrome_visit_multiview')}`,
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

  async function captureView(width, height, isMobile, lang, outName) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
    await new Promise(r => setTimeout(r, 1200));

    if (lang === 'es') {
      await send('Runtime.evaluate', {
        expression: `(() => {
          if (window.i18n && typeof window.i18n.setLanguage === 'function') {
            window.i18n.setLanguage('es');
          } else {
            const btn = document.querySelector('[data-lang="es"]') || document.querySelector('.lang-btn-es');
            if (btn) btn.click();
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 600));
    }

    // Reveal elements
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('[data-reveal]').forEach(r => {
          r.classList.add('revealed');
          r.style.opacity = '1';
          r.style.transform = 'none';
        });
      })()`
    });

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
      width,
      height: pm.totalHeight + 100,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
    await new Promise(r => setTimeout(r, 400));

    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
      clip: {
        x: Math.max(0, pm.secX),
        y: Math.max(0, pm.secY),
        width: Math.min(width, pm.secWidth),
        height: pm.secHeight,
        scale: 1
      }
    });

    const targetPath = path.join(ARTIFACTS_DIR, outName);
    fs.writeFileSync(targetPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${outName} (${pm.secWidth}x${pm.secHeight})`);
  }

  await captureView(1200, 900, false, 'en', 'visit_verified_desktop_en.jpg');
  await captureView(1024, 768, false, 'en', 'visit_verified_1024_en.jpg');
  await captureView(768, 1024, false, 'en', 'visit_verified_tablet_en.jpg');
  await captureView(375, 812, true, 'en', 'visit_verified_mobile_en.jpg');
  await captureView(1200, 900, false, 'es', 'visit_verified_desktop_es.jpg');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

