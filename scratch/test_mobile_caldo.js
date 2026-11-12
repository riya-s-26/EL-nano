const { spawn } = require('child_process');
const fs = require('fs');

async function testMobileCaldo() {
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

    // Test mobile (375x667)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });

    const mobileOptions = [
      {
        name: 'mobile_default_4_3_pos35',
        css: `
          .dish[data-name="Caldo de Bola"] .dish-shot img {
            object-position: center 35% !important;
          }
        `
      },
      {
        name: 'mobile_square_pos35',
        css: `
          .dish[data-name="Caldo de Bola"] .dish-shot {
            aspect-ratio: 1 / 1 !important;
          }
          .dish[data-name="Caldo de Bola"] .dish-shot img {
            object-position: center 35% !important;
          }
        `
      },
      {
        name: 'mobile_5_4_pos35',
        css: `
          .dish[data-name="Caldo de Bola"] .dish-shot {
            aspect-ratio: 5 / 4 !important;
          }
          .dish[data-name="Caldo de Bola"] .dish-shot img {
            object-position: center 35% !important;
          }
        `
      }
    ];

    for (const opt of mobileOptions) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            let st = document.getElementById('test-mobile-style');
            if (!st) {
              st = document.createElement('style');
              st.id = 'test-mobile-style';
              document.head.appendChild(st);
            }
            st.textContent = \`${opt.css}\`;
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            dish.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()
        `
      });

      await new Promise(r => setTimeout(r, 300));

      const rectRes = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            const r = dish.getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
          })()
        `
      });

      const r = rectRes.result.value;
      const ss = await send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 85,
        clip: { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.w, height: r.h, scale: 1 }
      });
      const outPath = `scratch/test_${opt.name}.jpg`;
      fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
      console.log(`Saved ${outPath}`);
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

testMobileCaldo();

