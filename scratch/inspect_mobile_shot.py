from PIL import Image
import numpy as np

im = Image.open('scratch/mobile_shot_crop.jpg')
arr = np.array(im)
w, h = im.size
print("Mobile shot crop size:", w, h)
for y in range(0, h, 30):
    r, g, b = arr[y, w//2][:3]
    print(f"y={y:3d}: ({r:3d}, {g:3d}, {b:3d})")

