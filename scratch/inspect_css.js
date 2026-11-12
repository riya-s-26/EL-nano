const { spawn } = require('child_process');
const path = require('path');

async function inspectCSS() {
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
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => { ws.onopen = r; });

    let id = 1;
    const cbs = new Map();
    ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && cbs.has(m.id)) cbs.get(m.id)(m.result); };
    const send = (method, params = {}) => new Promise(r => { const mid = id++; cbs.set(mid, r); ws.send(JSON.stringify({ id: mid, method, params })); });

    await send('Page.enable');
    await send('Page.navigate', { url: 'file:///' + path.resolve('index.html').replace(/\\/g, '/') });
    await new Promise(r => setTimeout(r, 1200));

    const res = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const dish = document.querySelector('.dish[data-name="Caldo de Bola"]');
          const img = dish ? dish.querySelector('img') : null;
          const cs = window.getComputedStyle(img);
          return {
            inlineStyle: img.getAttribute('style'),
            computedObjectPosition: cs.objectPosition,
            computedObjectFit: cs.objectFit,
            imgSrc: img.src
          };
        })()
      `
    });
    console.log(res);

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
  }
}

inspectCSS();
