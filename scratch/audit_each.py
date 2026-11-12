import json

with open('scratch/website_menu_inventory.json', encoding='utf-8') as f:
    cards = json.load(f)

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    micartaya = json.load(f)

# Collect all MiCartaYa products
mcy_prods = {}
for fam in micartaya['families']:
    for p in fam['products']:
        mcy_prods[p['id']] = {
            'id': p['id'],
            'name': p['name'],
            'family': fam['name'],
            'image_url': p.get('image_url') or p.get('image'),
            'es_name': p.get('translations', {}).get('es', {}).get('name', p['name']),
            'es_desc': p.get('translations', {}).get('es', {}).get('short_description'),
        }

for card in cards:
    print(f"Index: {card['index']}")
    print(f"  Title EN: {card['title_en']} | Key: {card['title_key']}")
    print(f"  Title ES: {card['title_es']}")
    print(f"  Desc EN: {card['desc_en']}")
    print(f"  Desc ES: {card['desc_es']}")
    print(f"  Cat: {card['website_cat']}")
    print(f"  Img: {card['img_src']}")
    print("-" * 50)

