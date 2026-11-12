const { spawn } = require('child_process');
const fs = require('fs');

async function testCaldoFocal() {
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

    // Test on 1024x536 (the exact aspect ratio from client screenshot) and 1440x900 (standard desktop)
    const viewports = [
      { name: 'laptop_1024x536', w: 1024, h: 536 },
      { name: 'desktop_1440x900', w: 1440, h: 900 }
    ];

    const options = [
      { name: 'pos_30', pos: 'center 30%', css: '' },
      { name: 'pos_35', pos: 'center 35%', css: '' },
      { name: 'pos_40', pos: 'center 40%', css: '' },
      { name: 'pos_45', pos: 'center 45%', css: '' },
      { name: 'pos_50', pos: 'center 50%', css: '' },
      {
        name: 'pos_35_ar1',
        pos: 'center 35%',
        css: '.pinned .dish[data-name="Caldo de Bola"] .dish-shot { aspect-ratio: 1/1 !important; height: min(68svh, 620px) !important; }'
      },
      {
        name: 'pos_40_ar1',
        pos: 'center 40%',
        css: '.pinned .dish[data-name="Caldo de Bola"] .dish-shot { aspect-ratio: 1/1 !important; height: min(68svh, 620px) !important; }'
      },
      {
        name: 'pos_35_taller',
        pos: 'center 35%',
        css: '.pinned .dish[data-name="Caldo de Bola"] .dish-shot { height: min(72svh, 650px) !important; }'
      },
      {
        name: 'pos_40_taller',
        pos: 'center 40%',
        css: '.pinned .dish[data-name="Caldo de Bola"] .dish-shot { height: min(72svh, 650px) !important; }'
      }
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: false
      });

      // Switch language to ES
      await send('Runtime.evaluate', {
        expression: `if (window.setWebsiteLanguage) window.setWebsiteLanguage('es');`
      });

      // Scroll to slide 3 in story
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const story = document.querySelector('.story');
            const vh = window.innerHeight;
            const dishes = document.querySelectorAll('.dish');
            const top = story.getBoundingClientRect().top + window.scrollY;
            const span = story.offsetHeight - vh;
            const targetY = top + ((3 + 0.5) / dishes.length) * span;
            window.scrollTo(0, targetY);
            window.dispatchEvent(new Event('scroll'));
          })()
        `
      });

      await new Promise(r => setTimeout(r, 600));

      for (const opt of options) {
        // Inject style
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              let st = document.getElementById('caldo-test-opt');
              if (!st) {
                st = document.createElement('style');
                st.id = 'caldo-test-opt';
                document.head.appendChild(st);
              }
              st.textContent = \`
                .dish[data-name="Caldo de Bola"] .dish-shot img {
                  object-position: \${'${opt.pos}'} !important;
                }
                \${'${opt.css}'}
              \`;
              // trigger scroll update
              window.dispatchEvent(new Event('scroll'));
            })()
          `
        });

        await new Promise(r => setTimeout(r, 300));

        const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
        const outPath = `scratch/preview_${vp.name}_${opt.name}.jpg`;
        fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
        console.log(`Saved ${outPath}`);
      }
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

testCaldoFocal();

