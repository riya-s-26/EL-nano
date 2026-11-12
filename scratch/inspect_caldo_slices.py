from PIL import Image
import numpy as np

for name in ['crop_inspect_pos_35.jpg', 'crop_inspect_pos_40.jpg', 'crop_inspect_desktop_pos_35.jpg']:
    p = f'scratch/{name}'
    im = Image.open(p)
    arr = np.array(im)
    w, h = im.size
    print(f"\n=================== {name} ({w}x{h}) ===================")
    # Check vertical center line
    cx = w // 2
    # Find container top edge (first pixel that is not dark green background)
    # Dark green: R<25, G<75, B<55
    is_shot = ~((arr[:, cx, 0] < 25) & (arr[:, cx, 1] < 75) & (arr[:, cx, 2] < 55))
    sy = np.where(is_shot)[0]
    if len(sy) == 0:
        print("Shot container not found on center line")
        continue
    top_edge, bottom_edge = sy.min(), sy.max()
    shot_height = bottom_edge - top_edge
    print(f"Container top edge: y={top_edge}, bottom edge: y={bottom_edge} (height={shot_height}px)")
    
    # Inside the container (y from top_edge to bottom_edge):
    # What are the colors?
    # Where is the wooden table?
    # Where is the ceramic bowl top rim?
    # Where is the soup?
    # Where is the white plate?
    # Where is the wooden table at the bottom?
    
    # Let's inspect rows every 10px inside container
    for y in range(top_edge, bottom_edge + 1, 15):
        r, g, b = arr[y, cx][:3]
        desc = ""
        if r > 180 and g > 120 and b > 70 and abs(r - g) < 70 and abs(g - b) < 70:
            desc = "WOODEN TABLE"
        elif r > 180 and g > 180 and b > 180:
            desc = "WHITE PLATE"
        elif r > 120 and g < 90 and b < 30:
            desc = "BOWL RIM (BROWN)"
        elif r > 180 and g > 140 and b < 80:
            desc = "CORN / SOUP INGREDIENT"
        elif r > 120 and g > 50 and b < 30:
            desc = "SOUP BROTH / MEAT"
        print(f"  y={y:3d} (rel {y - top_edge:3d}px): ({r:3d}, {g:3d}, {b:3d}) -> {desc}")

