import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

print("Restaurant:", data.get('restaurant', {}).get('name'))
print("Languages:", data.get('languages'))

families = data.get('families', [])
print(f"Total families (categories): {len(families)}")
for fam in families:
    prods = fam.get('products', [])
    print(f"\n--- Category: {fam.get('name')} (ID: {fam.get('id')}) | Products count: {len(prods)} ---")
    for p in prods:
        print(f"  - Dish: {p.get('name')} | Price: {p.get('price')} | Img: {p.get('image_url') or p.get('image')}")
        if p.get('description'):
            print(f"    Desc: {p.get('description')}")
        if p.get('translations'):
            print(f"    Translations: {p.get('translations')}")

