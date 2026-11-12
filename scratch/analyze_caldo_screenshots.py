from PIL import Image
import numpy as np
import glob

files = glob.glob('scratch/caldo_shot_*.jpg')
for f in sorted(files):
    im = Image.open(f)
    arr = np.array(im)
    h, w, _ = arr.shape
    # Count white pixels (white plate)
    white_mask = (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)
    white_count = np.sum(white_mask)
    # Check bottom 10% row: how much white plate is visible near the bottom?
    bottom_white = np.sum(white_mask[int(h*0.85):, :])
    # Check top 10% row: is bowl cut off at top?
    # Brown bowl rim: R: 100-180, G: 60-120, B: 30-80
    bowl_mask = (arr[:, :, 0] > 90) & (arr[:, :, 0] < 180) & (arr[:, :, 1] > 50) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 20) & (arr[:, :, 2] < 80)
    top_bowl = np.sum(bowl_mask[:int(h*0.1), :])
    print(f"{f}: Total White Plate px={white_count:5d}, Bottom White Plate px={bottom_white:5d}, Top Bowl px={top_bowl:5d}")

