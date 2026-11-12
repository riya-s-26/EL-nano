const fs = require('fs');

// Evaluate translations.js
const translationsCode = fs.readFileSync('assets/js/translations.js', 'utf8');
const window = {};
eval(translationsCode);

console.log('window.I18N_DATA loaded successfully!');
console.log('EN keys count:', Object.keys(window.I18N_DATA.en).length);
console.log('ES keys count:', Object.keys(window.I18N_DATA.es).length);

// Compare against JSON files
const enJson = JSON.parse(fs.readFileSync('en_keys.json', 'utf8'));
const esJson = JSON.parse(fs.readFileSync('es_keys.json', 'utf8'));

let enMatches = true;
for (const k in enJson) {
  if (enJson[k] !== window.I18N_DATA.en[k]) {
    console.error(`Mismatch for EN key ${k}`);
    enMatches = false;
  }
}
if (enMatches) console.log('All EN keys in translations.js match en_keys.json perfectly!');

let esMatches = true;
for (const k in esJson) {
  if (esJson[k] !== window.I18N_DATA.es[k]) {
    console.error(`Mismatch for ES key ${k}`);
    esMatches = false;
  }
}
if (esMatches) console.log('All ES keys in translations.js match es_keys.json perfectly!');

