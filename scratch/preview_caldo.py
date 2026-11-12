from PIL import Image

im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
w, h = im.size
# Let's save a smaller preview of the entire image to scratch
preview = im.resize((w // 2, h // 2))
preview.save('scratch/caldo_full_preview.jpg', quality=85)
print(f"Full image preview saved: {w//2}x{h//2}")

# Let's inspect where the spoon is and where the table is
# In the original image:
# width is 1024, height is 1536

