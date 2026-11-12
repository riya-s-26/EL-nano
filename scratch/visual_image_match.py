import os
import sys
from pathlib import Path
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def get_img_thumb(path, size=(64, 64)):
    try:
        with Image.open(path) as im:
            im = im.convert('RGB').resize(size)
            return np.array(im, dtype=np.float32)
    except Exception as e:
        return None

mcy_dir = Path("scratch/mcy_images")
client_dir = Path("assets/img/elnano client drive pics")

client_thumbs = {}
for root, dirs, files in os.walk(client_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            full_path = os.path.join(root, f)
            t = get_img_thumb(full_path)
            if t is not None:
                client_thumbs[full_path.replace("\\", "/")] = t

print(f"Loaded {len(client_thumbs)} client drive thumbnails.")

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    import json
    data = json.load(f)

img_to_prod = {}
for fam in data['families']:
    for p in fam['products']:
        url = p.get('image_url') or p.get('image')
        if url:
            fname = os.path.basename(url)
            img_to_prod[fname] = {
                'name': p['name'],
                'fam': fam['name'],
                'desc': p.get('translations', {}).get('es', {}).get('short_description', p.get('description'))
            }

for mcy_file in sorted(os.listdir(mcy_dir)):
    mcy_path = os.path.join(mcy_dir, mcy_file)
    if os.path.getsize(mcy_path) == 0:
        continue
    t_mcy = get_img_thumb(mcy_path)
    if t_mcy is None:
        continue
    
    prod = img_to_prod.get(mcy_file, {'name': 'Unknown', 'fam': 'Unknown'})
    
    # Calculate MSE with all client thumbs
    best_matches = []
    for c_path, t_cli in client_thumbs.items():
        diff = np.mean((t_mcy - t_cli) ** 2)
        best_matches.append((diff, c_path))
    best_matches.sort(key=lambda x: x[0])
    
    best_diff, best_path = best_matches[0]
    print(f"\nMCY Dish: [{prod['fam']}] {prod['name']}")
    print(f"   MCY File: {mcy_file}")
    print(f"   Best Match (MSE: {best_diff:.1f}): {best_path}")
    if len(best_matches) > 1 and best_matches[1][0] < best_diff + 10:
        print(f"   2nd Match  (MSE: {best_matches[1][0]:.1f}): {best_matches[1][1]}")

