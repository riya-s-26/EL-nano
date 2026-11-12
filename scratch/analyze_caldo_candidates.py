from PIL import Image
import numpy as np
import glob
import os

images = sorted(glob.glob('scratch/caldo_*.jpg'))

for img_path in images:
    im = Image.open(img_path)
    arr = np.array(im)
    w, h = im.size
    
    # In each slide capture:
    # Left side is text (dark green background R<10, G<70, B<50)
    # Right side is the dish container
    # Let's find the dish container bounding box:
    # pixels where color is NOT dark green background
    is_shot = ~((arr[:, :, 0] < 20) & (arr[:, :, 1] < 70) & (arr[:, :, 2] < 50))
    # only look at right half
    is_shot[:, :w//3] = False
    sy, sx = np.where(is_shot)
    if len(sy) == 0:
        continue
    shot_top, shot_bottom = sy.min(), sy.max()
    shot_left, shot_right = sx.min(), sx.max()
    shot_w = shot_right - shot_left
    shot_h = shot_bottom - shot_top
    
    shot_crop = arr[shot_top:shot_bottom, shot_left:shot_right]
    
    # Find ceramic bowl top rim:
    # At vertical slice at middle of shot (x = shot_w // 2):
    # Scan from top (y=0) downward:
    # The table above the bowl rim is wood: R~180-210, G~130-160, B~80-120
    # The ceramic bowl rim is darker brown/red: R~140-170, G~40-75, B~0-20
    # Top of bowl rim is where G drops below 90 or R/G > 2.0
    bowl_top_y = None
    for y in range(0, shot_h):
        r, g, b = shot_crop[y, shot_w // 2][:3]
        if r > 120 and g < 90 and b < 40 and (r > g * 1.8):
            bowl_top_y = y
            break
            
    # Find plate bottom:
    # White plate: R>180, G>180, B>180
    white = (shot_crop[:, :, 0] > 180) & (shot_crop[:, :, 1] > 180) & (shot_crop[:, :, 2] > 180)
    wy, wx = np.where(white)
    plate_bottom_y = wy.max() if len(wy) > 0 else None
    
    print(f"=== {os.path.basename(img_path)} ===")
    print(f"  Container size: {shot_w}x{shot_h}")
    if bowl_top_y is not None:
        print(f"  Bowl top rim Y inside container: {bowl_top_y}px (Headroom: {bowl_top_y}px)")
    else:
        print(f"  Bowl top rim: CUT OFF at top (y=0 is already inside bowl!)")
    if plate_bottom_y is not None:
        margin_bottom = shot_h - 1 - plate_bottom_y
        print(f"  Plate bottom Y inside container: {plate_bottom_y}px (Bottom margin: {margin_bottom}px)")
    else:
        print(f"  Plate bottom: NOT FOUND")

