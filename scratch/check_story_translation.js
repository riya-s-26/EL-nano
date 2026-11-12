const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8185;
const CDP_PORT = 9295;
const BASE_DIR = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/about.html';
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
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
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

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1500));

  const extract = async (label) => {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#story');
        if (!sec) return { error: 'No #story' };
        return {
          eyebrow: sec.querySelector('.eyebrow-text')?.innerText,
          eyebrowColor: window.getComputedStyle(sec.querySelector('.eyebrow-text')).color,
          lineColor: window.getComputedStyle(sec.querySelector('.eyebrow-line')).backgroundColor,
          title: sec.querySelector('.editorial-heading')?.innerText,
          lead: sec.querySelector('.editorial-lead')?.innerText,
          body: sec.querySelector('.editorial-body')?.innerText,
          housesNote: sec.querySelector('.houses-note')?.innerText,
          miami: sec.querySelector('.house-badge.current .house-sub')?.innerText,
          bcn: sec.querySelectorAll('.house-badge .house-sub')[1]?.innerText,
          zgza: sec.querySelectorAll('.house-badge .house-sub')[2]?.innerText,
          mad: sec.querySelectorAll('.house-badge .house-sub')[3]?.innerText,
          pillYear: sec.querySelector('.pill-year')?.innerText,
          pillLabel: sec.querySelector('.pill-label')?.innerText,
          caption: sec.querySelector('.story-caption')?.innerText
        };
      })()`,
      returnByValue: true
    });
    console.log(`=== ${label} ===`);
    console.log(JSON.stringify(res.result.value, null, 2));
  };

  await extract('INITIAL / ENGLISH');

  // Trigger switch to Spanish
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="es"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  await extract('AFTER SPANISH SWITCH');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

