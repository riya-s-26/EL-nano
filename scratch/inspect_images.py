import os, sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

images = [
    'assets/img/pics from clients/SIN PERSONAS.png',
    'assets/img/pics from clients/night.png',
    'assets/img/pics from clients/EL BAR.png',
    'assets/img/pics from clients/lleno restaurante.jpg.jpeg',
    'assets/img/atmosphere/venue-dining.jpg',
    'assets/img/atmosphere/venue-bar.jpg',
    'assets/img/visit/visit-venue.jpg',
    'assets/img/visit/lleno-restaurante.jpg'
]

for img_path in images:
    if os.path.exists(img_path):
        im = Image.open(img_path)
        print(f"{img_path}: size={im.size}, mode={im.mode}")
    else:
        print(f"NOT FOUND: {img_path}")

