const { spawn } = require('child_process');
const fs = require('fs');
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

async function testCaldoOptions() {
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
    const cdp = new SimpleCDP(pageTab.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    const fileUrl = 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html';
    await cdp.send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 2000));

    // Options to evaluate
    const candidateStyles = [
      { name: 'pos_35_default', pos: 'center 35%', customCss: '' },
      { name: 'pos_40_default', pos: 'center 40%', customCss: '' },
      { name: 'pos_45_default', pos: 'center 45%', customCss: '' },
      { name: 'pos_48_default', pos: 'center 48%', customCss: '' },
      { name: 'pos_50_default', pos: 'center 50%', customCss: '' },
      {
        name: 'taller_pos_45',
        pos: 'center 45%',
        customCss: `
          .pinned .dish[data-name="Caldo de Bola"] .dish-shot {
            height: min(72svh, 680px) !important;
          }
        `
      },
      {
        name: 'taller_pos_48',
        pos: 'center 48%',
        customCss: `
          .pinned .dish[data-name="Caldo de Bola"] .dish-shot {
            height: min(72svh, 680px) !important;
          }
        `
      },
      {
        name: 'taller_pos_50',
        pos: 'center 50%',
        customCss: `
          .pinned .dish[data-name="Caldo de Bola"] .dish-shot {
            height: min(72svh, 680px) !important;
          }
        `
      }
    ];

    // Test at 1440x900 and 1024x536 (the exact size of the user's screenshot)
    const viewports = [
      { name: 'desktop_1440x900', w: 1440, h: 900 },
      { name: 'user_shot_1024x536', w: 1024, h: 536 }
    ];

    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: false
      });

      for (const opt of candidateStyles) {
        await cdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              if (window.setWebsiteLanguage) window.setWebsiteLanguage('es');
              const dishes = document.querySelectorAll('.dish');
              dishes.forEach((d, i) => {
                d.classList.toggle('seen', i <= 3);
                d.classList.toggle('on', i === 3);
              });

              // remove existing style tag if any
              let st = document.getElementById('test-caldo-style');
              if (!st) {
                st = document.createElement('style');
                st.id = 'test-caldo-style';
                document.head.appendChild(st);
              }
              st.textContent = \`
                .dish[data-name="Caldo de Bola"] .dish-shot img {
                  object-position: \${'${opt.pos}'} !important;
                }
                \${'${opt.customCss.replace(/\n/g, ' ')}'}
              \`;

              const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
              const shot = dish ? dish.querySelector('.dish-shot') : null;
              if (shot) {
                shot.scrollIntoView({ behavior: 'instant', block: 'center' });
              }
            })()
          `
        });

        await new Promise(r => setTimeout(r, 400));

        // Evaluate bounding rect of the dish slide
        const evalRes = await cdp.send('Runtime.evaluate', {
          returnByValue: true,
          expression: `
            (() => {
              const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
              const shot = dish ? dish.querySelector('.dish-shot') : null;
              const img = shot ? shot.querySelector('img') : null;
              if (!dish || !shot) return null;
              const rDish = dish.getBoundingClientRect();
              const rShot = shot.getBoundingClientRect();
              return {
                dish: { x: rDish.x, y: rDish.y, w: rDish.width, h: rDish.height },
                shot: { x: rShot.x, y: rShot.y, w: rShot.width, h: rShot.height }
              };
            })()
          `
        });

        const rects = evalRes.result.value;
        if (rects && rects.shot) {
          const ss = await cdp.send('Page.captureScreenshot', {
            format: 'jpeg',
            quality: 85,
            clip: {
              x: Math.round(rects.dish.x),
              y: Math.max(0, Math.round(rects.dish.y)),
              width: Math.round(rects.dish.w),
              height: Math.round(rects.dish.h),
              scale: 1
            }
          });
          const outName = `scratch/caldo_${vp.name}_${opt.name}.jpg`;
          fs.writeFileSync(outName, Buffer.from(ss.data, 'base64'));
          console.log(`Saved ${outName} (shot: ${Math.round(rects.shot.w)}x${Math.round(rects.shot.h)})`);
        }
      }
    }

    cdp.close();
  } catch(e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

testCaldoOptions();

