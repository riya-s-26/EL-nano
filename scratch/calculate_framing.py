# Caldo de Bola exact image geometry:
# Natural width = 1024, height = 1536
# White plate: Y in [309, 1251], X in [6, 988]
# Bowl top rim: Y = 345
# Bowl bottom: Y = 1045
# Plate bottom: Y = 1251
# Plate top: Y = 309

viewports = [
    ("Desktop 1440x900", 596, 585),
    ("Laptop 1200x800", 495, 520),
    ("Laptop 1024x768", 422, 499),
    ("Client Shot 1024x536", 422, 348),
    ("Tablet 768x1024 (4/3)", 676, 507),
    ("Mobile 375x667 (4/3)", 335, 251)
]

candidates = [0.30, 0.35, 0.38, 0.40, 0.42, 0.45]

print("=== CALDO DE BOLA FRAMING ANALYSIS ===")
for vp_name, bw, bh in viewports:
    print(f"\n--- {vp_name} (Container: {bw}x{bh}, AR: {bw/bh:.3f}) ---")
    # with object-fit: cover
    # scale factor:
    s = max(bw / 1024, bh / 1536)
    scaled_w = 1024 * s
    scaled_h = 1536 * s
    # in image coordinates, visible box size:
    vis_w = bw / s
    vis_h = bh / s
    unseen_x = 1024 - vis_w
    unseen_y = 1536 - vis_h
    
    for pos_y in candidates:
        y_start = unseen_y * pos_y
        y_end = y_start + vis_h
        
        # Margins in image coordinates:
        bowl_rim_headroom_img = 345 - y_start
        plate_bottom_margin_img = y_end - 1251
        
        # Margins in screen pixels:
        bowl_headroom_px = bowl_rim_headroom_img * s
        plate_bottom_px = plate_bottom_margin_img * s
        
        bowl_ok = "YES" if bowl_headroom_px >= 0 else "CUT OFF"
        plate_ok = "YES" if plate_bottom_px >= 0 else "CUT OFF"
        
        print(f"  pos={int(pos_y*100)}%: Bowl Headroom = {bowl_headroom_px:5.1f}px ({bowl_ok}), Plate Bottom Margin = {plate_bottom_px:5.1f}px ({plate_ok}) [visible Y: {int(y_start)}..{int(y_end)}]")

