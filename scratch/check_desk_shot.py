from PIL import Image

im = Image.open('scratch/view_desktop_1440.jpg')
print("view_desktop_1440 size:", im.size)
# Sample points across the image
for y in range(100, 900, 100):
    print(f"y={y}:", im.getpixel((1000, y)))

