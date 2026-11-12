from PIL import Image
import os

img_path = r'assets/img/pics from clients/Ceviche Mixto.jpeg'
if os.path.exists(img_path):
    with Image.open(img_path) as im:
        print(f"Path: {img_path}")
        print(f"Format: {im.format}")
        print(f"Size: {im.size} (Width: {im.width}, Height: {im.height})")
        print(f"Aspect ratio: {im.width / im.height:.4f}")
        print(f"Mode: {im.mode}")
else:
    print("File not found:", img_path)

