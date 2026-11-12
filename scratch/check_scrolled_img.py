from PIL import Image

im = Image.open('scratch/full_viewport_scrolled.jpg')
print("Image size:", im.size)
# Sample pixel at top left, center, bottom right
print("(50, 50):", im.getpixel((50, 50)))
print("(w//2, h//2):", im.getpixel((im.width//2, im.height//2)))

