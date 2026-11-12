const { spawn } = require('child_process');
const fs = require('fs');

async function testClickNav() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));

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

    const viewports = [
      { name: 'laptop_1200', w: 1200, h: 800 },
      { name: 'laptop_short_1024x536', w: 1024, h: 536 },
      { name: 'desktop_1440', w: 1440, h: 900 }
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: false
      });

      await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html' });
      await new Promise(r => setTimeout(r, 1200));

      // Click button 3 (Caldo de Bola)
      const res = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const btn = document.querySelector('.story-nav button[data-go="3"]');
            if (btn) {
              btn.click();
              return 'clicked';
            }
            return 'no-btn';
          })()
        `
      });

      // Wait for smooth scroll and animation
      await new Promise(r => setTimeout(r, 1200));

      // Ensure update() ran
      await send('Runtime.evaluate', {
        expression: `window.dispatchEvent(new Event('scroll'));`
      });
      await new Promise(r => setTimeout(r, 300));

      const check = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const dishes = document.querySelectorAll('.dish');
            const d = dishes[3];
            const shot = d.querySelector('.dish-shot');
            const img = shot.querySelector('img');
            const rect = shot.getBoundingClientRect();
            return {
              seen: d.classList.contains('seen'),
              on: d.classList.contains('on'),
              shotRect: rect,
              objPos: getComputedStyle(img).objectPosition,
              shotHeight: getComputedStyle(shot).height
            };
          })()
        `
      });
      console.log(`[${vp.name}] Button click test:`, check.value);

      const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      fs.writeFileSync(`scratch/click_test_${vp.name}.jpg`, Buffer.from(ss.data, 'base64'));
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

testClickNav();

