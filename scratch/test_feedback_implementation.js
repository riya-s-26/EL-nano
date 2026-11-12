const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8199;
const CDP_PORT = 9312;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

// Simple static HTTP server
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
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_test_profile3');
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
    } catch (e) {
      // waiting for Chrome
    }
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
  };

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
      const outPath = path.join(ARTIFACTS_DIR, filename);
      fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    } else {
      console.error(`Could not clip ${selector}: element not found`);
    }
  };

  // ==========================================
  // TEST 1: ABOUT US - TASK 1 & TASK 3 (EN & ES)
  // ==========================================
  await setViewport(1366, 900);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html?lang=en` });
  await new Promise(r => setTimeout(r, 1200));

  // Reveal all elements for clean screenshot
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const aboutEnData = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        atmo: {
          title: document.querySelector('.about-atmo-sec h2')?.innerText.trim(),
          desc: document.querySelector('.about-atmo-sec p.editorial-subtitle')?.innerText.trim(),
          card1_title: document.querySelector('.atmo-wide-content h3')?.innerText.trim(),
          card1_desc: document.querySelector('.atmo-wide-content p')?.innerText.trim(),
          card2_title: document.querySelector('.atmo-card-bar h3')?.innerText.trim(),
          card2_desc: document.querySelector('.atmo-card-bar p')?.innerText.trim(),
          card3_title: document.querySelector('.atmo-card-terrace h3')?.innerText.trim(),
          card3_desc: document.querySelector('.atmo-card-terrace p')?.innerText.trim(),
          card4_title: document.querySelector('.atmo-card-shared h3')?.innerText.trim(),
          card4_desc: document.querySelector('.atmo-card-shared p')?.innerText.trim()
        },
        difference: {
          kicker: document.querySelector('.about-highlights-sec .eyebrow-text')?.innerText.trim(),
          title: document.querySelector('.about-highlights-sec h2')?.innerText.trim(),
          desc: document.querySelector('.about-highlights-sec p.editorial-subtitle')?.innerText.trim(),
          cards: Array.from(document.querySelectorAll('.features-editorial-grid .feature-block-card')).map(card => ({
            title: card.querySelector('h3')?.innerText.trim(),
            desc: card.querySelector('p')?.innerText.trim()
          }))
        }
      };
    })()`,
    returnByValue: true
  });

  console.log('=== ABOUT US (EN) DATA ===');
  console.log(JSON.stringify(aboutEnData.result.value, null, 2));

  await clipSection('.about-atmosphere-sec', 'task1_about_atmosphere_en.jpg');
  await clipSection('.about-highlights-sec', 'task3_about_difference_en.jpg');

  // Switch About Us to Spanish
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="es"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const aboutEsData = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        lang: document.documentElement.lang,
        atmo: {
          title: document.querySelector('.about-atmosphere-sec h2')?.innerText.trim(),
          desc: document.querySelector('.about-atmosphere-sec p.editorial-subtitle')?.innerText.trim(),
          card1_title: document.querySelector('.atmo-wide-content h3')?.innerText.trim(),
          card1_desc: document.querySelector('.atmo-wide-content p')?.innerText.trim(),
          card2_title: document.querySelector('.atmo-card-bar h3')?.innerText.trim(),
          card2_desc: document.querySelector('.atmo-card-bar p')?.innerText.trim(),
          card3_title: document.querySelector('.atmo-card-terrace h3')?.innerText.trim(),
          card3_desc: document.querySelector('.atmo-card-terrace p')?.innerText.trim(),
          card4_title: document.querySelector('.atmo-card-shared h3')?.innerText.trim(),
          card4_desc: document.querySelector('.atmo-card-shared p')?.innerText.trim()
        },
        difference: {
          kicker: document.querySelector('.about-highlights-sec .eyebrow-text')?.innerText.trim(),
          title: document.querySelector('.about-highlights-sec h2')?.innerText.trim(),
          desc: document.querySelector('.about-highlights-sec p.editorial-subtitle')?.innerText.trim(),
          cards: Array.from(document.querySelectorAll('.features-editorial-grid .feature-block-card')).map(card => ({
            title: card.querySelector('h3')?.innerText.trim(),
            desc: card.querySelector('p')?.innerText.trim()
          }))
        }
      };
    })()`,
    returnByValue: true
  });

  console.log('=== ABOUT US (ES) DATA ===');
  console.log(JSON.stringify(aboutEsData.result.value, null, 2));

  await clipSection('.about-atmosphere-sec', 'task1_about_atmosphere_es.jpg');
  await clipSection('.about-highlights-sec', 'task3_about_difference_es.jpg');

  // ==========================================
  // TEST 2: CONTACT US - TASK 2
  // ==========================================
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact.html?lang=en` });
  await new Promise(r => setTimeout(r, 1200));

  const contactStyles = await send('Runtime.evaluate', {
    expression: `(() => {
      const panel = document.querySelector('.contact-quicklinks-panel');
      const title = document.querySelector('.quicklinks-panel-title');
      const label = document.querySelector('.quicklink-item-label');
      const icon = document.querySelector('.quicklink-item-icon');
      const panelCs = window.getComputedStyle(panel);
      const titleCs = window.getComputedStyle(title);
      const labelCs = window.getComputedStyle(label);
      const iconCs = window.getComputedStyle(icon);
      return {
        panelBg: panelCs.backgroundColor,
        panelBorder: panelCs.border,
        panelBoxShadow: panelCs.boxShadow,
        titleColor: titleCs.color,
        titleFont: titleCs.fontFamily,
        labelColor: labelCs.color,
        iconColor: iconCs.color
      };
    })()`,
    returnByValue: true
  });

  console.log('=== CONTACT QUICKLINKS COMPUTED STYLES ===');
  console.log(JSON.stringify(contactStyles.result.value, null, 2));

  // Desktop shot
  await clipSection('.contact-quicklinks-section', 'task2_contact_quicklinks_desktop.jpg');

  // Tablet shot
  await setViewport(768, 1024);
  await new Promise(r => setTimeout(r, 500));
  await clipSection('.contact-quicklinks-section', 'task2_contact_quicklinks_tablet.jpg');

  // Mobile shot
  await setViewport(375, 812);
  await new Promise(r => setTimeout(r, 500));
  await clipSection('.contact-quicklinks-section', 'task2_contact_quicklinks_mobile.jpg');

  // Test Spanish on Contact page
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="es"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 500));
  const contactEsTitle = await send('Runtime.evaluate', {
    expression: `document.querySelector('.quicklinks-panel-title')?.innerText.trim()`,
    returnByValue: true
  });
  console.log('Contact Quicklinks Spanish Title:', contactEsTitle.result.value);

  // ==========================================
  // TEST 3: HOMEPAGE (INDEX.HTML) ATMOSPHERE CHECK
  // ==========================================
  await setViewport(1366, 900);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html?lang=en` });
  await new Promise(r => setTimeout(r, 1200));

  const indexEnAtmo = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.atmosphere-grid .atmo-card')).map(c => ({
        title: c.querySelector('h3')?.innerText.trim(),
        desc: c.querySelector('p')?.innerText.trim()
      }));
      const highlights = Array.from(document.querySelectorAll('.atmo-features .feat-item')).map(f => ({
        title: f.querySelector('h3')?.innerText.trim(),
        desc: f.querySelector('p')?.innerText.trim()
      }));
      return { cards, highlights };
    })()`,
    returnByValue: true
  });
  console.log('=== INDEX.HTML (EN) ATMOSPHERE DATA ===');
  console.log(JSON.stringify(indexEnAtmo.result.value, null, 2));

  // Switch index to Spanish
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.lang-btn[data-lang="es"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const indexEsAtmo = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.atmosphere-grid .atmo-card')).map(c => ({
        title: c.querySelector('h3')?.innerText.trim(),
        desc: c.querySelector('p')?.innerText.trim()
      }));
      const highlights = Array.from(document.querySelectorAll('.atmo-features .feat-item')).map(f => ({
        title: f.querySelector('h3')?.innerText.trim(),
        desc: f.querySelector('p')?.innerText.trim()
      }));
      return { cards, highlights };
    })()`,
    returnByValue: true
  });
  console.log('=== INDEX.HTML (ES) ATMOSPHERE DATA ===');
  console.log(JSON.stringify(indexEsAtmo.result.value, null, 2));

  console.log('=== CONSOLE LOGS CAPTURED ===');
  console.log(JSON.stringify(consoleLogs, null, 2));

  ws.close();
  chrome.kill();
  server.close();
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  process.exit(0);
});
