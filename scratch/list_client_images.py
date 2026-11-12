import os
from pathlib import Path

img_dir = Path("assets/img/elnano client drive pics")
files_by_cat = {}

for root, dirs, files in os.walk(img_dir):
    rel = os.path.relpath(root, img_dir)
    image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif'))]
    if image_files:
        files_by_cat[rel] = sorted(image_files)

total_images = sum(len(f) for f in files_by_cat.values())
lines = [f"Total image files found: {total_images} across {len(files_by_cat)} folders\n"]

for cat, files in sorted(files_by_cat.items()):
    lines.append(f"Folder: {cat} ({len(files)} files)")
    for f in files:
        full_path = os.path.join(img_dir, cat, f)
        size = os.path.getsize(full_path)
        lines.append(f"   {f} ({size} bytes)")

with open("scratch/client_images_list.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(lines))

print(f"Saved {total_images} files to scratch/client_images_list.txt")

