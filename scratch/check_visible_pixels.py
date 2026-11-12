from PIL import Image

im = Image.open('scratch/caldo_force_visible.jpg')
print("Image size:", im.size)
# Sample pixel at right side where the soup bowl is: (x = 700, y = 174)
print("Pixel at (700, 174):", im.getpixel((700, 174)))

