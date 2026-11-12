import urllib.request
import json

urls = [
    'https://el-nano-miami.micartaya.es/api/public/menu?slug=el-nano-miami',
    'https://el-nano-miami.micartaya.es/api/public/menu',
    'https://micartaya.es/api/public/menu?slug=el-nano-miami',
]

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode('utf-8')
            print(f"Success for {url}! Response length: {len(data)}")
            obj = json.loads(data)
            print("Keys:", list(obj.keys()) if isinstance(obj, dict) else len(obj))
            with open('scratch/micartaya_dump.json', 'w', encoding='utf-8') as f:
                json.dump(obj, f, indent=2, ensure_ascii=False)
            break
    except Exception as e:
        print(f"Failed {url}: {e}")

