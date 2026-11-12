const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8175;
const CDP_PORT = 9285;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\1c5867c2-1f21-401d-8597-dd683112d73e';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/about.html';
  const filePath = path.join(BASE_DIR, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
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
  console.log(`Server running at http://127.0.0.1:${PORT}`);
  let chrome;
  try {
    chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      `--remote-debugging-port=${CDP_PORT}`,
      '--disable-gpu',
      '--no-sandbox',
      'about:blank'
    ]);

    let list;
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise(r => setTimeout(r, 400));
      try {
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
        list = await res.json();
        if (list && list.length > 0) break;
      } catch (e) {}
    }

    const target = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (evt) => {
          const parsed = JSON.parse(evt.data);
          if (parsed.id === id) {
            ws.removeEventListener('message', handler);
            if (parsed.error) reject(parsed.error);
            else resolve(parsed.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Navigate to about.html
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
    await new Promise(r => setTimeout(r, 2000));

    // Function to extract section data
    const getSectionData = `(() => {
      const teamEyebrow = document.querySelector('.about-team-sec .eyebrow-text')?.innerText?.trim();
      const teamTitle = document.querySelector('.about-team-sec .editorial-heading')?.innerText?.trim();
      const teamLead = document.querySelector('.about-team-sec .editorial-subtitle')?.innerText?.trim();
      const teamCaption = document.querySelector('.team-caption-quote')?.innerText?.trim();
      const p1Title = document.querySelector('.team-pillar-item:nth-child(1) h4')?.innerText?.trim();
      const p1Desc = document.querySelector('.team-pillar-item:nth-child(1) p')?.innerText?.trim();
      const p2Title = document.querySelector('.team-pillar-item:nth-child(2) h4')?.innerText?.trim();
      const p2Desc = document.querySelector('.team-pillar-item:nth-child(2) p')?.innerText?.trim();
      const p3Title = document.querySelector('.team-pillar-item:nth-child(3) h4')?.innerText?.trim();
      const p3Desc = document.querySelector('.team-pillar-item:nth-child(3) p')?.innerText?.trim();

      const diffEyebrowEl = document.querySelector('.about-highlights-sec .eyebrow-text');
      const diffLineEl = document.querySelector('.about-highlights-sec .eyebrow-line');
      const diffEyebrow = diffEyebrowEl?.innerText?.trim();
      const diffEyebrowColor = diffEyebrowEl ? window.getComputedStyle(diffEyebrowEl).color : null;
      const diffLineColor = diffLineEl ? window.getComputedStyle(diffLineEl).backgroundColor : null;
      const diffTitle = document.querySelector('.about-highlights-sec .editorial-heading')?.innerText?.trim();
      const diffDesc = document.querySelector('.about-highlights-sec .editorial-subtitle')?.innerText?.trim();
      const dishLine = document.querySelector('.pill-desc[data-i18n="feat_dish_line"]')?.innerText?.trim();

      return {
        teamEyebrow, teamTitle, teamLead, teamCaption,
        p1Title, p1Desc, p2Title, p2Desc, p3Title, p3Desc,
        diffEyebrow, diffEyebrowColor, diffLineColor, diffTitle, diffDesc, dishLine
      };
    })()`;

    // Verify EN state
    const enEval = await send('Runtime.evaluate', {
      expression: getSectionData,
      returnByValue: true
    });

    console.log('--- ENGLISH EVALUATION ---');
    console.log(JSON.stringify(enEval.result.value, null, 2));

    // Capture screenshots of Team and Difference sections in EN
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

    await clipSection('.about-team-sec', 'our_family_section_en.jpg');
    await clipSection('.about-highlights-sec', 'difference_section_en.jpg');

    // Switch to Spanish via clicking the language button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const esBtn = document.querySelector('.lang-btn[data-lang="es"]');
        if (esBtn) esBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Verify ES state
    const esEval = await send('Runtime.evaluate', {
      expression: getSectionData,
      returnByValue: true
    });

    console.log('--- SPANISH EVALUATION ---');
    console.log(JSON.stringify(esEval.result.value, null, 2));

    await clipSection('.about-team-sec', 'our_family_section_es.jpg');
    await clipSection('.about-highlights-sec', 'difference_section_es.jpg');

    ws.close();
    chrome.kill();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Error during verification:', err);
    if (chrome) chrome.kill();
    server.close();
    process.exit(1);
  }
});
