import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

def info(path):
    with Image.open(path) as im:
        return f"{im.size}, mode={im.mode}, format={im.format}"

check_files = [
    ("MCY Seco de Pollo", "scratch/mcy_images/41c7c35a6a6500863309ab1f074b0e26.webp"),
    ("Pics from clients Seco de Pollo", "assets/img/pics from clients/Seco de Pollo.jpeg"),
    ("MCY Arroz Marinero", "scratch/mcy_images/7ef610edc1e0747b0d9f9a15b30001b0.webp"),
    ("Client Drive Arroz Marinero JPG", "assets/img/elnano client drive pics/SABROSOS ARROCES/JPG/2Arroz marinero.jpg"),
    ("Client Drive Arroz Marinero PNG", "assets/img/elnano client drive pics/SABROSOS ARROCES/PNG/Arroz marinero.png"),
    ("MCY Yapingacho", "scratch/mcy_images/bbb907594ff7f9c5a7effd194b2bca0c.webp"),
    ("Client Drive Yapingacho 1 JPG", "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 1.jpg"),
    ("Client Drive Yapingacho 2 JPG", "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 2.jpg"),
    ("MCY Parrillada Mariscos", "scratch/mcy_images/144ca4738ad59ea66b244ab22a75bd5c.webp"),
    ("Client Drive Parrillada mini marisco", "assets/img/elnano client drive pics/NUESTRA PARRILLADA/PNG/Parrillada mini marisco.png"),
    ("MCY Carne asada o apanada", "scratch/mcy_images/9b3cc2d6a5f9ca7e255a2e4ac82894e6.webp"),
    ("Client Drive Pollo apanado", "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Pollo apanado.jpg"),
]

for label, p in check_files:
    if os.path.exists(p):
        print(f"{label}: {info(p)} | Size: {os.path.getsize(p)} bytes")
    else:
        print(f"{label}: NOT FOUND at {p}")

