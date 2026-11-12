const fs = require('fs');

let css = fs.readFileSync('assets/css/style.css', 'utf8');

// 1. Update object-position from center 60% to center 35%
css = css.replace(
  '.dish[data-name="Caldo de Bola"] .dish-shot img {\n  object-position: center 60% !important;\n}',
  '.dish[data-name="Caldo de Bola"] .dish-shot img {\n  object-position: center 35% !important;\n}'
);

// 2. Add pinned container height rule for Caldo de Bola
const oldPinnedShot = `.pinned .dish-shot {
  aspect-ratio: auto;
  height: min(65svh, 620px);
  clip-path: inset(100% 0 0 0);
  transition: clip-path 1s var(--ease);
}`;

const newPinnedShot = `.pinned .dish-shot {
  aspect-ratio: auto;
  height: min(65svh, 620px);
  clip-path: inset(100% 0 0 0);
  transition: clip-path 1s var(--ease);
}
.pinned .dish[data-name="Caldo de Bola"] .dish-shot {
  height: min(70svh, 650px);
}`;

if (css.includes(oldPinnedShot)) {
  css = css.replace(oldPinnedShot, newPinnedShot);
} else {
  console.log('Trying regex replace for .pinned .dish-shot...');
  css = css.replace(
    /\.pinned \.dish-shot\s*\{[\s\S]*?transition:\s*clip-path 1s var\(--ease\);\s*\}/,
    newPinnedShot
  );
}

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Successfully updated assets/css/style.css');

