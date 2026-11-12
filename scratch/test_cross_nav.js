const { spawn } = require('child_process');

async function testCrossNav() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));

  try {
    const listRes = await fetch('http://127.0.0.1:9225/json');
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(m, p={}) {
      return new Promise((res, rej) => {
        const curId = id++;
        const h = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === curId) { ws.removeEventListener('message', h); if (msg.error) rej(msg.error); else res(msg.result); }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: curId, method: m, params: p }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    // Start on index.html with English
    await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html' });
    await new Promise(r => setTimeout(r, 1000));
    await send('Runtime.evaluate', { expression: `window.setWebsiteLanguage('en');` });

    // Click Contact Us
    await send('Runtime.evaluate', {
      expression: `
        const link = Array.from(document.querySelectorAll('.nav a')).find(a => a.getAttribute('href') === 'contact.html');
        link.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const contactState = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        ({
          url: window.location.href,
          title: document.title,
          h1: document.querySelector('.contact-hero h1')?.innerText,
          lang: document.documentElement.lang
        })
      `
    });
    console.log('Navigated to Contact Page:', contactState.result.value);

    // Switch to Spanish on contact.html
    await send('Runtime.evaluate', { expression: `window.setWebsiteLanguage('es');` });
    await new Promise(r => setTimeout(r, 400));

    // Click Brand logo to go back to Home
    await send('Runtime.evaluate', {
      expression: `
        const brand = document.querySelector('.brand');
        brand.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const homeState = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        ({
          url: window.location.href,
          title: document.title,
          h1: document.querySelector('.hero-copy h1')?.innerText,
          lang: document.documentElement.lang
        })
      `
    });
    console.log('Navigated back to Homepage:', homeState.result.value);

    // Switch back to English as default clean state
    await send('Runtime.evaluate', { expression: `window.setWebsiteLanguage('en');` });

    ws.close();
  } finally {
    chrome.kill();
  }
}

testCrossNav();

