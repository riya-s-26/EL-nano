const { spawn } = require('child_process');
const fs = require('fs');

async function testAllViewports() {
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

    // Test viewports:
    const tests = [
      { name: 'desktop_1440', w: 1440, h: 900, mobile: false, dsf: 1 },
      { name: 'laptop_1200', w: 1200, h: 800, mobile: false, dsf: 1 },
      { name: 'laptop_short_1024x536', w: 1024, h: 536, mobile: false, dsf: 1 },
      { name: 'tablet_768', w: 768, h: 1024, mobile: false, dsf: 1 },
      { name: 'mobile_375', w: 375, h: 667, mobile: true, dsf: 2 },
      { name: 'zoom_125', w: 1440, h: 900, mobile: false, dsf: 1.25 },
      { name: 'zoom_150', w: 1440, h: 900, mobile: false, dsf: 1.5 }
    ];

    for (const t of tests) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: t.w,
        height: t.h,
        deviceScaleFactor: t.dsf,
        mobile: t.mobile
      });

      // Switch to ES
      await send('Runtime.evaluate', {
        expression: `if (window.setWebsiteLanguage) window.setWebsiteLanguage('es');`
      });

      // Test with proposed styling:
      // object-position: center 35% !important;
      // AND .pinned .dish[data-name="Caldo de Bola"] .dish-shot { height: min(70svh, 650px); }
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            let st = document.getElementById('proposed-style');
            if (!st) {
              st = document.createElement('style');
              st.id = 'proposed-style';
              document.head.appendChild(st);
            }
            st.textContent = \`
              .dish[data-name="Caldo de Bola"] .dish-shot img {
                object-position: center 35% !important;
              }
              .pinned .dish[data-name="Caldo de Bola"] .dish-shot {
                height: min(70svh, 650px);
              }
            \`;

            // Scroll to Caldo de Bola
            const mq = window.matchMedia('(max-width: 800px)');
            if (mq.matches) {
              const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
              if (dish) dish.scrollIntoView({ behavior: 'instant', block: 'start' });
            } else {
              const story = document.querySelector('.story');
              const vh = window.innerHeight;
              const dishes = document.querySelectorAll('.dish');
              const top = story.getBoundingClientRect().top + window.scrollY;
              const span = story.offsetHeight - vh;
              const targetY = top + ((3 + 0.5) / dishes.length) * span;
              window.scrollTo(0, targetY);
              window.dispatchEvent(new Event('scroll'));
            }
          })()
        `
      });

      await new Promise(r => setTimeout(r, 600));

      const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      const outPath = `scratch/view_${t.name}.jpg`;
      fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
      console.log(`Captured ${outPath}`);
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

testAllViewports();

