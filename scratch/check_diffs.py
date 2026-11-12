import os
import sys
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def diff(p1, p2):
    with Image.open(p1) as im1, Image.open(p2) as im2:
        a1 = np.array(im1.convert('RGB').resize((100, 100)), dtype=np.float32)
        a2 = np.array(im2.convert('RGB').resize((100, 100)), dtype=np.float32)
        return np.mean((a1 - a2) ** 2)

print("Seco de pollo diff:", diff(
    "scratch/mcy_images/41c7c35a6a6500863309ab1f074b0e26.webp",
    "assets/img/pics from clients/Seco de Pollo.jpeg"
))

print("Yapingacho 1 diff:", diff(
    "scratch/mcy_images/bbb907594ff7f9c5a7effd194b2bca0c.webp",
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 1.jpg"
))

print("Yapingacho 2 diff:", diff(
    "scratch/mcy_images/bbb907594ff7f9c5a7effd194b2bca0c.webp",
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 2.jpg"
))

print("Arroz marinero diff:", diff(
    "scratch/mcy_images/7ef610edc1e0747b0d9f9a15b30001b0.webp",
    "assets/img/elnano client drive pics/SABROSOS ARROCES/JPG/2Arroz marinero.jpg"
))

print("Parrillada marisco diff:", diff(
    "scratch/mcy_images/144ca4738ad59ea66b244ab22a75bd5c.webp",
    "assets/img/elnano client drive pics/NUESTRA PARRILLADA/JPG/3Parrillada mini marisco.jpg"
))

