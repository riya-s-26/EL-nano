from PIL import Image
import numpy as np

im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
w, h = im.size
print(f"Image dimensions: {w} x {h} (aspect ratio: {w/h:.4f})")

arr = np.array(im)

# Let's inspect the entire image vertically:
# Where is the top of the soup bowl?
# Where is the top of the plate?
# Where is the bottom of the bowl?
# Where is the bottom of the plate?
# Where is the left and right of the bowl and plate?

# Let's save a visualization with horizontal/vertical grid lines every 50px
# so we can see exact pixel coordinates
import os
os.makedirs('scratch', exist_ok=True)

# Let's find:
# 1. Topmost pixel of ceramic bowl rim
# Ceramic bowl rim color is brown: R~110-180, G~40-90, B~0-30
# 2. Topmost pixel of plate (if any white visible above bowl)
# 3. Bottommost pixel of plate (white R>190, G>190, B>190)
# 4. Leftmost and rightmost of plate and bowl

white_mask = (arr[:, :, 0] > 190) & (arr[:, :, 1] > 190) & (arr[:, :, 2] > 190)
wy, wx = np.where(white_mask)
print(f"White plate bounds: Y = [{wy.min()}, {wy.max()}], X = [{wx.min()}, {wx.max()}]")
print(f"  White plate height: {wy.max() - wy.min()}px")
print(f"  White plate width: {wx.max() - wx.min()}px")

# Ceramic bowl rim: let's scan column by column or find rim
# Bowl interior has soup, corn, meat. Bowl exterior rim is darker brown.
# At X = 450 (middle):
# Where does the brown rim start?
for y in range(250, 400):
    r, g, b = arr[y, 450][:3]
    # table is lighter wood R~190-210, G~140-160, B~90-120
    # rim is dark brown R~140-170, G~40-70, B~0-20
    print(f"y={y}: R={r}, G={g}, B={b}")
