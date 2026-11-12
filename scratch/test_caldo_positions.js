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

async function testPositions() {
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

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const positionsToTest = [
      'center 50%',
      'center 55%',
      'center 60%',
      'center 65%',
      'center 70%',
      'center 75%',
      'center 80%'
    ];

    for (const pos of positionsToTest) {
      await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            const img = dish ? dish.querySelector('.dish-shot img') : null;
            if (img) {
              img.style.objectPosition = '${pos}';
            }
            const btn = document.querySelector('.story-nav button[data-go="3"]');
            if (btn) btn.click();
          })()
        `
      });

      await new Promise(r => setTimeout(r, 400));

      const rectRes = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            const shot = dish ? dish.querySelector('.dish-shot') : null;
            if (!shot) return null;
            const r = shot.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          })()
        `
      });

      const shotRect = rectRes.result.value;
      if (shotRect && shotRect.width > 0 && shotRect.height > 0) {
        const screenshot = await cdp.send('Page.captureScreenshot', {
          format: 'jpeg',
          quality: 85,
          clip: {
            x: Math.max(0, shotRect.x),
            y: Math.max(0, shotRect.y),
            width: shotRect.width,
            height: shotRect.height,
            scale: 1
          }
        });
        const safeName = pos.replace(/[% ]/g, '_');
        fs.writeFileSync(path.resolve(__dirname, `caldo_shot_${safeName}.jpg`), Buffer.from(screenshot.data, 'base64'));
        console.log(`Saved scratch/caldo_shot_${safeName}.jpg`);
      }
    }

    cdp.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

testPositions();

