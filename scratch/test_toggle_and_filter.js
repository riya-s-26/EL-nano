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

async function runToggleAndFilterTest() {
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

    async function toggleLang(lang) {
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
    }

    async function checkState(expectedLang) {
      const res = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const htmlLang = document.documentElement.lang;
            const guatita = document.querySelector('.menu-card[data-cat="clasicos"]'); // Card 1 is encebollado, card 2 is guatita
            const cards = Array.from(document.querySelectorAll('.menu-card'));
            const gCard = cards.find(c => c.querySelector('.menu-card-title').textContent.includes('Guatita'));
            const tRect = gCard.querySelector('.menu-card-title').getBoundingClientRect();
            const pRect = gCard.querySelector('.menu-card-price').getBoundingClientRect();
            const isBeside = Math.abs(tRect.top - pRect.top) < 10;
            const isBelow = pRect.top >= tRect.bottom - 2;
            return {
              htmlLang,
              title: gCard.querySelector('.menu-card-title').textContent.trim(),
              price: gCard.querySelector('.menu-card-price').textContent.trim(),
              isBeside,
              isBelow
            };
          })()
        `
      });
      return res.result.value;
    }

    console.log('Testing Repeated Language Switching:');
    for (const step of ['es', 'en', 'es', 'en', 'es']) {
      await toggleLang(step);
      const state = await checkState(step);
      console.log(`Switched to [${step}]: html.lang="${state.htmlLang}", Guatita price="${state.price}", isBeside=${state.isBeside}, isBelow=${state.isBelow}`);
    }

    console.log('\nTesting Filter Category Switching in Spanish:');
    const filterRes = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const cats = ['all', 'clasicos', 'empezar', 'arroces', 'banderas', 'acompanantes', 'drinks'];
          return cats.map(cat => {
            const btn = document.querySelector('.menu-tab-btn[data-cat="' + cat + '"]');
            btn.click();
            const visible = Array.from(document.querySelectorAll('.menu-card')).filter(c => c.style.display !== 'none');
            const allStacked = visible.every(c => {
              const tRect = c.querySelector('.menu-card-title').getBoundingClientRect();
              const pRect = c.querySelector('.menu-card-price').getBoundingClientRect();
              return pRect.top >= tRect.bottom - 2;
            });
            return { cat, visibleCount: visible.length, allStacked };
          });
        })()
      `
    });

    for (const r of filterRes.result.value) {
      console.log(`Filter [${r.cat}]: visible=${r.visibleCount}, allStacked=${r.allStacked} ${r.allStacked ? '✓ PASS' : '✗ FAIL'}`);
    }

    cdp.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    chrome.kill();
  }
}

runToggleAndFilterTest();
