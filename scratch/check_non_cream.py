from PIL import Image
import numpy as np

im = Image.open('scratch/caldo_force_visible.jpg')
arr = np.array(im)
non_cream = ~((arr[:, :, 0] == 251) & (arr[:, :, 1] == 243) & (arr[:, :, 2] == 230))
y, x = np.where(non_cream)
print(f"Non-cream pixels count: {len(y)}")
if len(y) > 0:
    print(f"X bounds: [{x.min()}, {x.max()}], Y bounds: [{y.min()}, {y.max()}]")
    print(f"Sample non-cream pixel: {arr[y[0], x[0]]}")

