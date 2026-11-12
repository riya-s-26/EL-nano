import os, sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('assets/img'):
    for f in files:
        if 'ceviche' in f.lower():
            p = os.path.join(root, f)
            print(p)
            try:
                im = Image.open(p)
                clean_name = f.replace(' ', '_').replace("'", "")
                im.resize((200, 150)).save(f'scratch/cev_{clean_name}.jpg')
            except Exception as e:
                print("Error:", e)

