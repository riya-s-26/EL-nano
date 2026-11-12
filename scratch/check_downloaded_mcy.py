import json
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/micartaya_dump.json', encoding='utf-8') as f:
    data = json.load(f)

# Map image filename to product
img_to_prod = {}
for fam in data['families']:
    for p in fam['products']:
        url = p.get('image_url') or p.get('image')
        if url:
            fname = os.path.basename(url)
            img_to_prod[fname] = {
                'family': fam['name'],
                'dish_id': p['id'],
                'dish_name': p['name'],
                'desc': p.get('translations', {}).get('es', {}).get('short_description', p.get('description')),
                'url': url
            }

downloaded = os.listdir('scratch/mcy_images')
print(f"Downloaded {len(downloaded)} images.")

for f in sorted(downloaded):
    sz = os.path.getsize(os.path.join('scratch/mcy_images', f))
    prod_info = img_to_prod.get(f, {})
    print(f"File: {f} ({sz} bytes) -> Dish: {prod_info.get('dish_name')} ({prod_info.get('family')})")

