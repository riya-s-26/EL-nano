from PIL import Image

img_path = r'assets/img/pics from clients/Ceviche Mixto.jpeg'
im = Image.open(img_path)
w, h = im.size
crop_h = int(w * 10 / 16) # 701

for pct in [30, 40, 45, 50, 55, 60]:
    top = int((h - crop_h) * (pct / 100))
    bottom = top + crop_h
    cropped = im.crop((0, top, w, bottom))
    cropped.save(f'scratch/crop_{pct}.jpg', quality=85)
    print(f"Saved scratch/crop_{pct}.jpg: Y=[{top}:{bottom}]")

