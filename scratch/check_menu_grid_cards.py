import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

menu_grid = re.search(r'<div class="menu-grid".*?</div>\s*<!-- Menu Navigation Callout', html, re.DOTALL)
if menu_grid:
    cards = re.findall(r'<article class="menu-card".*?</article>', menu_grid.group(0), re.DOTALL)
    print(f"Found {len(cards)} cards in .menu-grid:")
    for i, c in enumerate(cards):
        img_src = re.search(r'<img [^>]*src="([^"]+)"', c)
        title = re.search(r'<h4 [^>]*>(.*?)</h4>', c)
        src = img_src.group(1) if img_src else 'NO_SRC'
        t = title.group(1) if title else 'NO_TITLE'
        print(f"{i+1}: {t} -> {src}")
else:
    print("Could not find .menu-grid block")

