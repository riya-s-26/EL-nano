import urllib.request
import hashlib
import json
import os
from pathlib import Path

# Load MiCartaYa products
with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

# Collect all image URLs from MiCartaYa
mcy_imgs = {}
for fam in data['families']:
    for p in fam['products']:
        url = p.get('image_url') or p.get('image')
        if url:
            mcy_imgs[p['name']] = url

print(f"Total MiCartaYa products with images: {len(mcy_imgs)}")

# Download and get hashes/sizes of MiCartaYa images
os.makedirs('scratch/mcy_images', exist_ok=True)
mcy_hashes = {}

for name, url in mcy_imgs.items():
    local_path = os.path.join('scratch/mcy_images', os.path.basename(url))
    if not os.path.exists(local_path):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(local_path, 'wb') as out:
                out.write(resp.read())
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            continue
    size = os.path.getsize(local_path)
    with open(local_path, 'rb') as f:
        md5 = hashlib.md5(f.read()).hexdigest()
    mcy_hashes[name] = {'url': url, 'size': size, 'md5': md5, 'filename': os.path.basename(url)}

print(f"Downloaded {len(mcy_hashes)} images from MiCartaYa.")

with open('scratch/mcy_image_hashes.json', 'w', encoding='utf-8') as f:
    json.dump(mcy_hashes, f, indent=2)

