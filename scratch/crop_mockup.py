from PIL import Image
import numpy as np

# Load the user's reference mockup
mockup = Image.open('C:/Users/Admin/.gemini/antigravity/brain/e38ac0c0-7b15-41d8-a583-dcc562d3f6f9/.user_uploaded/media_1793444033566_8285367a.jpg')
print("Mockup size:", mockup.size)

# The mockup height is 1144, width is 1000
# Let's crop:
# 1. Hero image area: top right
# 2. Four gallery images: around y ~ 650 to 800
w, h = mockup.size
hero_crop = mockup.crop((int(w * 0.4), int(h * 0.05), w, int(h * 0.25)))
hero_crop.save('scratch/mockup_hero_crop.jpg')

# Gallery crop
gallery_crop = mockup.crop((int(w * 0.02), int(h * 0.65), int(w * 0.98), int(h * 0.82)))
gallery_crop.save('scratch/mockup_gallery_crop.jpg')

# Quick links crop
links_crop = mockup.crop((int(w * 0.02), int(h * 0.82), int(w * 0.98), int(h * 0.93)))
links_crop.save('scratch/mockup_links_crop.jpg')

# Cards crop
cards_crop = mockup.crop((int(w * 0.02), int(h * 0.24), int(w * 0.98), int(h * 0.43)))
cards_crop.save('scratch/mockup_cards_crop.jpg')

# Location crop
loc_crop = mockup.crop((int(w * 0.02), int(h * 0.43), int(w * 0.98), int(h * 0.65)))
loc_crop.save('scratch/mockup_loc_crop.jpg')

print("Saved mockup crops to scratch/")

