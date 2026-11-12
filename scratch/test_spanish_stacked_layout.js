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

async function runTest() {
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

    async function evaluateCards(lang, width, height, dsf = 1) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: dsf,
        mobile: width < 768
      });

      await cdp.send('Runtime.evaluate', {
        expression: `
          if (typeof setLanguage === 'function') {
            setLanguage('${lang}');
          } else {
            const btn = document.querySelector('[data-lang="${lang}"]') || document.getElementById('lang-${lang}');
            if (btn) btn.click();
          }
        `
      });

      await new Promise(r => setTimeout(r, 400));

      const res = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const cards = Array.from(document.querySelectorAll('.menu-card'));
            return cards.map((c, idx) => {
              const title = c.querySelector('.menu-card-title');
              const price = c.querySelector('.menu-card-price');
              const desc = c.querySelector('.menu-card-desc');
              const tRect = title ? title.getBoundingClientRect() : null;
              const pRect = price ? price.getBoundingClientRect() : null;
              const dRect = desc ? desc.getBoundingClientRect() : null;

              const isBeside = (tRect && pRect) ? Math.abs(tRect.top - pRect.top) < 10 : false;
              const isBelow = (tRect && pRect) ? pRect.top >= tRect.bottom - 2 : false;
              const isLeftAligned = (tRect && pRect) ? Math.abs(tRect.left - pRect.left) < 4 : false;
              const isDescBelow = (pRect && dRect) ? dRect.top >= pRect.bottom - 2 : false;

              return {
                index: idx + 1,
                cat: c.getAttribute('data-cat'),
                titleText: title ? title.textContent.trim() : '',
                priceText: price ? price.textContent.trim().replace(/\\s+/g, ' ') : '',
                isBeside,
                isBelow,
                isLeftAligned,
                isDescBelow,
                tRect: tRect ? { top: Math.round(tRect.top), bottom: Math.round(tRect.bottom), left: Math.round(tRect.left), width: Math.round(tRect.width), height: Math.round(tRect.height) } : null,
                pRect: pRect ? { top: Math.round(pRect.top), bottom: Math.round(pRect.bottom), left: Math.round(pRect.left), width: Math.round(pRect.width), height: Math.round(pRect.height) } : null
              };
            });
          })()
        `
      });

      return res.result.value;
    }

    console.log('================ TESTING SPANISH CARDS (1440x900) ================');
    const esCards = await evaluateCards('es', 1440, 900);
    let allBelow = true;
    let allLeft = true;
    let anyBeside = false;

    for (const c of esCards) {
      if (c.isBeside) anyBeside = true;
      if (!c.isBelow) allBelow = false;
      if (!c.isLeftAligned) allLeft = false;

      console.log(`Card ${String(c.index).padStart(2, ' ')} [${c.cat}]: "${c.titleText}" | Price: "${c.priceText}" | Placed Below: ${c.isBelow} | Left Aligned: ${c.isLeftAligned} | Beside: ${c.isBeside}`);
    }

    console.log(`\nES SUMMARY: Any Beside: ${anyBeside} (Expected: false), All Below: ${allBelow} (Expected: true), All Left Aligned: ${allLeft} (Expected: true)`);

    console.log('\n================ TESTING ENGLISH CARDS (1440x900) ================');
    const enCards = await evaluateCards('en', 1440, 900);
    // In English, short food cards like Guatita, Fritada, Seco de Pollo should be beside
    const enShortSample = enCards.filter(c => ['Guatita', 'Fritada', 'Seco de Pollo', 'Cazuela'].includes(c.titleText));
    for (const c of enShortSample) {
      console.log(`EN Card ${c.index} "${c.titleText}": Beside: ${c.isBeside} (Expected: true for short titles) | Price: "${c.priceText}"`);
    }

    console.log('\n================ TESTING ACROSS MULTIPLE VIEWPORTS (SPANISH) ================');
    const viewports = [
      { name: 'Desktop 1600', w: 1600, h: 900 },
      { name: 'Desktop 1440', w: 1440, h: 900 },
      { name: 'Laptop 1200', w: 1200, h: 800 },
      { name: 'Zoom 125% (1152)', w: 1152, h: 720 },
      { name: 'Zoom 150% (960)', w: 960, h: 600 },
      { name: 'Tablet 768', w: 768, h: 1024 },
      { name: 'Mobile 375', w: 375, h: 812 }
    ];

    for (const vp of viewports) {
      const cards = await evaluateCards('es', vp.w, vp.h);
      const failures = cards.filter(c => !c.isBelow || c.isBeside || !c.isLeftAligned);
      console.log(`${vp.name.padEnd(20, ' ')}: Total cards=${cards.length}, Failures=${failures.length} ${failures.length === 0 ? '✓ PASS' : '✗ FAIL'}`);
      if (failures.length > 0) {
        for (const f of failures) {
          console.log(`   Failed: Card ${f.index} "${f.titleText}" - isBelow:${f.isBelow}, isBeside:${f.isBeside}, isLeftAligned:${f.isLeftAligned}`);
        }
      }
    }

    cdp.close();
  } catch (e) {
    console.error('Test error:', e);
  } finally {
    chrome.kill();
  }
}

runTest();

