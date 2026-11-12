from PIL import Image
import numpy as np
import glob
import os

images = sorted(glob.glob('scratch/preview_*.jpg'))

for img_path in images:
    im = Image.open(img_path)
    arr = np.array(im)
    w, h = im.size
    
    # In each screenshot:
    # Find the dish container:
    # background is dark green (R < 25, G < 75, B < 55)
    # the container has the wooden table / food / plate
    is_shot = ~((arr[:, :, 0] < 25) & (arr[:, :, 1] < 75) & (arr[:, :, 2] < 55))
    is_shot[:, :w//3] = False # ignore left column text
    
    sy, sx = np.where(is_shot)
    if len(sy) == 0:
        print(f"=== {os.path.basename(img_path)}: NOT FOUND ===")
        continue
    top, bottom = sy.min(), sy.max()
    left, right = sx.min(), sx.max()
    cw, ch = right - left, bottom - top
    
    crop = arr[top:bottom, left:right]
    
    # Find ceramic bowl rim along vertical line in middle of container:
    # Table wood above bowl: R in [180, 215], G in [120, 165], B in [70, 120]
    # Ceramic bowl top rim: R in [140, 185], G in [35, 80], B in [0, 25]
    bowl_top_margin = None
    for y in range(0, ch):
        r, g, b = crop[y, cw // 2][:3]
        if r > 130 and g < 80 and b < 30:
            bowl_top_margin = y
            break
            
    # Find plate bottom (white plate: R>180, G>180, B>180)
    white = (crop[:, :, 0] > 180) & (crop[:, :, 1] > 180) & (crop[:, :, 2] > 180)
    wy, wx = np.where(white)
    plate_bottom_margin = None
    if len(wy) > 0:
        plate_bottom_margin = ch - 1 - wy.max()
        
    print(f"=== {os.path.basename(img_path)} (box {cw}x{ch}) ===")
    if bowl_top_margin is not None:
        print(f"  Bowl top rim headroom: {bowl_top_margin}px")
    else:
        print(f"  Bowl top rim: CUT OFF AT TOP!")
    if plate_bottom_margin is not None:
        print(f"  Plate bottom margin: {plate_bottom_margin}px (white plate at y={wy.max()})")
    else:
        print(f"  Plate bottom: NOT FOUND")

