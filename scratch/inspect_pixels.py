import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

# Check what bbb907594ff7f9c5a7effd194b2bca0c.webp matches in the whole client drive
mcy_yap = Image.open("scratch/mcy_images/bbb907594ff7f9c5a7effd194b2bca0c.webp").convert('RGB')
print("mcy_yap size:", mcy_yap.size)
# sample pixel colors or check if it matches anything
print("mcy_yap center color:", mcy_yap.getpixel((450, 450)))
print("mcy_yap corner color:", mcy_yap.getpixel((10, 10)))

# Let's check Yapingacho 1 and 2
yap1 = Image.open("assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 1.jpg").convert('RGB')
yap2 = Image.open("assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 2.jpg").convert('RGB')
print("yap1 size:", yap1.size, "center:", yap1.getpixel((921, 921)))
print("yap2 size:", yap2.size, "center:", yap2.getpixel((921, 921)))

# Also check Arroz marinero on MCY
mcy_am = Image.open("scratch/mcy_images/7ef610edc1e0747b0d9f9a15b30001b0.webp").convert('RGB')
am_jpg = Image.open("assets/img/elnano client drive pics/SABROSOS ARROCES/JPG/2Arroz marinero.jpg").convert('RGB')
print("mcy_am size:", mcy_am.size, "center:", mcy_am.getpixel((450, 450)))
print("am_jpg size:", am_jpg.size, "center:", am_jpg.getpixel((900, 900)))

