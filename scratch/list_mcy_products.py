import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/micartaya_dump.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for fam in d.get('families', []):
    print(f"\n=== FAMILY: {fam.get('name')} (ID: {fam.get('id')}) ===")
    for p in fam.get('products', []):
        desc = ''
        if p.get('translations') and 'es' in p['translations']:
            desc = p['translations']['es'].get('short_description') or ''
        price = p.get('price')
        print(f"  * {p.get('name')} [price: {price}] -> '{desc}'")

