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

async function renderSlide() {
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

    // Make Caldo de Bola slide visible and activate it
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const dishes = document.querySelectorAll('.dish');
          dishes.forEach((d, i) => {
            const isCaldo = d.getAttribute('data-name') === 'Caldo de Bola';
            d.classList.toggle('seen', isCaldo || i < 3);
            d.classList.toggle('on', isCaldo);
            if (isCaldo) {
              const shot = d.querySelector('.dish-shot');
              if (shot) shot.style.clipPath = 'inset(0)';
            }
          });
          const navBtns = document.querySelectorAll('.story-nav button');
          navBtns.forEach((b, i) => {
            b.classList.toggle('on', i === 3);
          });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 400));

    for (const pos of ['center 50%', 'center 58%', 'center 60%', 'center 65%']) {
      await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            const img = dish ? dish.querySelector('.dish-shot img') : null;
            if (img) img.style.setProperty('object-position', '${pos}', 'important');
          })()
        `
      });

      await new Promise(r => setTimeout(r, 200));

      const rectRes = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            const shot = dish ? dish.querySelector('.dish-shot') : null;
            const r = shot ? shot.getBoundingClientRect() : null;
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          })()
        `
      });

      const shotRect = rectRes.result.value;
      const screenshot = await cdp.send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 90,
        clip: {
          x: Math.max(0, shotRect.x),
          y: Math.max(0, shotRect.y),
          width: shotRect.width,
          height: shotRect.height,
          scale: 1
        }
      });

      const safeName = pos.replace(/[% ]/g, '_');
      fs.writeFileSync(path.resolve(__dirname, `active_caldo_${safeName}.jpg`), Buffer.from(screenshot.data, 'base64'));
      console.log(`Saved scratch/active_caldo_${safeName}.jpg`);
    }

    cdp.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

renderSlide();
