from PIL import Image
import numpy as np

def diff(im1_path, im2_path):
    im1 = Image.open(im1_path).convert('RGB').resize((100, 100))
    im2 = Image.open(im2_path).convert('RGB').resize((100, 100))
    return np.mean(np.abs(np.array(im1, dtype=float) - np.array(im2, dtype=float)))

for p in [
    'assets/img/ceviche.jpg',
    'assets/img/food/dish-ceviche.jpg',
    'assets/img/pics from clients/Ceviche Mixto.jpeg',
    'assets/img/pics from clients/Ceviche mix.png',
    'assets/img/elnano client drive pics/DELICIOSOS CEVICHES/JPG/Ceviche mixto (1).jpg',
    'assets/img/elnano client drive pics/DELICIOSOS CEVICHES/JPG/Ceviche gambas.jpg'
]:
    print(p, ":", diff('scratch/gal_card2_mockup.jpg', p))

