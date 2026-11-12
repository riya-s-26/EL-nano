from PIL import Image

im = Image.open('assets/img/pics from clients/Caldo de Bola.png')
w, h = im.size # 1024 x 1536

# In desktop pinned mode, .dish-shot is roughly 4:3 or 1.1:1 (e.g. 550w x 480h)
# Let's test with aspect ratios:
# 1) 4:3 (w=550, h=412 -> scale = 550/1024 = 0.537 -> displayed height = 1536 * 0.537 = 825px in 412px box, visible h is 412/0.537 = 767px of original 1536px)
# 2) 1:1 (visible h is 1024px of original 1536px)

target_ar_list = [
    ('4_3', 4/3),
    ('square', 1.0),
    ('16_10', 16/10)
]

# For an aspect ratio AR, container is W / H = AR.
# With object-fit: cover, since image AR is 1024/1536 = 0.667 < AR:
# The image fills width (1024px).
# The visible height in original image coordinates is 1024 / AR.
# Let posX, posY be object-position percentages (0.0 to 1.0).
# Visible window X is [0 : 1024].
# Visible window Y has height vis_h = 1024 / AR.
# y_start = (1536 - vis_h) * posY.

positions = [
    ('center_50', 0.5, 0.5),
    ('center_55', 0.5, 0.55),
    ('center_60', 0.5, 0.60),
    ('pos_40_55', 0.4, 0.55),
    ('pos_35_60', 0.35, 0.60),
    ('pos_40_65', 0.4, 0.65),
]

for ar_name, ar in target_ar_list:
    vis_h = int(w / ar)
    vis_w = w
    for pos_name, px, py in positions:
        if vis_h <= h:
            y_start = int((h - vis_h) * py)
            x_start = 0
            crop_box = (0, y_start, w, y_start + vis_h)
            cropped = im.crop(crop_box)
            cropped.resize((400, int(400 / ar))).save(f'scratch/sim_{ar_name}_{pos_name}.jpg', quality=85)

print("Simulations saved to scratch/")

