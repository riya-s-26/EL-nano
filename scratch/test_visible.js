const { spawn } = require('child_process');
const fs = require('fs');

async function testVisible() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const curId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            if (msg.error) rej(msg.error);
            else res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html' });
    await new Promise(r => setTimeout(r, 2000));

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 536,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Make dish 3 forcefully visible
    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          if (window.setWebsiteLanguage) window.setWebsiteLanguage('es');
          
          // Disable scroll listener
          window.onscroll = null;
          
          // Add style rule to force slide 4 visible
          const st = document.createElement('style');
          st.textContent = \`
            .story { height: auto !important; }
            .pinned .pin { position: relative !important; height: auto !important; }
            .dish[data-name="Caldo de Bola"] {
              display: grid !important;
              opacity: 1 !important;
              pointer-events: auto !important;
            }
            .dish[data-name="Caldo de Bola"] .dish-shot {
              clip-path: inset(0) !important;
              opacity: 1 !important;
            }
            .dish[data-name="Caldo de Bola"] .dish-text > * {
              opacity: 1 !important;
              transform: none !important;
            }
          \`;
          document.head.appendChild(st);

          const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
          dish.scrollIntoView({ behavior: 'instant', block: 'center' });
          const r = dish.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        })()
      `
    });

    await new Promise(r => setTimeout(r, 300));

    const r = evalRes.result.value;
    console.log('Dish rect:', r);

    const ss = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
      clip: { x: r.x, y: Math.max(0, r.y), width: r.w, height: r.h, scale: 1 }
    });
    fs.writeFileSync('scratch/caldo_force_visible.jpg', Buffer.from(ss.data, 'base64'));
    console.log('Saved scratch/caldo_force_visible.jpg');

    ws.close();
  } finally {
    chrome.kill();
  }
}

testVisible();

