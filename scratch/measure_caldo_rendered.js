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

async function measureCaldo() {
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

    // Override viewport to 1440x900 (standard desktop)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Navigate carousel to slide 3 (Caldo de Bola)
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('.story-nav button[data-go="3"]');
          if (btn) btn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 600));

    const evalRes = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
          const shot = dish ? dish.querySelector('.dish-shot') : null;
          const img = shot ? shot.querySelector('img') : null;
          const shotRect = shot ? shot.getBoundingClientRect() : null;
          const cs = img ? window.getComputedStyle(img) : null;
          return {
            shotWidth: shotRect ? Math.round(shotRect.width) : 0,
            shotHeight: shotRect ? Math.round(shotRect.height) : 0,
            aspectRatio: shotRect ? (shotRect.width / shotRect.height).toFixed(3) : 0,
            objectFit: cs ? cs.objectFit : '',
            objectPosition: cs ? cs.objectPosition : '',
            imgNaturalW: img ? img.naturalWidth : 0,
            imgNaturalH: img ? img.naturalHeight : 0,
            clipPath: shot ? window.getComputedStyle(shot).clipPath : ''
          };
        })()
      `
    });

    console.log('Caldo de Bola Rendered Info:', JSON.stringify(evalRes.result.value, null, 2));

    // Capture screenshot of the whole carousel view
    const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'carousel_view.png'), Buffer.from(screenshot.data, 'base64'));
    console.log('Saved scratch/carousel_view.png');

    cdp.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

measureCaldo();

