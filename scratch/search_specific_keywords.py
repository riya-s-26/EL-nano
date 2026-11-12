import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

client_dir = "assets/img/elnano client drive pics"

all_files = []
for root, dirs, files in os.walk(client_dir):
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), client_dir)
        all_files.append(rel)

print(f"Total files in client drive: {len(all_files)}")

# Check any files with 'bolon', 'pan', 'yuca', 'sango', 'choclo', 'cesta'
keywords = ['bolon', 'pan', 'yuca', 'sango', 'choclo', 'cesta', 'verde', 'queso']
for kw in keywords:
    matches = [f for f in all_files if kw in f.lower()]
    print(f"\nKeyword '{kw}' matches ({len(matches)}):")
    for m in matches:
        print(f"   {m}")

