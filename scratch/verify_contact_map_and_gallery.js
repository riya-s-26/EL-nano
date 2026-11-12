const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Start local HTTP server to avoid file:// CORS or tile restrictions
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
  console.log('HTTP Server listening on http://127.0.0.1:8099');
  await runTests();
  server.close();
  process.exit(0);
});

async function runTests() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9225/json');
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
    await send('DOM.enable');

    console.log('\n--- 1. LOADING CONTACT PAGE ON 1440x1200 ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 2, // 2x Retina
      mobile: false
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:8099/contact.html' });
    await new Promise(r => setTimeout(r, 3500)); // allow tiles to load

    // Audit map and gallery elements
    const auditRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const mapEl = document.getElementById('contact-map');
          const isLeafletInit = mapEl ? mapEl.classList.contains('leaflet-container') : false;
          const tiles = document.querySelectorAll('.leaflet-tile-loaded');
          const marker = document.querySelector('.custom-el-nano-marker');
          const markerImg = marker ? marker.querySelector('img') : null;
          
          const galleryImgs = Array.from(document.querySelectorAll('.contact-gallery-card img')).map((img, i) => ({
            index: i + 1,
            src: img.currentSrc || img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            displayedWidth: img.clientWidth,
            displayedHeight: img.clientHeight,
            complete: img.complete
          }));

          const fsBtn = document.getElementById('map-fullscreen-btn');

          return {
            isLeafletInit,
            tileCount: tiles.length,
            hasMarker: !!marker,
            markerImgSrc: markerImg ? markerImg.src : null,
            markerImgLoaded: markerImg ? (markerImg.naturalWidth > 0) : false,
            galleryImgs,
            hasFsBtn: !!fsBtn
          };
        })()
      `
    });

    console.log('Audit Results:');
    console.log(JSON.stringify(auditRes.value, null, 2));

    // Capture full desktop screenshot
    const scr1 = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync('scratch/contact_verified_desktop_1440.png', Buffer.from(scr1.data, 'base64'));
    console.log('Saved scratch/contact_verified_desktop_1440.png');

    // Test Marker Click & Popup
    console.log('\n--- 2. TESTING POPUP INTERACTION ---');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const marker = document.querySelector('.custom-el-nano-marker');
          if (marker) marker.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const popupRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const popup = document.querySelector('.leaflet-popup-content');
          return popup ? popup.innerText.trim() : null;
        })()
      `
    });
    console.log('Popup Text after click:', popupRes.value);

    // Capture map closeup
    const clipAudit = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const sec = document.querySelector('.contact-location-section');
          const rect = sec.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        })()
      `
    });
    if (clipAudit.value) {
      const scrMap = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { ...clipAudit.value, scale: 1 }
      });
      fs.writeFileSync('scratch/contact_location_map_closeup.png', Buffer.from(scrMap.data, 'base64'));
      console.log('Saved scratch/contact_location_map_closeup.png');
    }

    // Capture gallery closeup
    const galleryClipAudit = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const sec = document.querySelector('.contact-gallery-section');
          const rect = sec.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        })()
      `
    });
    if (galleryClipAudit.value) {
      const scrGal = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { ...galleryClipAudit.value, scale: 1 }
      });
      fs.writeFileSync('scratch/contact_gallery_closeup.png', Buffer.from(scrGal.data, 'base64'));
      console.log('Saved scratch/contact_gallery_closeup.png');
    }

    // Viewport tests: Tablet (768px) and Mobile (390px)
    console.log('\n--- 3. TESTING TABLET 768px ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));
    const scrTablet = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/contact_verified_tablet_768.png', Buffer.from(scrTablet.data, 'base64'));
    console.log('Saved scratch/contact_verified_tablet_768.png');

    console.log('\n--- 4. TESTING MOBILE 390px ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));
    const scrMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/contact_verified_mobile_390.png', Buffer.from(scrMobile.data, 'base64'));
    console.log('Saved scratch/contact_verified_mobile_390.png');

    // Spanish language test
    console.log('\n--- 5. TESTING SPANISH (ES) SWITCH ---');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const esBtn = document.querySelector('.lang-btn[data-lang="es"]');
          if (esBtn) esBtn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const esAudit = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          return {
            heroTitle: document.querySelector('.contact-hero-title')?.innerText.trim(),
            callTitle: document.querySelector('.card-call-title')?.innerText.trim(),
            locKicker: document.querySelector('.contact-loc-kicker')?.innerText.trim(),
            locTitle: document.querySelector('.contact-loc-title')?.innerText.trim(),
            locDirections: document.querySelector('.contact-loc-directions-link')?.innerText.trim(),
            linksTitle: document.querySelector('.quicklinks-panel-title')?.innerText.trim(),
            closingText: document.querySelector('.closing-welcome-text')?.innerText.trim()
          };
        })()
      `
    });
    console.log('Spanish content audit:', esAudit.value);

    const scrES = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/contact_verified_mobile_390_es.png', Buffer.from(scrES.data, 'base64'));
    console.log('Saved scratch/contact_verified_mobile_390_es.png');

    console.log('\nAll tests completed successfully!');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

