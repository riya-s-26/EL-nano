import os, sys
sys.stdout.reconfigure(encoding='utf-8')

root_dir = r'assets/img/elnano client drive pics'
with open('scratch/all_drive_pics.txt', 'w', encoding='utf-8') as out:
    for root, dirs, files in os.walk(root_dir):
        for f in sorted(files):
            rel = os.path.relpath(os.path.join(root, f), root_dir)
            out.write(f"{rel}\n")
print("Saved scratch/all_drive_pics.txt")

