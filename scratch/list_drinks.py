import os, sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('assets/img'):
    for f in files:
        if any(w in f.lower() for w in ['coctel', 'cocktail', 'drink', 'bar', 'pina', 'canelazo', 'nana', 'jugo', 'zumo']):
            if f.lower().endswith(('.jpg', '.png', '.jpeg', '.webp')):
                p = os.path.join(root, f)
                print(p)

