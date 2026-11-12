import json

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

for fam in data['families']:
    for p in fam['products']:
        if p.get('translations') or p.get('description'):
            print(f"Product: {p.get('name')}")
            print(f"  Root name: {p.get('name')}")
            print(f"  Root desc: {p.get('description')}")
            print(f"  Translations: {p.get('translations')}")
            print("-" * 40)

