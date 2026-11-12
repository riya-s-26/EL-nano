import re
import os
from PIL import Image

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all img src, srcset, pictures and their sections
sections = re.findall(r'(<(?:section|header|footer)[^>]*>.*?</(?:section|header|footer)>)', html, re.DOTALL)

print(f"Total top-level sections found: {len(sections)}")

inventory = []

for sec in sections:
    sec_match = re.search(r'class="([^"]+)"', sec)
    sec_id = re.search(r'id="([^"]+)"', sec)
    sec_name = (sec_match.group(1) if sec_match else '') + (' #' + sec_id.group(1) if sec_id else '')
    
    # Find all image tags within this section
    imgs = re.findall(r'<img([^>]+)>', sec)
    sources = re.findall(r'<source([^>]+)>', sec)
    
    sec_images = []
    for img in imgs:
        src = re.search(r'src="([^"]+)"', img)
        alt = re.search(r'alt="([^"]*)"', img)
        width = re.search(r'width="([^"]+)"', img)
        height = re.search(r'height="([^"]+)"', img)
        if src:
            sec_images.append({
                'src': src.group(1),
                'alt': alt.group(1) if alt else '',
                'w': width.group(1) if width else '',
                'h': height.group(1) if height else '',
                'section': sec_name
            })
    for src_tag in sources:
        srcset = re.search(r'srcset="([^"]+)"', src_tag)
        if srcset:
            sec_images.append({
                'src': srcset.group(1),
                'alt': '(source tag)',
                'w': '',
                'h': '',
                'section': sec_name
            })
    inventory.extend(sec_images)

print(f"\nTotal image references: {len(inventory)}")
print("-" * 105)
print(f"{'Section':<28} | {'Image Path':<35} | {'Dimensions':<12} | {'Size KB':<8} | {'Notes'}")
print("-" * 105)

seen_src = {}
for item in inventory:
    path = item['src'].split('?')[0]
    sec = item['section'][:27]
    if os.path.exists(path):
        size_kb = os.path.getsize(path) / 1024
        try:
            with Image.open(path) as im:
                dim = f"{im.size[0]}x{im.size[1]}"
                res_status = "Good"
                if im.size[0] < 800 and im.size[1] < 800 and not path.endswith('.svg') and not 'logo' in path:
                    res_status = "LOW-RES!"
        except Exception:
            dim = "SVG/Vector"
            res_status = "Vector"
    else:
        dim = "MISSING"
        size_kb = 0
        res_status = "MISSING!"
    
    dup_note = ""
    # Strip extension to detect if same base photo is used in different sections
    base_name = os.path.splitext(os.path.basename(path))[0]
    if base_name in seen_src and seen_src[base_name] != sec and not 'logo' in path:
        dup_note = f"DUPLICATE with {seen_src[base_name]}"
    seen_src[base_name] = sec
    
    print(f"{sec:<28} | {path:<35} | {dim:<12} | {size_kb:<8.1f} | {res_status} {dup_note}")
