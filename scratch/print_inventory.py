import json

with open('scratch/website_menu_inventory.json', encoding='utf-8') as f:
    items = json.load(f)

for item in items:
    print(f"[{item['index']}] Cat: {item['website_cat']:<12} | Title Key: {item['title_key']}")
    print(f"     EN: {item['title_en']}")
    print(f"     ES: {item['title_es']}")
    print(f"     Img: {item['img_src']}")
    print(f"     Desc (EN): {item['desc_en'][:60]}...")
    print(f"     Desc (ES): {item['desc_es'][:60]}...")
    print()

