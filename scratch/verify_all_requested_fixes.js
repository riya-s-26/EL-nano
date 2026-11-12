const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8188;
const CDP_PORT = 9298;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1c5867c2-1f21-401d-8597-dd683112d73e';

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
  console.log(`Server listening on port ${PORT}`);
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

  // 1. VERIFY ABOUT.HTML
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1500));

  const extractStory = `(() => {
    const sec = document.querySelector('#story');
    if (!sec) return { error: 'No #story found' };
    const eb = sec.querySelector('.eyebrow-text');
    const el = sec.querySelector('.eyebrow-line');
    return {
      eyebrowText: eb ? eb.innerText.trim() : null,
      eyebrowColor: eb ? window.getComputedStyle(eb).color : null,
      lineColor: el ? window.getComputedStyle(el).backgroundColor : null,
      title: sec.querySelector('.editorial-heading')?.innerText.trim(),
      lead: sec.querySelector('.editorial-lead')?.innerText.trim(),
      body: sec.querySelector('.editorial-body')?.innerText.trim(),
      housesNote: sec.querySelector('.houses-note')?.innerText.trim(),
      miami: sec.querySelector('.house-badge.current .house-sub')?.innerText.trim(),
      bcn: sec.querySelectorAll('.house-badge .house-sub')[1]?.innerText.trim(),
      zgza: sec.querySelectorAll('.house-badge .house-sub')[2]?.innerText.trim(),
      mad: sec.querySelectorAll('.house-badge .house-sub')[3]?.innerText.trim(),
      pillYear: sec.querySelector('.pill-year')?.innerText.trim(),
      pillLabel: sec.querySelector('.pill-label')?.innerText.trim(),
      caption: sec.querySelector('.story-caption')?.innerText.trim()
    };
  })()`;

  const enStory = await send('Runtime.evaluate', { expression: extractStory, returnByValue: true });
  console.log('=== ABOUT PAGE: WHERE IT STARTED (ENGLISH) ===');
  console.log(JSON.stringify(enStory.result.value, null, 2));

  // Screenshot Story EN
  const clipSection = async (selector, filename) => {
    const box = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: window.scrollY + rect.y, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });
    if (box.result.value) {
      const b = box.result.value;
      const shot = await send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 90,
        clip: { x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width, height: b.height, scale: 1 }
      });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, filename), Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    }
  };

  await clipSection('#story', 'about_story_en.jpg');

  // Switch to Spanish
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="es"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const esStory = await send('Runtime.evaluate', { expression: extractStory, returnByValue: true });
  console.log('=== ABOUT PAGE: WHERE IT STARTED (SPANISH) ===');
  console.log(JSON.stringify(esStory.result.value, null, 2));

  await clipSection('#story', 'about_story_es.jpg');

  // 2. VERIFY CONTACT.HTML
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact.html` });
  await new Promise(r => setTimeout(r, 1500));

  const contactEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const heroDash = document.querySelector('.contact-hero-dash');
      const heroKicker = document.querySelector('.contact-hero-kicker');
      const locDash = document.querySelector('.contact-loc-dash');
      const locKicker = document.querySelector('.contact-loc-kicker');
      const watermark = document.querySelector('.card-leaf-watermark');

      return {
        heroDashColor: heroDash ? window.getComputedStyle(heroDash).backgroundColor : null,
        heroKickerColor: heroKicker ? window.getComputedStyle(heroKicker).color : null,
        locDashColor: locDash ? window.getComputedStyle(locDash).backgroundColor : null,
        locKickerColor: locKicker ? window.getComputedStyle(locKicker).color : null,
        watermarkDisplay: watermark ? window.getComputedStyle(watermark).display : 'not found'
      };
    })()`,
    returnByValue: true
  });

  console.log('=== CONTACT PAGE: HERO & CARDS STYLING ===');
  console.log(JSON.stringify(contactEval.result.value, null, 2));

  await clipSection('.contact-hero', 'contact_hero_fixed.jpg');
  await clipSection('.contact-cards-section', 'contact_cards_fixed.jpg');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

