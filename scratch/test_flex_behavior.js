const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testFlex() {
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .card { width: 250px; border: 1px solid #ccc; padding: 16px; box-sizing: border-box; font-family: sans-serif; margin-bottom: 20px; }
        .head-wrap { display: flex; align-items: baseline; justify-content: space-between; gap: 6px 12px; flex-wrap: wrap; }
        
        /* Candidate A: flex: 1 1 auto & flex: 0 1 auto */
        .title-a { font-size: 1.25rem; font-weight: bold; flex: 1 1 auto; min-width: 0; margin: 0; }
        .price-a { font-size: 0.85rem; font-weight: bold; flex: 0 1 auto; max-width: 100%; text-align: right; }

        /* Candidate B: title flex: 1 1 auto & price flex: 0 0 auto (shrink 0) */
        .title-b { font-size: 1.25rem; font-weight: bold; flex: 1 1 auto; min-width: 0; margin: 0; }
        .price-b { font-size: 0.85rem; font-weight: bold; flex: 0 0 auto; max-width: 100%; text-align: right; }

        /* Candidate C: title flex: 1 1 50% min-width: 0 & price flex: 1 1 auto */
        .title-c { font-size: 1.25rem; font-weight: bold; flex: 1 1 auto; min-width: 140px; margin: 0; }
        .price-c { font-size: 0.85rem; font-weight: bold; flex: 0 0 auto; max-width: 100%; text-align: right; }
      </style>
    </head>
    <body>
      <div class="card" id="card-a1">
        <div class="head-wrap">
          <h4 class="title-a">Pulpo a la brasa con patatas</h4>
          <span class="price-a">Consultar precio al mesero</span>
        </div>
      </div>
      <div class="card" id="card-a2">
        <div class="head-wrap">
          <h4 class="title-a">Encebollado</h4>
          <span class="price-a">House Specialty</span>
        </div>
      </div>
      <div class="card" id="card-b1">
        <div class="head-wrap">
          <h4 class="title-b">Pulpo a la brasa con patatas</h4>
          <span class="price-b">Consultar precio al mesero</span>
        </div>
      </div>
      <div class="card" id="card-b2">
        <div class="head-wrap">
          <h4 class="title-b">Encebollado</h4>
          <span class="price-b">House Specialty</span>
        </div>
      </div>
      <div class="card" id="card-b3">
        <div class="head-wrap">
          <h4 class="title-b">Encebollado</h4>
          <span class="price-b">Consultar precio al mesero</span>
        </div>
      </div>
    </body>
    </html>
  `;

  const tmpPath = path.resolve(__dirname, 'test_tmp.html');
  fs.writeFileSync(tmpPath, testHtml, 'utf8');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    'file:///' + tmpPath.replace(/\\/g, '/')
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => { ws.onopen = r; });

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const cards = ['card-a1', 'card-a2', 'card-b1', 'card-b2', 'card-b3'];
          return cards.map(id => {
            const card = document.getElementById(id);
            const title = card.querySelector('h4');
            const price = card.querySelector('span');
            const tRect = title.getBoundingClientRect();
            const pRect = price.getBoundingClientRect();
            const sameRow = Math.abs(tRect.top - pRect.top) < 10;
            return {
              id,
              sameRow,
              titleWidth: Math.round(tRect.width),
              titleHeight: Math.round(tRect.height),
              priceWidth: Math.round(pRect.width),
              priceHeight: Math.round(pRect.height),
              priceText: price.textContent
            };
          });
        })()
      `
    });

    console.log('EvalRes:', JSON.stringify(evalRes));
    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    chrome.kill();
  }
}

testFlex();
