from PIL import Image

im = Image.open('assets/img/pics from clients/Ceviche Mixto.jpeg')
w, h = im.size

# Let's inspect along the vertical centerline x = w // 2 = 561
# print pixel colors from y=0 to y=h step 20
print("Y pos | RGB color at x=561")
for y in range(0, h, 30):
    r, g, b = im.getpixel((w // 2, y))
    print(f"{y:4d} ({y/h*100:4.1f}%) | R:{r:3d} G:{g:3d} B:{b:3d}")

