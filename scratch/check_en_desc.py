import json

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

has_desc = []
has_en = []
all_langs = set()

for fam in data['families']:
    for p in fam['products']:
        if p.get('description'):
            has_desc.append((p['name'], p['description']))
        if p.get('translations'):
            for l, t in p['translations'].items():
                all_langs.add(l)
                if l == 'en':
                    has_en.append((p['name'], t))

print(f"Products with root description: {len(has_desc)}")
for n, d in has_desc:
    print(f"  {n}: {d}")

print(f"\nAll language keys in translations: {all_langs}")
print(f"Products with 'en' translation: {len(has_en)}")

