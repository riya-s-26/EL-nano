from PIL import Image
import numpy as np

views = [
    'view_desktop_1440.jpg',
    'view_laptop_1200.jpg',
    'view_laptop_short_1024x536.jpg',
    'view_tablet_768.jpg',
    'view_mobile_375.jpg',
    'view_zoom_125.jpg',
    'view_zoom_150.jpg'
]

print("=== INSPECTING VIEWPORT SCREENSHOTS ===")

for v in views:
    im = Image.open(f'scratch/{v}')
    arr = np.array(im)
    w, h = im.size
    print(f"\n=================== {v} ({w}x{h}) ===================")
    
    # Check if dark green background exists (R in [0, 25], G in [45, 80], B in [25, 60])
    is_green = (arr[:, :, 0] < 25) & (arr[:, :, 1] > 45) & (arr[:, :, 1] < 80) & (arr[:, :, 2] > 25) & (arr[:, :, 2] < 60)
    print(f"  Dark green background pixels: {np.sum(is_green)} ({np.sum(is_green)/(w*h)*100:.1f}%)")
    
    # Find the dish container:
    # inside the view, the dish photograph is non-green and non-yellow
    # Let's find white plate: R>180, G>180, B>180
    white = (arr[:, :, 0] > 180) & (arr[:, :, 1] > 180) & (arr[:, :, 2] > 180)
    wy, wx = np.where(white)
    
    # Ceramic brown bowl rim: R in [130, 185], G in [35, 80], B in [0, 25]
    bowl_rim = (arr[:, :, 0] > 130) & (arr[:, :, 0] < 185) & (arr[:, :, 1] > 35) & (arr[:, :, 1] < 80) & (arr[:, :, 2] < 25)
    by, bx = np.where(bowl_rim)
    
    if len(by) > 0:
        print(f"  Ceramic bowl rim Y range: [{by.min()}, {by.max()}], X range: [{bx.min()}, {bx.max()}]")
        print(f"  TOP OF BOWL IS VISIBLE! (Min Y = {by.min()}px from top of viewport)")
    else:
        print("  Bowl rim: NOT DETECTED")
        
    if len(wy) > 0:
        print(f"  White plate Y range: [{wy.min()}, {wy.max()}], X range: [{wx.min()}, {wx.max()}]")
        print(f"  BOTTOM OF PLATE IS VISIBLE! (Max Y = {wy.max()}px in viewport)")
    else:
        print("  White plate: NOT DETECTED")

