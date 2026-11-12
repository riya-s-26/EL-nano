from PIL import Image

img2_path = r'C:\Users\riyas\.gemini\antigravity\brain\6d96b463-02d5-4dff-8c08-6d061cb29be8\.user_uploaded\media_1794485270489_be577a56.jpg'
im2 = Image.open(img2_path)

# Crop the top half (from y=0 to y=450) where the text and opening hours table are
crop_top = im2.crop((0, 0, im2.width, int(im2.height * 0.65)))
crop_top.save(r'C:\Users\riyas\.gemini\antigravity\brain\6d96b463-02d5-4dff-8c08-6d061cb29be8\image2_top_crop.jpg')
print("Saved image2_top_crop.jpg")

