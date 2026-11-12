from PIL import Image
import numpy as np

im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
w, h = im.size
arr = np.array(im)

# Let's find white plate: bright pixels (R > 200, G > 200, B > 200)
# and brown bowl: (R ~ 100-160, G ~ 60-100, B ~ 30-70)
# and wooden table: (R ~ 170-220, G ~ 140-180, B ~ 100-140)

white_mask = (arr[:, :, 0] > 210) & (arr[:, :, 1] > 210) & (arr[:, :, 2] > 210)
y_indices, x_indices = np.where(white_mask)

print(f"White plate bounds: Y=[{y_indices.min()}:{y_indices.max()}], X=[{x_indices.min()}:{x_indices.max()}]")
print(f"Plate Top: {y_indices.min()} ({y_indices.min()/h*100:.1f}%), Bottom: {y_indices.max()} ({y_indices.max()/h*100:.1f}%)")
print(f"Plate Left: {x_indices.min()} ({x_indices.min()/w*100:.1f}%), Right: {x_indices.max()} ({x_indices.max()/w*100:.1f}%)")

# Let's find bowl center and diameter
# Let's check vertical slices across the image

