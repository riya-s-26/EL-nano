from PIL import Image
import numpy as np

for pos in ['50', '58', '60', '65']:
    f = f'scratch/active_caldo_center_{pos}_.jpg'
    im = Image.open(f)
    arr = np.array(im)
    h, w, _ = arr.shape
    # White plate:
    white_mask = (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)
    # Check bottom 20% of image:
    bottom_white = np.sum(white_mask[int(h*0.8):, :])
    # Check top 10% of image: is wood table visible above bowl?
    # Brown bowl rim: R: 100-180, G: 60-120, B: 30-80
    bowl_mask = (arr[:, :, 0] > 90) & (arr[:, :, 0] < 180) & (arr[:, :, 1] > 50) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 20) & (arr[:, :, 2] < 80)
    top_bowl_px = np.sum(bowl_mask[:int(h*0.08), :])
    # White plate bottom-most row:
    y_white, _ = np.where(white_mask)
    max_white_y = y_white.max() if len(y_white) > 0 else 0
    print(f"Pos center {pos}%: Bottom White px={bottom_white:5d}, max white Y={max_white_y}/{h} ({max_white_y/h*100:.1f}%), Top bowl px={top_bowl_px:5d}")

