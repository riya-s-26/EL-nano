from PIL import Image

# Let's inspect the actual saved previews
# preview_desktop_1440x900_pos_35.jpg
# preview_desktop_1440x900_pos_35_taller.jpg
# preview_laptop_1024x536_pos_35.jpg
# preview_laptop_1024x536_pos_35_taller.jpg

im_desk_35 = Image.open('scratch/preview_desktop_1440x900_pos_35.jpg')
im_desk_35_taller = Image.open('scratch/preview_desktop_1440x900_pos_35_taller.jpg')
im_lap_35 = Image.open('scratch/preview_laptop_1024x536_pos_35.jpg')
im_lap_35_taller = Image.open('scratch/preview_laptop_1024x536_pos_35_taller.jpg')

# Let's crop the dish container area from each:
# desktop: container is at x in [720, 1360], y in [140, 760]
im_desk_35.crop((720, 140, 1360, 760)).save('scratch/compare_desk_35.jpg')
im_desk_35_taller.crop((720, 120, 1360, 790)).save('scratch/compare_desk_35_taller.jpg')

# laptop 1024x536: container is at x in [530, 960], y in [90, 440]
im_lap_35.crop((530, 85, 960, 445)).save('scratch/compare_lap_35.jpg')
im_lap_35_taller.crop((530, 70, 960, 465)).save('scratch/compare_lap_35_taller.jpg')

print("Cropped comparisons saved successfully.")

