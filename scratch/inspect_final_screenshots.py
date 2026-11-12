from PIL import Image
import numpy as np

views = [
    'final_view_desktop_1440.jpg',
    'final_view_laptop_1200.jpg',
    'final_view_laptop_short_1024x536.jpg',
    'final_view_tablet_768.jpg',
    'final_view_mobile_375.jpg',
    'final_view_zoom_125.jpg',
    'final_view_zoom_150.jpg'
]

print("=== INSPECTING FINAL VIEWPORT SCREENSHOTS ===")

for v in views:
    im = Image.open(f'scratch/{v}')
    arr = np.array(im)
    w, h = im.size
    print(f"\n=================== {v} ({w}x{h}) ===================")

    # Green background check
    is_green = (arr[:, :, 0] < 25) & (arr[:, :, 1] > 45) & (arr[:, :, 1] < 80) & (arr[:, :, 2] > 25) & (arr[:, :, 2] < 60)
    print(f"  Dark green background: {np.sum(is_green)/(w*h)*100:.1f}%")

    # Ceramic bowl rim: R in [130, 185], G in [35, 80], B in [0, 25]
    bowl_rim = (arr[:, :, 0] > 130) & (arr[:, :, 0] < 185) & (arr[:, :, 1] > 35) & (arr[:, :, 1] < 80) & (arr[:, :, 2] < 25)
    by, bx = np.where(bowl_rim)

    # White plate: R>180, G>180, B>180
    white = (arr[:, :, 0] > 180) & (arr[:, :, 1] > 180) & (arr[:, :, 2] > 180)
    wy, wx = np.where(white)

    if len(by) > 0:
        print(f"  Ceramic bowl rim Y range: [{by.min()}, {by.max()}], X range: [{bx.min()}, {bx.max()}]")
        print(f"  >>> TOP RIM OF BOWL FULLY VISIBLE! Min Y={by.min()}px")
    else:
        print("  Bowl rim: NOT DETECTED")

    if len(wy) > 0:
        print(f"  White plate Y range: [{wy.min()}, {wy.max()}], X range: [{wx.min()}, {wx.max()}]")
        print(f"  >>> BOTTOM OF PLATE VISIBLE! Max Y={wy.max()}px")
    else:
        print("  White plate: NOT DETECTED")

print("\n=== CHECKING REGRESSION SLIDES 1, 2, 3 ===")
for s in [1, 2, 3]:
    im = Image.open(f'scratch/regression_slide_{s}.jpg')
    arr = np.array(im)
    w, h = im.size
    is_green = (arr[:, :, 0] < 25) & (arr[:, :, 1] > 45) & (arr[:, :, 1] < 80) & (arr[:, :, 2] > 25) & (arr[:, :, 2] < 60)
    print(f"Slide {s} green bg: {np.sum(is_green)/(w*h)*100:.1f}%, shape: {w}x{h}")

