from PIL import Image
import numpy as np

for name in ['test_mobile_default_4_3_pos35.jpg', 'test_mobile_square_pos35.jpg', 'test_mobile_5_4_pos35.jpg']:
    p = f'scratch/{name}'
    im = Image.open(p)
    arr = np.array(im)
    w, h = im.size
    print(f"\n=== {name} ({w}x{h}) ===")
    
    # find container
    is_shot = ~((arr[:, :, 0] < 25) & (arr[:, :, 1] < 75) & (arr[:, :, 2] < 55))
    sy, sx = np.where(is_shot)
    if len(sy) == 0:
        continue
    top, bottom = sy.min(), sy.max()
    left, right = sx.min(), sx.max()
    cw, ch = right - left, bottom - top
    print(f"Container: {cw}x{ch} (AR: {cw/ch:.3f})")
    
    crop = arr[top:bottom, left:right]
    # Check top row:
    print(f"Top row at cx: {crop[0, cw//2]}")
    # Find bowl top rim:
    bowl_top = None
    for y in range(0, ch):
        r, g, b = crop[y, cw//2][:3]
        if r > 130 and g < 80 and b < 30:
            bowl_top = y
            break
    print(f"Bowl top rim rel to container top: {bowl_top}px")
    
    # Find plate bottom:
    white = (crop[:, :, 0] > 180) & (crop[:, :, 1] > 180) & (crop[:, :, 2] > 180)
    wy, wx = np.where(white)
    if len(wy) > 0:
        margin_bottom = ch - 1 - wy.max()
        print(f"White plate bounds: Y=[{wy.min()}, {wy.max()}], margin to bottom: {margin_bottom}px")
    else:
        print("White plate not found")

