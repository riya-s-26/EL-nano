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

async function verifyHeroLead() {
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

    async function getLeadInfo(width = 1440) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768
      });
      await new Promise(r => setTimeout(r, 200));

      const res = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const lead = document.querySelector('.hero p.lead');
            const rect = lead ? lead.getBoundingClientRect() : null;
            const docW = document.documentElement.scrollWidth;
            const winW = window.innerWidth;
            return {
              text: lead ? lead.textContent.trim() : null,
              width: rect ? Math.round(rect.width) : null,
              height: rect ? Math.round(rect.height) : null,
              hasOverflow: docW > winW
            };
          })()
        `
      });
      return res.result.value;
    }

    async function setLang(lang) {
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

    console.log('--- Test 1: Initial (English) ---');
    const enInitial = await getLeadInfo();
    console.log('EN Text:', enInitial.text);
    console.log('Matches expected EN:', enInitial.text.includes('Discover authentic Ecuadorian coastal cooking'));

    console.log('\n--- Test 2: Switch to Spanish ---');
    await setLang('es');
    const esLead = await getLeadInfo();
    console.log('ES Text:', esLead.text);
    console.log('Contains "encebollados auténticos":', esLead.text.includes('encebollados auténticos'));
    console.log('Does NOT contain "encebollados auténtico.":', !esLead.text.includes('encebollados auténtico.'));

    console.log('\n--- Test 3: Toggle EN -> ES Persistence ---');
    await setLang('en');
    const enToggled = await getLeadInfo();
    console.log('Toggled to EN:', enToggled.text.includes('Discover authentic'));

    await setLang('es');
    const esPersisted = await getLeadInfo();
    console.log('Toggled back to ES:', esPersisted.text.includes('encebollados auténticos'));

    console.log('\n--- Test 4: Mobile & Desktop Layout & Overflow (Spanish) ---');
    for (const w of [1440, 1200, 768, 375]) {
      const info = await getLeadInfo(w);
      console.log(`Viewport ${w}px: width=${info.width}px, height=${info.height}px, overflow=${info.hasOverflow}`);
    }

    cdp.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chrome.kill();
  }
}

verifyHeroLead();

