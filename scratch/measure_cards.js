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

async function runAudit() {
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

    async function auditLayout(lang, width, height, dsf = 1) {
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
            const grid = document.getElementById('menu-grid');
            const gridStyle = window.getComputedStyle(grid);
            const cols = gridStyle.gridTemplateColumns.split(' ').length;
            const cards = Array.from(document.querySelectorAll('.menu-card:not(.hidden)'));
            
            return {
              gridWidth: Math.round(grid.getBoundingClientRect().width),
              gridColumns: cols,
              cardCount: cards.length,
              cards: cards.map((c, i) => {
                const title = c.querySelector('.menu-card-title');
                const price = c.querySelector('.menu-card-price');
                const desc = c.querySelector('.menu-card-desc');
                const cardRect = c.getBoundingClientRect();
                const titleRect = title ? title.getBoundingClientRect() : {};
                const priceRect = price ? price.getBoundingClientRect() : {};
                const descRect = desc ? desc.getBoundingClientRect() : {};

                const titleLH = title ? parseFloat(window.getComputedStyle(title).lineHeight) || 24 : 24;
                const priceLH = price ? parseFloat(window.getComputedStyle(price).lineHeight) || 18 : 18;

                const titleLines = title ? Math.round(titleRect.height / titleLH) : 0;
                const priceLines = price ? Math.round(priceRect.height / priceLH) : 0;

                return {
                  index: i + 1,
                  cat: c.getAttribute('data-cat'),
                  cardWidth: Math.round(cardRect.width),
                  title: title ? title.textContent.trim() : '',
                  titleWidth: Math.round(titleRect.width),
                  titleHeight: Math.round(titleRect.height),
                  titleLines,
                  price: price ? price.textContent.trim().replace(/\\s+/g, ' ') : '',
                  priceWidth: Math.round(priceRect.width),
                  priceHeight: Math.round(priceRect.height),
                  priceLines,
                  descWidth: Math.round(descRect.width),
                  descHeight: Math.round(descRect.height)
                };
              })
            };
          })()
        `
      });

      return res.result.value;
    }

    const testViewports = [
      { name: 'Desktop Large (1600x900)', w: 1600, h: 900, dsf: 1 },
      { name: 'Desktop Standard (1440x900)', w: 1440, h: 900, dsf: 1 },
      { name: 'Laptop (1200x800)', w: 1200, h: 800, dsf: 1 },
      { name: 'Zoom 125% on 1440 (1152x720)', w: 1152, h: 720, dsf: 1 },
      { name: 'Zoom 150% on 1440 (960x600)', w: 960, h: 600, dsf: 1 },
      { name: 'Tablet (768x1024)', w: 768, h: 1024, dsf: 1 },
      { name: 'Mobile (375x812)', w: 375, h: 812, dsf: 1 },
    ];

    for (const vp of testViewports) {
      console.log(`\n================ Testing ${vp.name} ================`);
      for (const lang of ['es', 'en']) {
        const data = await auditLayout(lang, vp.w, vp.h, vp.dsf);
        console.log(`[${lang.toUpperCase()}] GridW=${data.gridWidth}px, Cols=${data.gridColumns}, CardW=${data.cards[0]?.cardWidth}px`);
        const maxPriceLines = Math.max(...data.cards.map(c => c.priceLines));
        const maxTitleLines = Math.max(...data.cards.map(c => c.titleLines));
        const worstCard = data.cards.find(c => c.priceLines === maxPriceLines);
        console.log(`   Max Title Lines: ${maxTitleLines}, Max Price Lines: ${maxPriceLines} (Sample: Card ${worstCard?.index} "${worstCard?.title}" - "${worstCard?.price}" priceW=${worstCard?.priceWidth}px lines=${worstCard?.priceLines})`);
        // Check "Pulpo a la brasa con patatas" (Card 13)
        const pulpo = data.cards.find(c => c.title.includes('Pulpo') || c.title.includes('Octopus'));
        if (pulpo) {
          console.log(`   Pulpo (Card ${pulpo.index}): TitleW=${pulpo.titleWidth}px (${pulpo.titleLines} lines) | PriceW=${pulpo.priceWidth}px (${pulpo.priceLines} lines)`);
        }
      }
    }

    cdp.close();
  } catch (err) {
    console.error('Error during audit:', err);
  } finally {
    chrome.kill();
  }
}

runAudit();

