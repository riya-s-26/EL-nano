const { spawn } = require('child_process');
const fs = require('fs');

async function captureMobileFull() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9227/json');
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
      width: 390,
      height: 3400,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:8099/contact.html' });
    await new Promise(r => setTimeout(r, 3000));

    const scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/contact_full_mobile_390.png', Buffer.from(scr.data, 'base64'));
    console.log('Saved scratch/contact_full_mobile_390.png');

  } finally {
    chrome.kill();
  }
}

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
  await captureMobileFull();
  server.close();
  process.exit(0);
});

