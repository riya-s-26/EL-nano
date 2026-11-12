import urllib.request
import json

tests = [
    ('https://el-nano-miami.micartaya.es/api/public/menu?slug=el-nano-miami&lang=en', {}),
    ('https://el-nano-miami.micartaya.es/api/public/menu?slug=el-nano-miami&lang=es', {}),
    ('https://el-nano-miami.micartaya.es/api/public/menu?slug=el-nano-miami', {'Accept-Language': 'en'}),
    ('https://el-nano-miami.micartaya.es/api/public/menu?slug=el-nano-miami', {'Accept-Language': 'en-US,en;q=0.9'}),
]

for url, headers in tests:
    headers['User-Agent'] = 'Mozilla/5.0'
    headers['Accept'] = 'application/json'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            # Check a product description
            prod = data['families'][3]['products'][0] # Encebollado
            print(f"URL: {url} | Headers: {headers}")
            print(f"  Prod: {prod.get('name')}")
            print(f"  Desc: {prod.get('description')}")
            print(f"  Translations: {prod.get('translations')}")
    except Exception as e:
        print(f"Error {url}: {e}")

