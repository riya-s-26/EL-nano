from PIL import Image
import numpy as np
import os

def diff(im1_path, im2_path):
    im1 = Image.open(im1_path).convert('RGB').resize((100, 100))
    im2 = Image.open(im2_path).convert('RGB').resize((100, 100))
    return np.mean(np.abs(np.array(im1, dtype=float) - np.array(im2, dtype=float)))

print("Hero comparison:")
print("  vs SIN PERSONAS:", diff('scratch/mockup_hero_crop.jpg', 'assets/img/pics from clients/SIN PERSONAS.png'))
print("  vs visit-venue:", diff('scratch/mockup_hero_crop.jpg', 'assets/img/visit/visit-venue.jpg'))
print("  vs venue-dining:", diff('scratch/mockup_hero_crop.jpg', 'assets/img/atmosphere/venue-dining.jpg'))

print("\nGallery Card 1 (Storefront) comparison:")
print("  vs night.png:", diff('scratch/gal_card1_mockup.jpg', 'assets/img/pics from clients/night.png'))

print("\nGallery Card 2 (Ceviche) comparison:")
print("  vs ceviche.jpg:", diff('scratch/gal_card2_mockup.jpg', 'assets/img/ceviche.jpg'))
for c in ['assets/img/pics from clients/Ceviche Mixto.jpeg', 'assets/img/pics from clients/Ceviche jipijapa.png', 'assets/img/elnano client drive pics/DELICIOSOS CEVICHES/JPG/Ceviche pescado.jpg']:
    if os.path.exists(c):
        print(f"  vs {c}:", diff('scratch/gal_card2_mockup.jpg', c))

print("\nGallery Card 3 (Interior) comparison:")
print("  vs visit-venue:", diff('scratch/gal_card3_mockup.jpg', 'assets/img/visit/visit-venue.jpg'))
print("  vs venue-dining:", diff('scratch/gal_card3_mockup.jpg', 'assets/img/atmosphere/venue-dining.jpg'))
print("  vs SIN PERSONAS:", diff('scratch/gal_card3_mockup.jpg', 'assets/img/pics from clients/SIN PERSONAS.png'))

print("\nGallery Card 4 (Cocktails) comparison:")
print("  vs exp-cocktails.jpg:", diff('scratch/gal_card4_mockup.jpg', 'assets/img/experiences/exp-cocktails.jpg'))
