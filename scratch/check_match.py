from PIL import Image
import numpy as np

sin = Image.open('assets/img/pics from clients/SIN PERSONAS.png')
print("SIN PERSONAS size:", sin.size)
# Compare top-right corner or resized similarity
sin_thumb = sin.resize((300, 200))
sin_thumb.save('scratch/sin_thumb.jpg')

night = Image.open('assets/img/pics from clients/night.png')
print("night size:", night.size)
night_thumb = night.resize((300, 200))
night_thumb.save('scratch/night_thumb.jpg')

el_bar = Image.open('assets/img/pics from clients/EL BAR.png')
print("EL BAR size:", el_bar.size)
el_bar_thumb = el_bar.resize((300, 200))
el_bar_thumb.save('scratch/el_bar_thumb.jpg')

venue_dining = Image.open('assets/img/atmosphere/venue-dining.jpg')
venue_dining_thumb = venue_dining.resize((300, 200))
venue_dining_thumb.save('scratch/venue_dining_thumb.jpg')

print("Saved thumbnails to scratch/")

