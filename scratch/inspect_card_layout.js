const { spawn } = require('child_process');
const path = require('path');

async function checkCardDOM() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => { ws.onopen = r; });

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const htmlPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');
    await send('Page.enable');
    await send('Page.navigate', { url: 'file:///' + htmlPath });
    await new Promise(r => setTimeout(r, 1500));

    for (const width of [1440, 1200, 768, 375]) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768
      });
      await new Promise(r => setTimeout(r, 300));

      const res = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const card = document.querySelector('.dish-card--ceviche');
            const media = card.querySelector('.dish-media');
            const img = card.querySelector('img');
            const cardRect = card.getBoundingClientRect();
            const mediaRect = media.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();
            const cs = window.getComputedStyle(img);
            return {
              width,
              cardWidth: Math.round(cardRect.width),
              cardHeight: Math.round(cardRect.height),
              mediaWidth: Math.round(mediaRect.width),
              mediaHeight: Math.round(mediaRect.height),
              aspectRatio: (mediaRect.width / mediaRect.height).toFixed(2),
              imgSrc: img.currentSrc.split('/').pop(),
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              objectFit: cs.objectFit,
              objectPosition: cs.objectPosition,
              borderRadius: window.getComputedStyle(card).borderRadius,
              overflow: window.getComputedStyle(card).overflow
            };
          })()
        `
      });

      console.log(`\nViewport Width: ${width}px:`);
      console.log(JSON.stringify(res.result.value, null, 2));
    }

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

checkCardDOM();

