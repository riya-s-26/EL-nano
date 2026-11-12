import json

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

lines = []
lines.append(f"Restaurant: {data.get('restaurant', {}).get('name')}")
lines.append(f"Languages: {data.get('languages')}")

families = data.get('families', [])
lines.append(f"Total families (categories): {len(families)}")

for fam in families:
    prods = fam.get('products', [])
    lines.append(f"\n=======================================================")
    lines.append(f"CATEGORY: {fam.get('name')} (ID: {fam.get('id')}) | Products count: {len(prods)}")
    lines.append(f"=======================================================")
    for p in prods:
        lines.append(f"ID: {p.get('id')} | Name: {p.get('name')} | Price: {p.get('price')} | Img: {p.get('image_url') or p.get('image')}")
        if p.get('description'):
            lines.append(f"  Description: {p.get('description')}")
        if p.get('translations'):
            lines.append(f"  Translations: {json.dumps(p.get('translations'), ensure_ascii=False)}")
        for k, v in p.items():
            if k not in ['id', 'name', 'price', 'image_url', 'image', 'description', 'translations', 'allergens', 'options', 'sizes']:
                pass

with open('scratch/all_micartaya_dishes_utf8.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Wrote scratch/all_micartaya_dishes_utf8.txt successfully!")

