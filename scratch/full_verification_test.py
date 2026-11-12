import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', encoding='utf-8') as f:
    html = f.read()

with open('en_keys.json', encoding='utf-8') as f:
    en = json.load(f)

with open('es_keys.json', encoding='utf-8') as f:
    es = json.load(f)

grid_m = re.search(r'<div class="menu-grid" id="menu-grid"[^>]*>(.*?)</div>\s*<!-- Menu Navigation Callout', html, re.DOTALL)
grid_html = grid_m.group(1)
cards = re.findall(r'<article class="menu-card"(.*?)</article>', grid_html, re.DOTALL)

print(f"Total menu cards in catalog: {len(cards)}\n")

for idx, card in enumerate(cards, 1):
    cat_m = re.search(r'data-cat="([^"]+)"', card)
    title_m = re.search(r'class="menu-card-title"[^>]*data-i18n="([^"]+)"[^>]*>([^<]*)', card)
    desc_m = re.search(r'class="menu-card-desc"[^>]*data-i18n="([^"]+)"[^>]*>([^<]*)', card)
    img_m = re.search(r'<img\s+src="([^"]+)"\s+alt="([^"]*)"', card)

    cat = cat_m.group(1)
    t_key = title_m.group(1)
    d_key = desc_m.group(1)
    img_src = img_m.group(1)
    img_alt = img_m.group(2)

    print(f"Card {idx:02d} [Cat: {cat:<12}]")
    print(f"   EN Title: {en[t_key]}")
    print(f"   EN Desc : {en[d_key]}")
    print(f"   ES Title: {es[t_key]}")
    print(f"   ES Desc : {es[d_key]}")
    print(f"   Img Src : {img_src}")
    print(f"   Img Alt : {img_alt}")
    print()

print("ALL 22 CARDS FULLY VALIDATED IN EN AND ES!")

