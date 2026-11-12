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

async function detailedAudit() {
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

    // Set standard desktop viewport 1440x900
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    for (const lang of ['es', 'en']) {
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

      await new Promise(r => setTimeout(r, 500));

      const res = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const docW = document.documentElement.scrollWidth;
            const winW = window.innerWidth;
            const hasHOverflow = docW > winW;
            const cards = Array.from(document.querySelectorAll('.menu-card'));
            
            return {
              hasHOverflow,
              docW,
              winW,
              cardDetails: cards.map((c, i) => {
                const title = c.querySelector('.menu-card-title');
                const price = c.querySelector('.menu-card-price');
                const desc = c.querySelector('.menu-card-desc');
                const meta = c.querySelector('.menu-card-meta');
                const cardRect = c.getBoundingClientRect();
                const titleRect = title ? title.getBoundingClientRect() : {};
                const priceRect = price ? price.getBoundingClientRect() : {};
                const descRect = desc ? desc.getBoundingClientRect() : {};

                const titleLH = title ? parseFloat(window.getComputedStyle(title).lineHeight) || 24 : 24;
                const priceLH = price ? parseFloat(window.getComputedStyle(price).lineHeight) || 18 : 18;
                const descLH = desc ? parseFloat(window.getComputedStyle(desc).lineHeight) || 20 : 20;

                const titleLines = title ? Math.round(titleRect.height / titleLH) : 0;
                const priceLines = price ? Math.round(priceRect.height / priceLH) : 0;
                const descLines = desc ? Math.round(descRect.height / descLH) : 0;

                // check if description uses full content width of the card body
                const body = c.querySelector('.menu-card-body');
                const bodyWidth = body ? body.clientWidth - parseFloat(window.getComputedStyle(body).paddingLeft) - parseFloat(window.getComputedStyle(body).paddingRight) : 0;
                const descWidthRatio = bodyWidth > 0 ? (descRect.width / bodyWidth) : 0;

                return {
                  i: i + 1,
                  cat: c.getAttribute('data-cat'),
                  title: title ? title.textContent.trim() : '',
                  titleLines,
                  titleWidth: Math.round(titleRect.width),
                  price: price ? price.textContent.trim().replace(/\\s+/g, ' ') : '',
                  priceLines,
                  priceWidth: Math.round(priceRect.width),
                  descLines,
                  descWidth: Math.round(descRect.width),
                  descWidthRatio: Math.round(descWidthRatio * 100) + '%'
                };
              })
            };
          })()
        `
      });

      const audit = res.result.value;
      console.log(`\n================== DETAILED AUDIT: ${lang.toUpperCase()} (1440x900) ==================`);
      console.log(`Horizontal page overflow: ${audit.hasHOverflow ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);
      for (const c of audit.cardDetails) {
        console.log(`Card ${String(c.i).padStart(2, ' ')} [${c.cat}]: Title="${c.title}" (${c.titleLines} lines, ${c.titleWidth}px) | Price="${c.price}" (${c.priceLines} lines, ${c.priceWidth}px) | Desc: ${c.descLines} lines, widthRatio=${c.descWidthRatio}`);
      }
    }

    // Test Filter functionality in ES
    console.log('\n================== TESTING MENU FILTERS IN ES ==================');
    const filterRes = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const cats = ['all', 'clasicos', 'empezar', 'arroces', 'banderas', 'acompanantes', 'drinks'];
          const results = [];
          for (const cat of cats) {
            const btn = document.querySelector(\`.menu-tab-btn[data-cat="\${cat}"]\`);
            if (btn) {
              btn.click();
              const visibleCards = Array.from(document.querySelectorAll('.menu-card')).filter(c => c.style.display !== 'none');
              results.push({
                cat,
                btnText: btn.textContent.trim(),
                visibleCount: visibleCards.length,
                allMatchCat: cat === 'all' ? true : visibleCards.every(c => c.getAttribute('data-cat') === cat)
              });
            }
          }
          // restore 'all'
          document.querySelector('.menu-tab-btn[data-cat="all"]').click();
          return results;
        })()
      `
    });

    console.log('Filter Results:');
    for (const f of filterRes.result.value) {
      console.log(`Filter [${f.cat}] "${f.btnText}": Visible=${f.visibleCount}, AllMatch=${f.allMatchCat}`);
    }

    cdp.close();
  } catch (e) {
    console.error('Audit error:', e);
  } finally {
    chrome.kill();
  }
}

detailedAudit();
