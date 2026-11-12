import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# find all .menu-card blocks
cards = re.findall(r'<article class="menu-card.*?</article>', content, re.DOTALL)
print(f'Total cards: {len(cards)}')
for i, c in enumerate(cards):
    cat_m = re.search(r'data-cat="([^"]+)"', c)
    cat = cat_m.group(1) if cat_m else ''
    title_m = re.search(r'<h3 class="menu-card-title"[^>]*data-i18n="([^"]+)"[^>]*>(.*?)</h3>', c, re.DOTALL)
    if not title_m:
        title_m = re.search(r'<h3 class="menu-card-title"[^>]*>(.*?)</h3>', c, re.DOTALL)
        t_key = ''
        t_text = re.sub(r'<[^>]+>', '', title_m.group(1)).strip() if title_m else ''
    else:
        t_key = title_m.group(1)
        t_text = re.sub(r'<[^>]+>', '', title_m.group(2)).strip()

    price_m = re.search(r'<div class="menu-card-price[^"]*"[^>]*data-i18n="([^"]+)"[^>]*>(.*?)</div>', c, re.DOTALL)
    if not price_m:
        price_m = re.search(r'<div class="menu-card-price[^"]*"[^>]*>(.*?)</div>', c, re.DOTALL)
        p_key = ''
        p_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', price_m.group(1))).strip() if price_m else ''
    else:
        p_key = price_m.group(1)
        p_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', price_m.group(2))).strip()

    print(f'{i+1}. [{cat}] {t_text} ({t_key}) | Price: {p_text} ({p_key})')

