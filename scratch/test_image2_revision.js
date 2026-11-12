const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8205;
const CDP_PORT = 9318;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/contact.html';
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

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_test_profile_white_panel');
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
    await send('Emulation.setVisibleSize', { width: w, height: h });
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
        x: Math.max(0, box.x - 12),
        y: Math.max(0, box.y - 12),
        width: box.width + 24,
        height: box.height + 24,
        scale: 1
      }
    });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(path.join(ARTIFACTS_DIR, outFilename), buf);
    console.log(`Saved screenshot to ${outFilename} (${buf.length} bytes)`);
  };

  try {
    console.log('=== TESTING CONTACT US WHITE QUICK LINKS PANEL ===');
    await setViewport(1366, 800);
    await navigateTo(`http://127.0.0.1:${PORT}/contact.html?lang=en`);

    // Verify computed styles in EN
    const stylesEn = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const panel = document.querySelector('.contact-quicklinks-panel');
          const title = document.querySelector('.quicklinks-panel-title');
          const allLabels = Array.from(document.querySelectorAll('.quicklink-item-label')).map(l => ({
            text: l.innerText.trim(),
            color: window.getComputedStyle(l).color
          }));
          const allIcons = Array.from(document.querySelectorAll('.quicklink-item-icon')).map(i => ({
            color: window.getComputedStyle(i).color
          }));

          const panelStyle = window.getComputedStyle(panel);
          const titleStyle = window.getComputedStyle(title);

          return {
            panelBg: panelStyle.backgroundColor,
            panelBorder: panelStyle.border,
            titleColor: titleStyle.color,
            titleText: title.innerText.trim(),
            labels: allLabels,
            icons: allIcons
          };
        })()
      `,
      returnByValue: true
    });

    console.log('EN Computed Styles:', JSON.stringify(stylesEn.result.value, null, 2));

    await captureElementClip('.contact-quicklinks-section', 'contact_quicklinks_white_desktop.jpg');

    // Test tablet
    await setViewport(768, 1024);
    await new Promise(r => setTimeout(r, 400));
    await captureElementClip('.contact-quicklinks-section', 'contact_quicklinks_white_tablet.jpg');

    // Test mobile
    await setViewport(375, 812);
    await new Promise(r => setTimeout(r, 400));
    await captureElementClip('.contact-quicklinks-section', 'contact_quicklinks_white_mobile.jpg');

    // Test Spanish
    await setViewport(1366, 800);
    await navigateTo(`http://127.0.0.1:${PORT}/contact.html?lang=es`);

    const stylesEs = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const panel = document.querySelector('.contact-quicklinks-panel');
          const title = document.querySelector('.quicklinks-panel-title');
          const allLabels = Array.from(document.querySelectorAll('.quicklink-item-label')).map(l => ({
            text: l.innerText.trim(),
            color: window.getComputedStyle(l).color
          }));
          const allIcons = Array.from(document.querySelectorAll('.quicklink-item-icon')).map(i => ({
            color: window.getComputedStyle(i).color
          }));

          const panelStyle = window.getComputedStyle(panel);
          const titleStyle = window.getComputedStyle(title);

          return {
            panelBg: panelStyle.backgroundColor,
            titleColor: titleStyle.color,
            titleText: title.innerText.trim(),
            labels: allLabels,
            icons: allIcons
          };
        })()
      `,
      returnByValue: true
    });

    console.log('ES Computed Styles:', JSON.stringify(stylesEs.result.value, null, 2));
    await captureElementClip('.contact-quicklinks-section', 'contact_quicklinks_white_es.jpg');

    console.log('Console Errors:', consoleLogs.filter(l => l.type === 'error'));

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    try { chrome.kill(); } catch (e) {}
    try { fs.rmSync(testProfile, { recursive: true, force: true }); } catch (e) {}
    server.close();
    process.exit(0);
  }
});
