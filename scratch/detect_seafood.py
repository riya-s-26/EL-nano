import cv2
import numpy as np

img = cv2.imread('assets/img/pics from clients/Ceviche Mixto.jpeg')
h, w, _ = img.shape

# Let's find the ceviche contents inside the bowl (reds/oranges of shrimp, red onions, tomatoes)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Red/Orange ranges: Hue 0-25 and 160-180
mask1 = cv2.inRange(hsv, np.array([0, 50, 50]), np.array([25, 255, 255]))
mask2 = cv2.inRange(hsv, np.array([160, 50, 50]), np.array([180, 255, 255]))
seafood_mask = cv2.bitwise_or(mask1, mask2)

pts = cv2.findNonZero(seafood_mask)
if pts is not None:
    sx, sy, sw, sh = cv2.boundingRect(pts)
    print(f"Seafood/ceviche bounding box: X=[{sx}:{sx+sw}], Y=[{sy}:{sy+sh}]")
    print(f"Ceviche top: {sy} ({sy/h*100:.1f}%), bottom: {sy+sh} ({(sy+sh)/h*100:.1f}%), center Y: {sy+sh//2} ({(sy+sh//2)/h*100:.1f}%)")
    print(f"Ceviche left: {sx} ({sx/w*100:.1f}%), right: {sx+sw} ({(sx+sw)/w*100:.1f}%), center X: {sx+sw//2} ({(sx+sw//2)/w*100:.1f}%)")

