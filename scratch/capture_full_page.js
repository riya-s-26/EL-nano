const { spawn } = require('child_process');
const fs = require('fs');

async function captureFullPage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9226/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const curId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            if (msg.error) rej(msg.error);
            else res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 2400,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:8099/contact.html' });
    await new Promise(r => setTimeout(r, 3000));

    // Full page screenshot
    const scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/contact_full_desktop.png', Buffer.from(scr.data, 'base64'));
    console.log('Saved scratch/contact_full_desktop.png');

    // Also clip gallery specifically
    const galRect = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const r = document.querySelector('.contact-gallery-section').getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        })()
      `
    });

    if (galRect.result && galRect.result.value) {
      const gScr = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { ...galRect.result.value, scale: 2 } // 2x high-res
      });
      fs.writeFileSync('scratch/contact_gallery_2x.png', Buffer.from(gScr.data, 'base64'));
      console.log('Saved scratch/contact_gallery_2x.png');
    }

    // Clip location and map section
    const locRect = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const r = document.querySelector('.contact-location-section').getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        })()
      `
    });

    if (locRect.result && locRect.result.value) {
      const lScr = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { ...locRect.result.value, scale: 2 }
      });
      fs.writeFileSync('scratch/contact_location_map_2x.png', Buffer.from(lScr.data, 'base64'));
      console.log('Saved scratch/contact_location_map_2x.png');
    }

  } finally {
    chrome.kill();
  }
}

// Start server if needed
const http = require('http');
const path = require('path');
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/contact.html';
  const filePath = path.join(__dirname, '..', decodeURIComponent(reqPath));

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2'
  };

  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8099, '127.0.0.1', async () => {
  await captureFullPage();
  server.close();
  process.exit(0);
});

