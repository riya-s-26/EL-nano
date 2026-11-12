import re
import json

with open('index.html', encoding='utf-8') as f:
    html = f.read()

with open('en_keys.json', encoding='utf-8') as f:
    en_keys = json.load(f)

with open('es_keys.json', encoding='utf-8') as f:
    es_keys = json.load(f)

# Find menu-grid content
grid_match = re.search(r'<div class="menu-grid" id="menu-grid"[^>]*>(.*?)</div>\s*<!-- Menu Navigation Callout', html, re.DOTALL)
if not grid_match:
    # try broader match
    grid_match = re.search(r'<div class="menu-grid" id="menu-grid"[^>]*>(.*?)</section>', html, re.DOTALL)

grid_html = grid_match.group(1)

# Split by <article class="menu-card"
articles = re.findall(r'<article class="menu-card"(.*?)</article>', grid_html, re.DOTALL)

print(f"Total menu cards found in #menu-grid: {len(articles)}\n")

inventory = []

for idx, art in enumerate(articles, 1):
    cat_m = re.search(r'data-cat="([^"]+)"', art)
    cat = cat_m.group(1) if cat_m else ''

    tag_m = re.search(r'class="menu-card-tag"[^>]*data-i18n="([^"]+)"[^>]*>([^<]*)', art)
    tag_key = tag_m.group(1) if tag_m else ''
    tag_en = en_keys.get(tag_key, tag_m.group(2) if tag_m else '')
    tag_es = es_keys.get(tag_key, '')

    img_m = re.search(r'<img\s+src="([^"]+)"\s+alt="([^"]*)"', art)
    img_src = img_m.group(1) if img_m else ''
    img_alt = img_m.group(2) if img_m else ''

    title_m = re.search(r'class="menu-card-title"[^>]*data-i18n="([^"]+)"[^>]*>([^<]*)', art)
    title_key = title_m.group(1) if title_m else ''
    title_en = en_keys.get(title_key, title_m.group(2) if title_m else '')
    title_es = es_keys.get(title_key, '')

    price_m = re.search(r'class="menu-card-price[^"]*"[^>]*data-i18n="([^"]+)"[^>]*>(.*?)</span>', art, re.DOTALL)
    price_key = price_m.group(1) if price_m else ''
    price_en = en_keys.get(price_key, price_m.group(2) if price_m else '')
    price_es = es_keys.get(price_key, '')

    desc_m = re.search(r'class="menu-card-desc"[^>]*data-i18n="([^"]+)"[^>]*>(.*?)</p>', art, re.DOTALL)
    desc_key = desc_m.group(1) if desc_m else ''
    desc_en = en_keys.get(desc_key, desc_m.group(2) if desc_m else '')
    desc_es = es_keys.get(desc_key, '')

    item = {
        'index': idx,
        'website_cat': cat,
        'title_key': title_key,
        'title_en': title_en.strip(),
        'title_es': title_es.strip(),
        'desc_key': desc_key,
        'desc_en': desc_en.strip(),
        'desc_es': desc_es.strip(),
        'tag_key': tag_key,
        'tag_en': tag_en.strip(),
        'tag_es': tag_es.strip(),
        'price_key': price_key,
        'img_src': img_src.strip(),
        'img_alt': img_alt.strip(),
    }
    inventory.append(item)

with open('scratch/website_menu_inventory.json', 'w', encoding='utf-8') as f:
    json.dump(inventory, f, indent=2, ensure_ascii=False)

print(f"Parsed {len(inventory)} items successfully into scratch/website_menu_inventory.json")

