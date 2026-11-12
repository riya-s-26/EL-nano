const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8168;
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
  try {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      '--remote-debugging-port=9278',
      '--disable-gpu',
      '--no-sandbox',
      'about:blank'
    ]);

    let list;
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise(r => setTimeout(r, 500));
      try {
        const res = await fetch('http://127.0.0.1:9278/json');
        list = await res.json();
        break;
      } catch (e) {}
    }

    const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((res, rej) => {
      const cid = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === cid) {
          ws.removeEventListener('message', handler);
          if (msg.error) rej(msg.error); else res(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: cid, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });

    console.log('=== VERIFYING ABOUT.HTML (HERO & HOSPITALITY CARDS) ===');
    const viewports = [
      { name: 'desktop_1920', w: 1920, h: 1080, mobile: false },
      { name: 'desktop_1366', w: 1366, h: 768, mobile: false },
      { name: 'tablet_768', w: 768, h: 1024, mobile: false },
      { name: 'mobile_390', w: 390, h: 844, mobile: true },
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await send('Page.navigate', { url: `http://localhost:${PORT}/about.html` });
      await new Promise(r => setTimeout(r, 500));

      // Scroll to trigger all lazy items
      await send('Runtime.evaluate', {
        expression: `
          (async () => {
            for (let y = 0; y <= document.body.scrollHeight; y += 400) {
              window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 30));
            }
            window.scrollTo(0, 0);
          })()
        `,
        awaitPromise: true
      });
      await new Promise(r => setTimeout(r, 400));

      // Measure Hero & Cards
      const data = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const hero = document.querySelector('.hero.about-hero');
            const hTitle = document.querySelector('.about-hero-title');
            const heroRect = hero ? hero.getBoundingClientRect() : null;
            const titleRect = hTitle ? hTitle.getBoundingClientRect() : null;

            const c2 = document.querySelector('.atmo-card-bar');
            const c3 = document.querySelector('.atmo-card-terrace');
            const c2Rect = c2 ? c2.getBoundingClientRect() : null;
            const c3Rect = c3 ? c3.getBoundingClientRect() : null;
            const c2Img = c2 ? c2.querySelector('.atmo-card-media img') : null;
            const c3Img = c3 ? c3.querySelector('.atmo-card-media img') : null;
            const c2ImgRect = c2Img ? c2Img.getBoundingClientRect() : null;
            const c3ImgRect = c3Img ? c3Img.getBoundingClientRect() : null;
            const c2Body = c2 ? c2.querySelector('.atmo-card-body') : null;
            const c3Body = c3 ? c3.querySelector('.atmo-card-body') : null;
            const c2BodyRect = c2Body ? c2Body.getBoundingClientRect() : null;
            const c3BodyRect = c3Body ? c3Body.getBoundingClientRect() : null;

            return {
              heroWidth: heroRect ? Math.round(heroRect.width) : 0,
              heroHeight: heroRect ? Math.round(heroRect.height) : 0,
              titleCenterDiff: (heroRect && titleRect) ? Math.round((titleRect.left + titleRect.width / 2) - (heroRect.left + heroRect.width / 2)) : 0,
              c2Width: c2Rect ? Math.round(c2Rect.width) : 0,
              c3Width: c3Rect ? Math.round(c3Rect.width) : 0,
              c2Height: c2Rect ? Math.round(c2Rect.height) : 0,
              c3Height: c3Rect ? Math.round(c3Rect.height) : 0,
              c2ImgHeight: c2ImgRect ? Math.round(c2ImgRect.height) : 0,
              c3ImgHeight: c3ImgRect ? Math.round(c3ImgRect.height) : 0,
              c2BodyHeight: c2BodyRect ? Math.round(c2BodyRect.height) : 0,
              c3BodyHeight: c3BodyRect ? Math.round(c3BodyRect.height) : 0,
              c2Top: c2Rect ? Math.round(c2Rect.top) : 0,
              c3Top: c3Rect ? Math.round(c3Rect.top) : 0,
              c2Title: c2 ? c2.querySelector('.atmo-feature-title')?.textContent.trim() : '',
              c3Title: c3 ? c3.querySelector('.atmo-feature-title')?.textContent.trim() : '',
              c2Desc: c2 ? c2.querySelector('.atmo-feature-desc')?.textContent.trim() : '',
              c3Desc: c3 ? c3.querySelector('.atmo-feature-desc')?.textContent.trim() : ''
            };
          })()
        `,
        returnByValue: true
      });

      const m = data.result.value;
      console.log(`\n[Viewport ${vp.name}]`);
      console.log(`  Hero: ${m.heroWidth} x ${m.heroHeight}px | Title Center Diff: ${m.titleCenterDiff}px`);
      console.log(`  Card 02 Width: ${m.c2Width}px, Card 03 Width: ${m.c3Width}px (Equal: ${m.c2Width === m.c3Width})`);
      console.log(`  Card 02 Height: ${m.c2Height}px, Card 03 Height: ${m.c3Height}px (Equal: ${m.c2Height === m.c3Height})`);
      console.log(`  Image Heights: C02=${m.c2ImgHeight}px, C03=${m.c3ImgHeight}px (Equal: ${m.c2ImgHeight === m.c3ImgHeight})`);
      console.log(`  Content Body Heights: C02=${m.c2BodyHeight}px, C03=${m.c3BodyHeight}px (Equal: ${m.c2BodyHeight === m.c3BodyHeight})`);
      console.log(`  Card 02: "${m.c2Title}" - "${m.c2Desc}"`);
      console.log(`  Card 03: "${m.c3Title}" - "${m.c3Desc}"`);

      // Screenshots
      if (vp.name === 'desktop_1366' || vp.name === 'mobile_390') {
        // Screenshot Hero
        const heroBox = await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.querySelector('.hero.about-hero');
            const r = el.getBoundingClientRect();
            return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
          })()`,
          returnByValue: true
        });
        const hB = heroBox.result.value;
        const heroShot = await send('Page.captureScreenshot', {
          format: 'jpeg',
          quality: 90,
          clip: { x: hB.x, y: hB.y, width: hB.width, height: hB.height, scale: 1 }
        });
        fs.writeFileSync(path.join(ARTIFACTS_DIR, `hero_larger_${vp.name}.jpg`), Buffer.from(heroShot.data, 'base64'));

        // Screenshot Cards
        const cardBox = await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.querySelector('.atmo-duo-grid');
            const r = el.getBoundingClientRect();
            return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
          })()`,
          returnByValue: true
        });
        const cB = cardBox.result.value;
        const cardShot = await send('Page.captureScreenshot', {
          format: 'jpeg',
          quality: 90,
          clip: { x: cB.x, y: cB.y, width: cB.width, height: cB.height, scale: 1 }
        });
        fs.writeFileSync(path.join(ARTIFACTS_DIR, `hospitality_cards_matched_${vp.name}.jpg`), Buffer.from(cardShot.data, 'base64'));
      }
    }

    console.log('\n=== VERIFYING CONTACT.HTML (FLORAL BACKGROUND) ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: `http://localhost:${PORT}/contact.html` });
    await new Promise(r => setTimeout(r, 600));

    const contactMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.contact-main-body');
        const s = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          bgImage: s.backgroundImage,
          bgColor: s.backgroundColor,
          width: Math.round(r.width),
          height: Math.round(r.height),
          y: Math.round(r.top + window.scrollY)
        };
      })()`,
      returnByValue: true
    });
    const cM = contactMetrics.result.value;
    console.log(`  Contact Floral Background: ${cM.bgImage}`);
    console.log(`  Dimensions: ${cM.width} x ${cM.height}px`);

    const contactShot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
      clip: { x: 0, y: cM.y, width: 1366, height: 750, scale: 1 }
    });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'contact_floral_richer_1366.jpg'), Buffer.from(contactShot.data, 'base64'));

    chrome.kill();
    server.close();
    console.log('\n=== ALL TASKS COMPLETED AND SCREENSHOTS CAPTURED ===');
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  }
});
