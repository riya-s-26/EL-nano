import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
with open('es_keys.json', 'r', encoding='utf-8') as f:
    es = json.load(f)

print(f"{'KEY':28} | {'EN TITLE':30} | {'ES TITLE':30}")
print('-'*95)
for k in en:
    if (k.startswith('dish_') or k.startswith('cocktail_')) and k.endswith('_title'):
        print(f"{k:28} | {en.get(k, ''):30} | {es.get(k, ''):30}")

