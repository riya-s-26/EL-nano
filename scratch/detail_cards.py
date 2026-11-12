import json

with open('scratch/website_menu_inventory.json', encoding='utf-8') as f:
    website_cards = json.load(f)

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    micartaya = json.load(f)

# Build a lookup of MiCartaYa products by id and normalized name
mcy_by_id = {}
mcy_by_name = {}
for fam in micartaya['families']:
    for p in fam['products']:
        item = {
            'id': p['id'],
            'name': p['name'],
            'family': fam['name'],
            'family_id': fam['id'],
            'image_url': p.get('image_url') or p.get('image'),
            'es_name': p.get('translations', {}).get('es', {}).get('name', p['name']),
            'es_desc': p.get('translations', {}).get('es', {}).get('short_description', p.get('description')),
        }
        mcy_by_id[p['id']] = item
        mcy_by_name[p['name'].lower()] = item

for card in website_cards:
    print(f"=== CARD {card['index']}: {card['title_en']} / {card['title_es']} ===")
    print(f"  Web Cat: {card['website_cat']} | Img: {card['img_src']}")
    print(f"  Keys: title={card['title_key']}, desc={card['desc_key']}, tag={card['tag_key']}")
    print(f"  EN Desc: {card['desc_en']}")
    print(f"  ES Desc: {card['desc_es']}")
    print()

