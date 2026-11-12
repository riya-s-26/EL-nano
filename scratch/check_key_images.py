from PIL import Image

for path, out in [
    ('assets/img/pics from clients/night.png', 'scratch/check_night.jpg'),
    ('assets/img/ceviche.jpg', 'scratch/check_ceviche.jpg'),
    ('assets/img/atmosphere/venue-dining.jpg', 'scratch/check_venue_dining.jpg'),
    ('assets/img/visit/visit-venue.jpg', 'scratch/check_visit_venue.jpg'),
    ('assets/img/experiences/exp-cocktails.jpg', 'scratch/check_cocktails.jpg'),
    ('assets/img/pics from clients/SIN PERSONAS.png', 'scratch/check_sin_personas.jpg')
]:
    im = Image.open(path)
    im.resize((300, 200)).save(out)
    print(f"{path}: size={im.size}")

