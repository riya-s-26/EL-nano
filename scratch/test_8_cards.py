import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

with open('es_keys.json', 'r', encoding='utf-8') as f:
    es = json.load(f)

# 1. Card 1: Parrillada Mini Mariscos (Signature Dish 03)
assert 'data-name="Parrillada Mini Mariscos"' in html
assert 'data-i18n="sig_03_title">Parrillada Mini Mariscos<' in html
assert en['sig_03_title'] == "Parrillada Mini Mariscos"
assert es['sig_03_title'] == "Parrillada Mini Mariscos"
assert en['sig_03_desc'] == "Grilled seafood served with your choice of side: patacones or avocado salad."
assert es['sig_03_desc'] == "Mariscos a la parrilla con guarnición a elegir: Patacones o ensalada de aguacate."
assert 'data-i18n="sig_03_nav">Parrillada Mini Mariscos<' in html
assert 'assets/img/pics from clients/Parrillada mini marisco.png' in html
print("PASS: Card 1 (Parrillada Mini Mariscos)")

# 2. Card 2: Caldo de Bola (Signature Dish 04)
assert 'data-name="Caldo de Bola"' in html
assert 'data-i18n="sig_04_title">Caldo de Bola<' in html
assert en['sig_04_title'] == "Caldo de Bola"
assert es['sig_04_title'] == "Caldo de Bola"
assert en['sig_04_desc'] == "A comforting Manabí-style soup with a green plantain dumpling stuffed with seasoned meat, served in a homestyle broth."
assert es['sig_04_desc'] == "Una reconfortante sopa estilo Manabí con una bola de plátano verde rellena de carne sazonada, servida en un caldo casero."
assert 'data-i18n="sig_04_nav">Caldo de Bola<' in html
print("PASS: Card 2 (Caldo de Bola)")

# 3. Card 3: Cazuela (replaces Sango de Choclo)
assert 'data-i18n="dish_sango_title">Cazuela<' in html
assert en['dish_sango_title'] == "Cazuela"
assert es['dish_sango_title'] == "Cazuela"
assert en['dish_sango_desc'] == "From our Manabí Creole culture, a fish stew with a base of green plantain and peanut."
assert es['dish_sango_desc'] == "De nuestra cultura criolla manabita un guiso de pescado con base de plátano macho y maní."
assert 'assets/img/pics from clients/Cazuela platano pescado.jpg' in html
print("PASS: Card 3 (Cazuela)")

# 4. Card 4: Pulpo a la brasa con patatas (replaces Pan de Yuca)
assert 'data-i18n="dish_pulpo_title">Pulpo a la Brasa con Patatas<' in html
assert en['dish_pulpo_title'] == "Pulpo a la Brasa con Patatas"
assert es['dish_pulpo_title'] == "Pulpo a la brasa con patatas"
assert en['dish_pulpo_desc'] == "Tender grilled octopus served over boiled potatoes seasoned with paprika and olive oil."
assert es['dish_pulpo_desc'] == "Tierno pulpo a la brasa servido con patatas cocidas, pimentón y aceite de oliva."
assert 'assets/img/pics from clients/Pulpo brasa.jpg' in html
assert 'dish_pan_yuca' not in html, "Stale pan de yuca found in index.html!"
assert 'dish_pan_yuca' not in en, "Stale pan de yuca in en_keys.json!"
assert 'dish_pan_yuca' not in es, "Stale pan de yuca in es_keys.json!"
print("PASS: Card 4 (Pulpo a la brasa con patatas)")

# 5. Card 5: Patacón con picaña (replaces Bolón de Plátano)
assert 'data-i18n="dish_patacon_picania_title">Patacón con Picaña<' in html
assert en['dish_patacon_picania_title'] == "Patacón con Picaña"
assert es['dish_patacon_picania_title'] == "Patacón con picaña"
assert en['dish_patacon_picania_desc'] == "Crispy green plantain patacones topped with tender grilled picaña steak."
assert es['dish_patacon_picania_desc'] == "Crujientes patacones de plátano verde coronados con tierna picaña a la parrilla."
assert 'assets/img/pics from clients/Patacon con picania.jpg' in html
assert 'dish_bolon' not in html, "Stale bolon found in index.html!"
assert 'dish_bolon' not in en, "Stale bolon in en_keys.json!"
assert 'dish_bolon' not in es, "Stale bolon in es_keys.json!"
print("PASS: Card 5 (Patacón con picaña)")

# 6. Cocktail Card 6: La Ñaña
assert 'data-i18n="cocktail_nana_title">La Ñaña<' in html
assert en['cocktail_nana_desc'] == "Delicate, floral, and finished with a bubble. Our namesake, and the easiest yes on the list"
assert es['cocktail_nana_desc'] == "Delicado, floral y terminado con una burbuja. Nuestro homónimo, y el sí más fácil de la lista."
print("PASS: Cocktail Card 6 (La Ñaña)")

# 7. Cocktail Card 7: Canelazo Miamero
assert 'data-i18n="cocktail_canelazo_title">Canelazo Miamero<' in html
assert en['cocktail_canelazo_desc'] == "The drink of cold Andean nights, served ice cold. Same tradition, different city."
assert es['cocktail_canelazo_desc'] == "La bebida de las frías noches andinas, servida bien fría. La misma tradición, diferente ciudad."
print("PASS: Cocktail Card 7 (Canelazo Miamero)")

# 8. Cocktail Card 8: Pineapple Brasa (replaces Ecuadorian Sour)
assert 'data-i18n="cocktail_pina_title">Pineapple Brasa<' in html
assert en['cocktail_pina_title'] == "Pineapple Brasa"
assert es['cocktail_pina_title'] == "Pineapple Brasa"
assert en['cocktail_pina_desc'] == "Born of fire and charcoal. Deep, caramelized, and gently spiced."
assert es['cocktail_pina_desc'] == "Nacido del fuego y el carbón. Profundo, caramelizado y suavemente especiado."
assert 'cocktail_sour' not in html, "Stale sour found in index.html!"
assert 'cocktail_sour' not in en, "Stale sour in en_keys.json!"
assert 'cocktail_sour' not in es, "Stale sour in es_keys.json!"
print("PASS: Cocktail Card 8 (Pineapple Brasa)")

print("\nALL 8 CARDS AND VERIFICATIONS PASSED WITH 100% SUCCESS!")

