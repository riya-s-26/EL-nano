const { spawn } = require('child_process');
const fs = require('fs');

async function verifyLaNanaBadge() {
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

    // 1. Desktop 1440
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll down to menu section
    const res = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const cards = document.querySelectorAll('.menu-card[data-cat="drinks"]');
          const details = [];
          cards.forEach(card => {
            const title = card.querySelector('.menu-card-title').innerText.trim();
            const tag = card.querySelector('.menu-card-tag');
            const img = card.querySelector('img');
            const tagStyle = getComputedStyle(tag);
            const tagRect = tag.getBoundingClientRect();
            const mediaRect = card.querySelector('.menu-card-media').getBoundingClientRect();
            details.push({
              title,
              tagRawHTML: tag.innerHTML,
              tagRenderedText: tag.innerText.trim(),
              tagComputedTransform: tagStyle.textTransform,
              tagBgColor: tagStyle.backgroundColor,
              tagColor: tagStyle.color,
              tagFontWeight: tagStyle.fontWeight,
              fitsInCard: tagRect.right <= mediaRect.right && tagRect.bottom <= mediaRect.bottom
            });
          });
          return details;
        })()
      `
    });

    console.log('--- Cocktails on Initial Load (English) ---');
    console.log(JSON.stringify(res.result ? res.result.value : res, null, 2));

    // Scroll to drinks section for screenshot
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const drinksCard = document.querySelector('.menu-card[data-cat="drinks"]');
          if (drinksCard) drinksCard.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 500));
    let ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('scratch/badge_desktop_en.jpg', Buffer.from(ss.data, 'base64'));

    // 2. Test language toggle to Spanish
    console.log('\n--- Testing Language Toggle to Spanish ---');
    const esRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          window.setWebsiteLanguage('es');
          const cards = document.querySelectorAll('.menu-card[data-cat="drinks"]');
          const details = [];
          cards.forEach(card => {
            const title = card.querySelector('.menu-card-title').innerText.trim();
            const tag = card.querySelector('.menu-card-tag');
            details.push({
              title,
              tagRenderedText: tag.innerText.trim()
            });
          });
          return details;
        })()
      `
    });
    console.log(JSON.stringify(esRes.result ? esRes.result.value : esRes, null, 2));

    await new Promise(r => setTimeout(r, 500));
    ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('scratch/badge_desktop_es.jpg', Buffer.from(ss.data, 'base64'));

    // 3. Test language toggle back to English
    console.log('\n--- Testing Language Toggle back to English ---');
    const enRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          window.setWebsiteLanguage('en');
          const cards = document.querySelectorAll('.menu-card[data-cat="drinks"]');
          const details = [];
          cards.forEach(card => {
            const title = card.querySelector('.menu-card-title').innerText.trim();
            const tag = card.querySelector('.menu-card-tag');
            details.push({
              title,
              tagRenderedText: tag.innerText.trim()
            });
          });
          return details;
        })()
      `
    });
    console.log(JSON.stringify(enRes.result ? enRes.result.value : enRes, null, 2));

    // 4. Test Category Filter (Drinks & Bar)
    console.log('\n--- Testing Menu Category Filter: Drinks ---');
    const filterRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const btn = document.querySelector('.menu-tab-btn[data-cat="drinks"]');
          if (btn) btn.click();
          const visibleCards = Array.from(document.querySelectorAll('.menu-card')).filter(c => getComputedStyle(c).display !== 'none');
          return {
            btnFound: !!btn,
            visibleCardsCount: visibleCards.length,
            visibleDetails: visibleCards.map(c => ({
              title: c.querySelector('.menu-card-title').innerText.trim(),
              tag: c.querySelector('.menu-card-tag').innerText.trim()
            }))
          };
        })()
      `
    });
    console.log(JSON.stringify(filterRes.result ? filterRes.result.value : filterRes, null, 2));

    // 5. Test Mobile Viewport (375px)
    console.log('\n--- Testing Mobile Viewport (375px) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const allBtn = document.querySelector('.menu-tab-btn[data-filter="all"]');
          if (allBtn) allBtn.click();
          const card = document.querySelector('.menu-card[data-cat="drinks"]');
          if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileCheck = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const card = document.querySelector('.menu-card[data-cat="drinks"]');
          const tag = card.querySelector('.menu-card-tag');
          const tagRect = tag.getBoundingClientRect();
          const mediaRect = card.querySelector('.menu-card-media').getBoundingClientRect();
          return {
            renderedText: tag.innerText.trim(),
            fitsInCard: tagRect.right <= mediaRect.right + 1,
            tagWidth: tagRect.width,
            mediaWidth: mediaRect.width
          };
        })()
      `
    });
    console.log('Mobile check:', mobileCheck.result ? mobileCheck.result.value : mobileCheck);

    ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('scratch/badge_mobile_375.jpg', Buffer.from(ss.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyLaNanaBadge();
