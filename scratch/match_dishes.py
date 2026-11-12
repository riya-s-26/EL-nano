import json
import re
from pathlib import Path

with open('scratch/website_menu_inventory.json', encoding='utf-8') as f:
    inventory = json.load(f)

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    micartaya = json.load(f)

with open('scratch/client_images_list.txt', encoding='utf-8') as f:
    client_images_text = f.read()

# Build a list of all MiCartaYa products with their category and details
mcy_products = []
for fam in micartaya['families']:
    fam_name = fam['name']
    fam_id = fam['id']
    for p in fam['products']:
        mcy_products.append({
            'family_id': fam_id,
            'family_name': fam_name,
            'id': p['id'],
            'name': p['name'],
            'image_url': p.get('image_url') or p.get('image'),
            'es_name': p.get('translations', {}).get('es', {}).get('name', p['name']),
            'es_desc': p.get('translations', {}).get('es', {}).get('short_description', p.get('description')),
        })

print(f"Total MiCartaYa products: {len(mcy_products)}")

out_lines = []
for item in inventory:
    out_lines.append(f"\n================================================================================")
    out_lines.append(f"CARD #{item['index']}: {item['title_en']} / {item['title_es']}")
    out_lines.append(f"  Current Category: {item['website_cat']}")
    out_lines.append(f"  Current Image: {item['img_src']}")
    out_lines.append(f"  Current EN Desc: {item['desc_en']}")
    out_lines.append(f"  Current ES Desc: {item['desc_es']}")
    
    # Find matching MiCartaYa product(s)
    matches = []
    # search by title keywords
    t_en = item['title_en'].lower()
    t_es = item['title_es'].lower()
    for mp in mcy_products:
        mp_name = mp['name'].lower()
        if mp_name in t_en or mp_name in t_es or t_en in mp_name or t_es in mp_name:
            matches.append(mp)
        elif any(word in mp_name for word in t_en.split() if len(word) > 4):
            matches.append(mp)

    out_lines.append(f"  MiCartaYa Candidates ({len(matches)}):")
    for m in matches:
        out_lines.append(f"    - [{m['family_name']}] ID {m['id']}: {m['name']} (ES name: {m['es_name']})")
        out_lines.append(f"      Official ES Desc: {m['es_desc']}")
        out_lines.append(f"      Official Image URL: {m['image_url']}")

with open('scratch/card_matches_prelim.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print("Wrote scratch/card_matches_prelim.txt")

