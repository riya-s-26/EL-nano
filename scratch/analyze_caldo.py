from PIL import Image

im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
w, h = im.size
print(f"Image dimensions: {w}x{h}")

# Let's inspect vertical pixels to find the plate and bowl
# The user's screenshot shows:
# A brown earthenware bowl on a white plate, placed on a light wooden table.
# Inside the bowl is the soup with meat, corn, and broth.
# In the user's uploaded screenshot:
# Notice that the left side of the white plate and the bottom of the plate are cut off.
# Let's see what is inside the full original image!

# Let's resize and print ASCII or check borders
small = im.convert('L').resize((80, 50))
chars = " .:-=+*#%@"
for y in range(50):
    line = "".join(chars[small.getpixel((x, y)) * (len(chars)-1) // 255] for x in range(80))
    print(line)

