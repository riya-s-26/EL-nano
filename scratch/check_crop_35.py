from PIL import Image

im = Image.open('scratch/caldo_user_shot_1024x536_pos_35_default.jpg')
print("Image size:", im.size)

# In 1024x536 viewport:
# Where is .dish-shot?
# In our earlier measurement: shot was at x=536, y in slide, width=422, height=348
# Let's crop x in [500: 980], y in [0: im.height]
crop = im.crop((500, 0, min(1000, im.width), im.height))
crop.save('scratch/crop_test_pos_35.jpg')
print("Saved scratch/crop_test_pos_35.jpg, size:", crop.size)

