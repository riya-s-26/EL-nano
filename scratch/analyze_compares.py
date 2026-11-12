from PIL import Image
import numpy as np

for name in ['compare_desk_35.jpg', 'compare_desk_35_taller.jpg', 'compare_lap_35.jpg', 'compare_lap_35_taller.jpg']:
    p = f'scratch/{name}'
    im = Image.open(p)
    arr = np.array(im)
    w, h = im.size
    print(f"\n=== {name} ({w}x{h}) ===")
    
    # find non-dark-green container
    is_shot = ~((arr[:, :, 0] < 25) & (arr[:, :, 1] < 75) & (arr[:, :, 2] < 55))
    sy, sx = np.where(is_shot)
    if len(sy) == 0:
        print("Not found")
        continue
    top, bottom = sy.min(), sy.max()
    left, right = sx.min(), sx.max()
    cw, ch = right - left, bottom - top
    print(f"Container: {cw}x{ch}")
    
    crop = arr[top:bottom, left:right]
    # Check top row of container (y = 0 in crop): is it table or bowl?
    print(f"Top row at cx: {crop[0, cw//2]}")
    # Find bowl top rim:
    bowl_top = None
    for y in range(0, ch):
        r, g, b = crop[y, cw//2][:3]
        if r > 130 and g < 80 and b < 30:
            bowl_top = y
            break
    print(f"Bowl top rim rel to container top: {bowl_top}px")
    
    # Check bottom row of container (y = ch-1 in crop): is it plate, table, or what?
    print(f"Bottom row at cx: {crop[ch-1, cw//2]}")
    # Find plate bottom:
    white = (crop[:, :, 0] > 180) & (crop[:, :, 1] > 180) & (crop[:, :, 2] > 180)
    wy, wx = np.where(white)
    if len(wy) > 0:
        print(f"White plate bounds in container: Y=[{wy.min()}, {wy.max()}], margin to bottom: {ch - 1 - wy.max()}px")
    else:
        print("White plate not found")

