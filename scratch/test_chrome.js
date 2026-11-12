const { spawn } = require('child_process');
const http = require('http');

async function testHeadless() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  // wait 1 sec for chrome to start
  await new Promise(r => setTimeout(r, 1000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/version');
    const versionData = await listRes.json();
    console.log('Chrome Debugger OK:', versionData.Browser);
  } catch (e) {
    console.error('Failed to connect to Chrome:', e.message);
  } finally {
    chrome.kill();
  }
}

testHeadless();

