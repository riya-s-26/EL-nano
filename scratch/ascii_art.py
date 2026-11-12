from PIL import Image

im = Image.open('assets/img/pics from clients/Ceviche Mixto.jpeg')
# Let's resize to 60x60 and print an ASCII grayscale view of the image
small = im.convert('L').resize((80, 40))
chars = " .:-=+*#%@"
for y in range(40):
    line = "".join(chars[small.getpixel((x, y)) * (len(chars)-1) // 255] for x in range(80))
    print(line)

