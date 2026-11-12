from PIL import Image

# Let's crop just the dish image area from:
# 1. preview_laptop_1024x536_pos_35.jpg
# 2. preview_laptop_1024x536_pos_35_ar1.jpg
# 3. preview_desktop_1440x900_pos_35.jpg

# In 1024x536:
# Left column text ends around x=500.
# The dish-shot is roughly x in [535, 960], y in [90, 440]
im1 = Image.open('scratch/preview_laptop_1024x536_pos_35.jpg')
im1.crop((520, 80, 980, 450)).save('scratch/crop_inspect_pos_35.jpg')

im2 = Image.open('scratch/preview_laptop_1024x536_pos_40.jpg')
im2.crop((520, 80, 980, 450)).save('scratch/crop_inspect_pos_40.jpg')

im3 = Image.open('scratch/preview_desktop_1440x900_pos_35.jpg')
im3.crop((750, 150, 1380, 750)).save('scratch/crop_inspect_desktop_pos_35.jpg')

print("Saved crop_inspect_pos_35.jpg, crop_inspect_pos_40.jpg, crop_inspect_desktop_pos_35.jpg")

