import re, json

with open('index.html', encoding='utf-8') as f:
    html = f.read()

matches = re.findall(r'data-i18n="([^"]+)"', html)
unique_keys = sorted(list(set(matches)))
print(f"Total keys: {len(unique_keys)}")
print(json.dumps(unique_keys, indent=2))
