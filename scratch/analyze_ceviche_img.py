from PIL import Image
import numpy as np

img_path = r'assets/img/pics from clients/Ceviche Mixto.jpeg'
im = Image.open(img_path)
w, h = im.size
print(f"Image size: {w}x{h}")

# Let's inspect brightness/color distribution along vertical slices to find where the main bowl is
arr = np.array(im)
# The bowl is blue according to prompt: "The replacement image shows ceviche served in a blue bowl, with seafood, accompaniments, and a visible table setting."
# Let's find pixels where Blue > Red and Blue > Green significantly, or check vertical brightness
print("RGB sample at center:", arr[h//2, w//2])
print("RGB sample at top 10%:", arr[int(h*0.1), w//2])
print("RGB sample at bottom 10%:", arr[int(h*0.9), w//2])

