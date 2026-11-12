import json

with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
with open('es_keys.json', 'r', encoding='utf-8') as f:
    es = json.load(f)

for k, v in en.items():
    if 'price' in k:
        print(f'{k}: EN="{v}" | ES="{es.get(k)}"')

