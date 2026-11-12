const { spawn } = require('child_process');
const fs = require('fs');

async function verifyAll() {
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
      // Navigate fresh each time so layout and viewport match perfectly
      await send('Emulation.setDeviceMetricsOverride', {
        width: t.w,
        height: t.h,
        deviceScaleFactor: t.dsf,
        mobile: t.mobile
      });

      await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html' });
      await new Promise(r => setTimeout(r, 1200));

      // Switch to ES
      await send('Runtime.evaluate', {
        expression: `if (window.setWebsiteLanguage) window.setWebsiteLanguage('es');`
      });

      // Scroll to slide 4 (Caldo de Bola)
      const res = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
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
              // Center of slide 4
              const targetY = top + ((3 + 0.5) / dishes.length) * span;
              window.scrollTo(0, targetY);
              window.dispatchEvent(new Event('scroll'));
            }

            // Return bounding rect of the Caldo de Bola image and container
            const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
            const shot = dish ? dish.querySelector('.dish-shot') : null;
            const img = shot ? shot.querySelector('img') : null;
            const text = dish ? dish.querySelector('.dish-text') : null;

            return {
              dishVisible: dish ? getComputedStyle(dish).opacity : null,
              shotRect: shot ? shot.getBoundingClientRect() : null,
              imgSrc: img ? img.getAttribute('src') : null,
              computedObjPos: img ? getComputedStyle(img).objectPosition : null,
              computedShotHeight: shot ? getComputedStyle(shot).height : null,
              textRect: text ? text.getBoundingClientRect() : null
            };
          })()
        `
      });

      console.log(`[${t.name}] Evaluated:`, res.value);

      // Wait a moment for any transitions
      await new Promise(r => setTimeout(r, 600));

      const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      const outPath = `scratch/final_view_${t.name}.jpg`;
      fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
      console.log(`Saved screenshot to ${outPath}`);
    }

    // Also verify slides 1-3 to ensure ZERO regressions
    console.log('\n--- Verifying Slides 1, 2, 3 (Regression check) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    for (let s = 0; s < 3; s++) {
      const slideInfo = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const story = document.querySelector('.story');
            const vh = window.innerHeight;
            const dishes = document.querySelectorAll('.dish');
            const top = story.getBoundingClientRect().top + window.scrollY;
            const span = story.offsetHeight - vh;
            const targetY = top + ((${s} + 0.5) / dishes.length) * span;
            window.scrollTo(0, targetY);
            window.dispatchEvent(new Event('scroll'));

            const d = dishes[${s}];
            const shot = d.querySelector('.dish-shot');
            const img = shot.querySelector('img');
            return {
              dishIndex: ${s},
              name: d.getAttribute('data-name'),
              seen: d.classList.contains('seen'),
              on: d.classList.contains('on'),
              shotHeight: getComputedStyle(shot).height,
              imgObjPos: getComputedStyle(img).objectPosition
            };
          })()
        `
      });
      console.log(`Slide ${s+1} info:`, slideInfo.value);

      await new Promise(r => setTimeout(r, 600));
      const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      fs.writeFileSync(`scratch/regression_slide_${s+1}.jpg`, Buffer.from(ss.data, 'base64'));
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyAll();

