from PIL import Image
import numpy as np

im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
w, h = im.size
arr = np.array(im)

# Let's find the bowl rim (brown ceramic bowl)
# Brown rim: R: 100-180, G: 60-120, B: 30-80
bowl_mask = (arr[:, :, 0] > 90) & (arr[:, :, 0] < 180) & (arr[:, :, 1] > 50) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 20) & (arr[:, :, 2] < 80)
by, bx = np.where(bowl_mask)
print(f"Bowl bounds: Y=[{by.min()}:{by.max()}], X=[{bx.min()}:{bx.max()}]")
print(f"Bowl Center: X={bx.mean():.1f} ({bx.mean()/w*100:.1f}%), Y={by.mean():.1f} ({by.mean()/h*100:.1f}%)")

# White plate:
white_mask = (arr[:, :, 0] > 215) & (arr[:, :, 1] > 215) & (arr[:, :, 2] > 215)
py, px = np.where(white_mask)
print(f"Plate bounds: Y=[{py.min()}:{py.max()}], X=[{px.min()}:{px.max()}]")
print(f"Plate Center: X={px.mean():.1f} ({px.mean()/w*100:.1f}%), Y={py.mean():.1f} ({py.mean()/h*100:.1f}%)")

# Together (Bowl + Plate):
dish_mask = bowl_mask | white_mask
dy, dx = np.where(dish_mask)
print(f"Combined Dish bounds: Y=[{dy.min()}:{dy.max()}], X=[{dx.min()}:{dx.max()}]")
print(f"Dish Dimensions: Width={dx.max()-dx.min()}px ({((dx.max()-dx.min())/w)*100:.1f}%), Height={dy.max()-dy.min()}px ({((dy.max()-dy.min())/h)*100:.1f}%)")
print(f"Dish Center: X={(dx.min()+dx.max())//2} ({((dx.min()+dx.max())/2/w)*100:.1f}%), Y={(dy.min()+dy.max())//2} ({((dy.min()+dy.max())/2/h)*100:.1f}%)")

