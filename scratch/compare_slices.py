from PIL import Image
import numpy as np

img1_path = r'C:\Users\riyas\.gemini\antigravity\brain\6d96b463-02d5-4dff-8c08-6d061cb29be8\.user_uploaded\media_1794485248948_250beb6c.jpg'
img2_path = r'C:\Users\riyas\.gemini\antigravity\brain\6d96b463-02d5-4dff-8c08-6d061cb29be8\.user_uploaded\media_1794485270489_be577a56.jpg'

im1 = Image.open(img1_path)
im2 = Image.open(img2_path)

arr1 = np.array(im1)
arr2 = np.array(im2)

print("IMAGE 1 (Current):")
# In Image 1, let's sample between text lines, e.g. around x=im1.width//2
cx1 = im1.width // 2
for y in [40, 80, 120, 160, 200, 240, 280, 350, 400]:
    rgb = arr1[y, cx1][:3]
    print(f"y={y:3d}, x={cx1:3d}: RGB={rgb.tolist()} HEX=#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}")

# Let's inspect Image 1 vs Image 2 horizontally around "339 Miracle Mile"
print("\nHorizontal slice across 339 Miracle Mile in Image 2:")
# Heading is around y=100-130 in Image 2
# Let's sample above the heading at y=100
for x in range(100, im2.width, 80):
    rgb = arr2[100, x][:3]
    print(f"y=100, x={x:3d}: RGB={rgb.tolist()} HEX=#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}")

print("\nHorizontal slice across 339 Miracle Mile in Image 1:")
for x in range(100, im1.width, 80):
    rgb = arr1[100, x][:3]
    print(f"y=100, x={x:3d}: RGB={rgb.tolist()} HEX=#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}")

