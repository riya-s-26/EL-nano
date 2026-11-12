from PIL import Image
import numpy as np

im = Image.open('scratch/crop_test_pos_35.jpg')
arr = np.array(im)
w, h = im.size
print(f"crop_test_pos_35.jpg size: {w}x{h}")

for y in range(0, h, 15):
    r, g, b = arr[y, w//2][:3]
    print(f"y={y:3d}: R={r:3d}, G={g:3d}, B={b:3d}")

