const { spawn } = require('child_process');
const fs = require('fs');

async function testContactPage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9224/json');
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

    console.log('=== TEST 1: DESKTOP 1440x900 CONTACT PAGE (EN) ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/contact.html' });
    await new Promise(r => setTimeout(r, 1200));

    const pageAudit = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const heroH1 = document.querySelector('.contact-hero h1')?.innerText.trim();
          const heroP = document.querySelector('.contact-hero p.lead')?.innerText.trim();
          const phoneCardH2 = document.querySelector('.contact-primary-card h2')?.innerText.trim();
          const phoneDisplay = document.querySelector('.contact-phone-display')?.innerText.trim();
          const phoneDisplayHref = document.querySelector('.contact-phone-display')?.getAttribute('href');
          const phoneBtn = document.querySelector('.contact-call-btn')?.innerText.trim();
          const phoneBtnHref = document.querySelector('.contact-call-btn')?.getAttribute('href');
          
          const igCardH3 = document.querySelector('.contact-secondary-grid .contact-card:first-child h3')?.innerText.trim();
          const igCardP = document.querySelector('.contact-secondary-grid .contact-card:first-child p')?.innerText.trim();
          const igBtn = document.querySelector('.contact-secondary-grid .contact-card:first-child .btn')?.innerText.trim();
          const igBtnHref = document.querySelector('.contact-secondary-grid .contact-card:first-child .btn')?.getAttribute('href');

          const groupH3 = document.querySelector('.contact-secondary-grid .contact-card:last-child h3')?.innerText.trim();
          const groupP = document.querySelector('.contact-secondary-grid .contact-card:last-child p')?.innerText.trim();
          const groupBtn = document.querySelector('.contact-secondary-grid .contact-card:last-child .btn')?.innerText.trim();
          const groupBtnHref = document.querySelector('.contact-secondary-grid .contact-card:last-child .btn')?.getAttribute('href');

          const quickLinksH2 = document.querySelector('.contact-quicklinks h2')?.innerText.trim();
          const quickLinkCards = Array.from(document.querySelectorAll('.quicklink-card')).map(c => ({
            title: c.querySelector('h3')?.innerText.trim(),
            href: c.getAttribute('href') || (c.querySelector('a')?.getAttribute('href'))
          }));

          const closingMsg = document.querySelector('.contact-closing p')?.innerText.trim();

          const activeNavLink = document.querySelector('.nav a.active')?.innerText.trim();
          const hasOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

          return {
            heroH1, heroP,
            phoneCardH2, phoneDisplay, phoneDisplayHref, phoneBtn, phoneBtnHref,
            igCardH3, igCardP, igBtn, igBtnHref,
            groupH3, groupP, groupBtn, groupBtnHref,
            quickLinksH2, quickLinkCards,
            closingMsg,
            activeNavLink,
            hasOverflow
          };
        })()
      `
    });
    console.log('Page Audit (EN):', JSON.stringify(pageAudit.result ? pageAudit.result.value : pageAudit, null, 2));

    let ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('scratch/contact_desktop_en.jpg', Buffer.from(ss.data, 'base64'));

    console.log('\n=== TEST 2: BILINGUAL SWITCH TO SPANISH (ES) ===');
    const esAudit = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          window.setWebsiteLanguage('es');
          return {
            docLang: document.documentElement.lang,
            heroH1: document.querySelector('.contact-hero h1')?.innerText.trim(),
            heroP: document.querySelector('.contact-hero p.lead')?.innerText.trim(),
            phoneBtn: document.querySelector('.contact-call-btn')?.innerText.trim(),
            igBtn: document.querySelector('.contact-secondary-grid .contact-card:first-child .btn')?.innerText.trim(),
            groupH3: document.querySelector('.contact-secondary-grid .contact-card:last-child h3')?.innerText.trim(),
            groupBtn: document.querySelector('.contact-secondary-grid .contact-card:last-child .btn')?.innerText.trim(),
            quickLinksH2: document.querySelector('.contact-quicklinks h2')?.innerText.trim(),
            closingMsg: document.querySelector('.contact-closing p')?.innerText.trim(),
            activeNavLink: document.querySelector('.nav a.active')?.innerText.trim()
          };
        })()
      `
    });
    console.log('Spanish Audit:', JSON.stringify(esAudit.result ? esAudit.result.value : esAudit, null, 2));

    ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('scratch/contact_desktop_es.jpg', Buffer.from(ss.data, 'base64'));

    console.log('\n=== TEST 3: MULTI-VIEWPORT RESPONSIVENESS & OVERFLOW CHECKS ===');
    const viewports = [
      { name: 'laptop_1200', w: 1200, h: 800, mobile: false, dsf: 1 },
      { name: 'short_1024x536', w: 1024, h: 536, mobile: false, dsf: 1 },
      { name: 'tablet_768', w: 768, h: 1024, mobile: false, dsf: 1 },
      { name: 'mobile_375', w: 375, h: 667, mobile: true, dsf: 2 },
      { name: 'zoom_125', w: 1440, h: 900, mobile: false, dsf: 1.25 },
      { name: 'zoom_150', w: 1440, h: 900, mobile: false, dsf: 1.5 }
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: vp.dsf,
        mobile: vp.mobile
      });
      await new Promise(r => setTimeout(r, 400));

      const vpCheck = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `
          (() => {
            const doc = document.documentElement;
            return {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth,
              hasHorizontalScroll: doc.scrollWidth > doc.clientWidth,
              phoneBtnWidth: document.querySelector('.contact-call-btn')?.getBoundingClientRect().width,
              navVisible: getComputedStyle(document.querySelector('.nav')).display !== 'none',
              burgerVisible: getComputedStyle(document.querySelector('.burger')).display !== 'none'
            };
          })()
        `
      });
      console.log(`[${vp.name}] Check:`, vpCheck.result ? vpCheck.result.value : vpCheck);

      const ssVp = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      fs.writeFileSync(`scratch/contact_${vp.name}.jpg`, Buffer.from(ssVp.data, 'base64'));
    }

    console.log('\n=== TEST 4: MOBILE DRAWER INTERACTION ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });
    // Open drawer
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.burger').click();`
    });
    await new Promise(r => setTimeout(r, 500));
    const drawerOpenCheck = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const drawer = document.getElementById('drawer');
          return {
            drawerHidden: drawer.hasAttribute('hidden'),
            bodyHasMenuOpen: document.body.classList.contains('menu-open'),
            activeLinkInDrawer: drawer.querySelector('.active')?.innerText.trim()
          };
        })()
      `
    });
    console.log('Mobile Drawer Open Check:', drawerOpenCheck.result ? drawerOpenCheck.result.value : drawerOpenCheck);
    const ssDrawer = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync('scratch/contact_mobile_drawer.jpg', Buffer.from(ssDrawer.data, 'base64'));

    // Close drawer
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.burger').click();`
    });
    await new Promise(r => setTimeout(r, 300));

    console.log('\n=== TEST 5: REGRESSION CHECK ON HOMEPAGE (index.html) ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/MAIN PROJECTS/El-nano-Mockup-5-main/index.html' });
    await new Promise(r => setTimeout(r, 1500));

    const indexCheck = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const contactLink = Array.from(document.querySelectorAll('.nav a')).find(a => a.getAttribute('href') === 'contact.html');
          const drawerContactLink = Array.from(document.querySelectorAll('#drawer a')).find(a => a.getAttribute('href') === 'contact.html');
          const footContactLink = Array.from(document.querySelectorAll('.foot-col a')).find(a => a.getAttribute('href') === 'contact.html');
          const nanaTag = document.querySelector('.menu-card[data-cat="drinks"] .menu-card-tag')?.innerText.trim();

          return {
            navContactFound: !!contactLink,
            navContactText: contactLink?.innerText.trim(),
            drawerContactFound: !!drawerContactLink,
            footContactFound: !!footContactLink,
            nanaTagText: nanaTag,
            navLinksCount: document.querySelectorAll('.nav a').length
          };
        })()
      `
    });
    console.log('Homepage Check:', JSON.stringify(indexCheck.result ? indexCheck.result.value : indexCheck, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testContactPage();
