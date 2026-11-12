import os
import sys
import json
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Check if PIL is available
try:
    from PIL import Image
    has_pil = True
except ImportError:
    has_pil = False

print(f"PIL available: {has_pil}")

client_drive_dir = Path("assets/img/elnano client drive pics")
client_images = []
for root, dirs, files in os.walk(client_drive_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            full_path = os.path.join(root, f)
            client_images.append({
                'path': full_path.replace("\\", "/"),
                'filename': f,
                'folder': os.path.relpath(root, client_drive_dir).replace("\\", "/"),
                'size': os.path.getsize(full_path)
            })

print(f"Total client drive images: {len(client_images)}")

# Map downloaded mcy images
mcy_dir = Path("scratch/mcy_images")
with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

img_to_prod = {}
for fam in data['families']:
    for p in fam['products']:
        url = p.get('image_url') or p.get('image')
        if url:
            fname = os.path.basename(url)
            img_to_prod[fname] = p['name']

for mcy_file in sorted(os.listdir(mcy_dir)):
    mcy_path = os.path.join(mcy_dir, mcy_file)
    sz = os.path.getsize(mcy_path)
    if sz == 0:
        continue
    dish = img_to_prod.get(mcy_file, "Unknown")
    
    # Check if any client drive image has same size or similar name
    same_size = [ci for ci in client_images if ci['size'] == sz]
    if same_size:
        print(f"EXACT SIZE MATCH for MiCartaYa [{dish}] ({mcy_file}):")
        for s in same_size:
            print(f"   -> {s['path']} ({s['size']} bytes)")
    else:
        # Check by filename / dish name
        dish_clean = dish.lower().replace(" ", "")
        name_matches = [ci for ci in client_images if any(w in ci['filename'].lower() for w in dish.lower().split() if len(w) > 4)]
        print(f"MiCartaYa [{dish}] ({mcy_file}, {sz} bytes): {len(name_matches)} name matches in client drive")
        for nm in name_matches[:3]:
            print(f"   -> {nm['path']} ({nm['size']} bytes)")

