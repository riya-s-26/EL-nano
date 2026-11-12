import cv2
import numpy as np

img = cv2.imread('assets/img/pics from clients/Ceviche Mixto.jpeg')
h, w, _ = img.shape
print(f"Loaded image: {w}x{h}")

# Convert to HSV to find the blue bowl or the dish contents
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Blue color range in HSV: Hue ~ 90-130
lower_blue = np.array([85, 40, 40])
upper_blue = np.array([135, 255, 255])
mask = cv2.inRange(hsv, lower_blue, upper_blue)

blue_pts = cv2.findNonZero(mask)
if blue_pts is not None:
    bx, by, bw, bh = cv2.boundingRect(blue_pts)
    print(f"Blue bowl bounding box: X=[{bx}:{bx+bw}] ({bw}px wide), Y=[{by}:{by+bh}] ({bh}px high)")
    print(f"Bowl top: {by} ({by/h*100:.1f}%), Bowl bottom: {by+bh} ({(by+bh)/h*100:.1f}%), Bowl center Y: {by+bh//2} ({(by+bh//2)/h*100:.1f}%)")
    print(f"Bowl left: {bx} ({bx/w*100:.1f}%), Bowl right: {bx+bw} ({(bx+bw)/w*100:.1f}%), Bowl center X: {bx+bw//2} ({(bx+bw//2)/w*100:.1f}%)")
else:
    print("No blue mask detected, let's inspect colors.")

