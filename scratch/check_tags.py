import json

with open('en_keys.json', 'r', encoding='utf-8') as f: en = json.load(f)
with open('es_keys.json', 'r', encoding='utf-8') as f: es = json.load(f)
for k in ['tag_signature_cocktail', 'tag_house_special', 'tag_craft_cocktail']:
    print(f'{k}: EN="{en.get(k)}" | ES="{es.get(k)}"')

