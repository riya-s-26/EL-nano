const { spawn } = require('child_process');
const path = require('path');

async function listDishes() {
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
          return Array.from(document.querySelectorAll('.dish')).map(d => ({
            dataName: d.getAttribute('data-name'),
            id: d.id,
            className: d.className,
            imgSrc: d.querySelector('img') ? d.querySelector('img').getAttribute('src') : null
          }));
        })()
      `
    });
    console.log(JSON.stringify(res.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
  }
}

listDishes();
