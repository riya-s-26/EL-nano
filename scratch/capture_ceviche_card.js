const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function captureCards() {
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
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    const cdp = new SimpleCDP(pageTab.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    const htmlPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');
    const fileUrl = 'file:///' + htmlPath;

    await cdp.send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 1500));

    const viewports = [
      { name: 'desktop', w: 1440, h: 900 },
      { name: 'laptop', w: 1200, h: 800 },
      { name: 'tablet', w: 768, h: 1024 },
      { name: 'mobile', w: 375, h: 812 }
    ];

    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768
      });

      await new Promise(r => setTimeout(r, 400));

      // Get clip rect of .dish-card--ceviche
      const evalRes = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const card = document.querySelector('.dish-card--ceviche');
            if (!card) return null;
            card.scrollIntoView({ block: 'center' });
            const rect = card.getBoundingClientRect();
            const img = card.querySelector('img');
            return {
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
              naturalWidth: img ? img.naturalWidth : 0,
              naturalHeight: img ? img.naturalHeight : 0,
              currentSrc: img ? img.currentSrc : '',
              complete: img ? img.complete : false
            };
          })()
        `
      });

      const cardInfo = evalRes.result.value;
      console.log(`Viewport ${vp.name} (${vp.w}x${vp.h}): Card width=${Math.round(cardInfo.rect.width)}px, height=${Math.round(cardInfo.rect.height)}px`);
      console.log(`   Image natural: ${cardInfo.naturalWidth}x${cardInfo.naturalHeight}, complete: ${cardInfo.complete}, src: ${cardInfo.currentSrc}`);

      await new Promise(r => setTimeout(r, 400));

      const screenshot = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, cardInfo.rect.x),
          y: Math.max(0, cardInfo.rect.y),
          width: cardInfo.rect.width,
          height: cardInfo.rect.height,
          scale: 1
        }
      });

      const buf = Buffer.from(screenshot.data, 'base64');
      const outPath = path.resolve(__dirname, `ceviche_card_${vp.name}.png`);
      fs.writeFileSync(outPath, buf);
      console.log(`   Saved screenshot: ${outPath} (${buf.length} bytes)`);
    }

    cdp.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chrome.kill();
  }
}

captureCards();

