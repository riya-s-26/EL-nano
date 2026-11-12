from PIL import Image

im = Image.open('scratch/test_mobile_default_4_3_pos35.jpg')
print("Mobile image size:", im.size)
# The image container on mobile is around Y = 400 to 950
im.crop((0, 400, im.width, im.height)).save('scratch/mobile_shot_crop.jpg')
print("Saved scratch/mobile_shot_crop.jpg")

