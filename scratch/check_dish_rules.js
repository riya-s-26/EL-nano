const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf8');

const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('.dish-shot') || line.includes('.dish') || line.includes('#signature-dishes')) {
    if (!line.includes('.dish-card') && !line.includes('.menu-card')) {
      console.log(`L${idx+1}: ${line}`);
    }
  }
});

