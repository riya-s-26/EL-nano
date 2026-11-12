import cv2
import numpy as np

user_crop = cv2.imread('scratch/user_dish_crop.jpg')
full = cv2.imread('assets/img/pics from clients/Caldo de Bola.png')

# Let's inspect where the brown bowl is in full vs user_crop:
print("Full shape:", full.shape)
print("User crop shape:", user_crop.shape)

# Let's see: in user_crop, the bowl is zoomed in.
# Let's print ASCII of user_crop:
small = cv2.resize(user_crop, (60, 30))
small_gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
chars = " .:-=+*#%@"
print("--- User crop ASCII ---")
for y in range(30):
    line = "".join(chars[small_gray[y, x] * (len(chars)-1) // 255] for x in range(60))
    print(line)

