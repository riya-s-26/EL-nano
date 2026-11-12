const { spawn } = require('child_process');
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

async function verifyCeviche() {
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

    for (const width of [1600, 1440, 1200, 768, 375]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768
      });

      await new Promise(r => setTimeout(r, 400));

      const res = await cdp.send('Runtime.evaluate', {
        awaitPromise: true,
        returnByValue: true,
        expression: `
          (async () => {
            const card = document.querySelector('.dish-card--ceviche');
            if (card) card.scrollIntoView();
            const media = card ? card.querySelector('.dish-media') : null;
            const img = card ? card.querySelector('img') : null;
            if (img && !img.complete) {
              try { await img.decode(); } catch(e){}
            }
            const cs = img ? window.getComputedStyle(img) : null;
            const cardCs = card ? window.getComputedStyle(card) : null;
            const mediaRect = media ? media.getBoundingClientRect() : null;
            return {
              viewport: ${width},
              cardFound: !!card,
              src: img ? img.src : null,
              naturalWidth: img ? img.naturalWidth : 0,
              naturalHeight: img ? img.naturalHeight : 0,
              complete: img ? img.complete : false,
              mediaWidth: mediaRect ? Math.round(mediaRect.width) : 0,
              mediaHeight: mediaRect ? Math.round(mediaRect.height) : 0,
              aspectRatio: mediaRect ? (mediaRect.width / mediaRect.height).toFixed(2) : 0,
              objectFit: cs ? cs.objectFit : null,
              objectPosition: cs ? cs.objectPosition : null,
              borderRadius: cardCs ? cardCs.borderRadius : null,
              overflow: cardCs ? cardCs.overflow : null
            };
          })()
        `
      });

      console.log(`Viewport ${width}px:`, JSON.stringify(res.result.value, null, 2));
    }

    // Now test language switching: confirm Ceviche Mixto image remains the same
    console.log('\nTesting Language Switch (ES and EN):');
    for (const lang of ['es', 'en']) {
      await cdp.send('Runtime.evaluate', {
        expression: `
          if (window.setWebsiteLanguage) {
            window.setWebsiteLanguage('${lang}');
          } else {
            const btn = document.querySelector('[data-lang="${lang}"]');
            if (btn) btn.click();
          }
        `
      });
      await new Promise(r => setTimeout(r, 300));
      const langRes = await cdp.send('Runtime.evaluate', {
        awaitPromise: true,
        returnByValue: true,
        expression: `
          (async () => {
            const card = document.querySelector('.dish-card--ceviche');
            const img = card ? card.querySelector('img') : null;
            if (img && !img.complete) {
              try { await img.decode(); } catch(e){}
            }
            const title = card ? card.querySelector('h3') : null;
            return {
              lang: document.documentElement.lang,
              title: title ? title.textContent.trim() : '',
              imgSrc: img ? img.src.split('/').pop() : '',
              naturalWidth: img ? img.naturalWidth : 0,
              naturalHeight: img ? img.naturalHeight : 0,
              complete: img ? img.complete : false
            };
          })()
        `
      });
      console.log(`Lang [${lang}]:`, JSON.stringify(langRes.result.value, null, 2));
    }

    cdp.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chrome.kill();
  }
}

verifyCeviche();
