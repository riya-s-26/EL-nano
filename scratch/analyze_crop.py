from PIL import Image

img_path = r'assets/img/pics from clients/Ceviche Mixto.jpeg'
im = Image.open(img_path)
w, h = im.size

# Let's check vertical slices: 0-20%, 20-40%, 40-60%, 60-80%, 80-100%
# In aspect ratio 16:10, if width is 1122, height displayed is 1122 * 10 / 16 = 701px.
# This means 1122 - 701 = 421px will be cropped vertically if object-fit is cover.
# Where should the 701px window be placed along the 1122px height?
# If object-position: center center (50%): window is [210px : 911px].
# If object-position: center 40%: window is [100px : 801px].
# If object-position: center 60%: window is [320px : 1021px].

print(f"Total height: {h}, Displayed height in 16:10: {int(w * 10 / 16)}")
crop_h = int(w * 10 / 16)
for pct in [30, 40, 50, 60, 70]:
    top = int((h - crop_h) * (pct / 100))
    bottom = top + crop_h
    print(f"At object-position center {pct}%: crop window Y is [{top} : {bottom}] (covers {top/h*100:.1f}% to {bottom/h*100:.1f}%)")

