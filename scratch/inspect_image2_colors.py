from PIL import Image
import numpy as np

img1_path = r'C:\Users\riyas\.gemini\antigravity\brain\6d96b463-02d5-4dff-8c08-6d061cb29be8\.user_uploaded\media_1794485248948_250beb6c.jpg'
img2_path = r'C:\Users\riyas\.gemini\antigravity\brain\6d96b463-02d5-4dff-8c08-6d061cb29be8\.user_uploaded\media_1794485270489_be577a56.jpg'

im1 = Image.open(img1_path)
im2 = Image.open(img2_path)

print(f"Image 1 size: {im1.size}")
print(f"Image 2 size: {im2.size}")

# Let's sample colors in Image 2:
# 1. Inside the OPENING HOURS table
# 2. Behind "339 Miracle Mile"
# 3. Across a vertical slice down the center of Image 2
arr2 = np.array(im2)
h, w, _ = arr2.shape

# Let's find table center (opening hours is roughly in the middle vertically, below phone)
# In Image 2 (h=679, w=1024 or similar):
# Let's print colors at various points
print("\nSampling Image 2:")
# Center x is around w // 2
cx = w // 2

for y in range(50, h, 30):
    rgb = arr2[y, cx][:3]
    hex_col = "#{:02X}{:02X}{:02X}".format(*rgb)
    print(f"y={y:3d}, x={cx:3d}: RGB={rgb.tolist()} HEX={hex_col}")


