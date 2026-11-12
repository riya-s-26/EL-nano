from PIL import Image

screenshot_path = r'C:/Users/Admin/.gemini/antigravity/brain/e38ac0c0-7b15-41d8-a583-dcc562d3f6f9/.user_uploaded/media_1793279512434_d8c41e40.jpg'
im = Image.open(screenshot_path)
# Crop right half where dish-shot is
w, h = im.size
right_half = im.crop((int(w * 0.5), int(h * 0.1), int(w * 0.98), int(h * 0.85)))
right_half.save('scratch/user_dish_crop.jpg')
print(f"Saved right half: {right_half.size}")

# Now let's compare with the original full photo assets/img/pics from clients/Caldo de Bola.png:
full_im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
print(f"Original image size: {full_im.size}")

