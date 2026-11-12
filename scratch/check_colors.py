from PIL import Image

for name in ["bbb907594ff7f9c5a7effd194b2bca0c.webp", "7ef610edc1e0747b0d9f9a15b30001b0.webp", "9b3cc2d6a5f9ca7e255a2e4ac82894e6.webp"]:
    p = f"scratch/mcy_images/{name}"
    im = Image.open(p)
    print(name, im.size, im.mode)
    # Check bounding box / colors
    colors = im.getcolors(maxcolors=2000)
    print(f"  Unique colors count: {len(colors) if colors else '>2000'}")

