import json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update en_keys.json
with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

# Update Signature dishes
en['sig_03_title'] = "Parrillada Mini Mariscos"
en['sig_03_desc'] = "Grilled seafood served with your choice of side: patacones or avocado salad."
en['sig_03_nav'] = "Parrillada Mini Mariscos"

en['sig_04_title'] = "Caldo de Bola"
en['sig_04_desc'] = "A comforting Manabí-style soup with a green plantain dumpling stuffed with seasoned meat, served in a homestyle broth."
en['sig_04_nav'] = "Caldo de Bola"

# Update Card 9 (replace Sango with Cazuela)
en['dish_sango_title'] = "Cazuela"
en['dish_sango_desc'] = "From our Manabí Creole culture, a fish stew with a base of green plantain and peanut."

# Replace Bolon with Patacon con Picania
if 'dish_bolon_title' in en:
    del en['dish_bolon_title']
if 'dish_bolon_desc' in en:
    del en['dish_bolon_desc']
en['dish_patacon_picania_title'] = "Patacón con Picaña"
en['dish_patacon_picania_desc'] = "Crispy green plantain patacones topped with tender grilled picaña steak."

# Replace Pan de Yuca with Pulpo a la Brasa con Patatas
if 'dish_pan_yuca_title' in en:
    del en['dish_pan_yuca_title']
if 'dish_pan_yuca_desc' in en:
    del en['dish_pan_yuca_desc']
en['dish_pulpo_title'] = "Pulpo a la Brasa con Patatas"
en['dish_pulpo_desc'] = "Tender grilled octopus served over boiled potatoes seasoned with paprika and olive oil."

# Update Cocktails
en['cocktail_nana_title'] = "La Ñaña"
en['cocktail_nana_desc'] = "Delicate, floral, and finished with a bubble. Our namesake, and the easiest yes on the list"

en['cocktail_canelazo_title'] = "Canelazo Miamero"
en['cocktail_canelazo_desc'] = "The drink of cold Andean nights, served ice cold. Same tradition, different city."

if 'cocktail_sour_title' in en:
    del en['cocktail_sour_title']
if 'cocktail_sour_desc' in en:
    del en['cocktail_sour_desc']
en['cocktail_pina_title'] = "Pineapple Brasa"
en['cocktail_pina_desc'] = "Born of fire and charcoal. Deep, caramelized, and gently spiced."

with open('en_keys.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)
print("Updated en_keys.json")

# 2. Update es_keys.json
with open('es_keys.json', 'r', encoding='utf-8') as f:
    es = json.load(f)

es['sig_03_title'] = "Parrillada Mini Mariscos"
es['sig_03_desc'] = "Mariscos a la parrilla con guarnición a elegir: Patacones o ensalada de aguacate."
es['sig_03_nav'] = "Parrillada Mini Mariscos"

es['sig_04_title'] = "Caldo de Bola"
es['sig_04_desc'] = "Una reconfortante sopa estilo Manabí con una bola de plátano verde rellena de carne sazonada, servida en un caldo casero."
es['sig_04_nav'] = "Caldo de Bola"

es['dish_sango_title'] = "Cazuela"
es['dish_sango_desc'] = "De nuestra cultura criolla manabita un guiso de pescado con base de plátano macho y maní."

if 'dish_bolon_title' in es:
    del es['dish_bolon_title']
if 'dish_bolon_desc' in es:
    del es['dish_bolon_desc']
es['dish_patacon_picania_title'] = "Patacón con picaña"
es['dish_patacon_picania_desc'] = "Crujientes patacones de plátano verde coronados con tierna picaña a la parrilla."

if 'dish_pan_yuca_title' in es:
    del es['dish_pan_yuca_title']
if 'dish_pan_yuca_desc' in es:
    del es['dish_pan_yuca_desc']
es['dish_pulpo_title'] = "Pulpo a la brasa con patatas"
es['dish_pulpo_desc'] = "Tierno pulpo a la brasa servido con patatas cocidas, pimentón y aceite de oliva."

es['cocktail_nana_title'] = "La Ñaña"
es['cocktail_nana_desc'] = "Delicado, floral y terminado con una burbuja. Nuestro homónimo, y el sí más fácil de la lista."

es['cocktail_canelazo_title'] = "Canelazo Miamero"
es['cocktail_canelazo_desc'] = "La bebida de las frías noches andinas, servida bien fría. La misma tradición, diferente ciudad."

if 'cocktail_sour_title' in es:
    del es['cocktail_sour_title']
if 'cocktail_sour_desc' in es:
    del es['cocktail_sour_desc']
es['cocktail_pina_title'] = "Pineapple Brasa"
es['cocktail_pina_desc'] = "Nacido del fuego y el carbón. Profundo, caramelizado y suavemente especiado."

with open('es_keys.json', 'w', encoding='utf-8') as f:
    json.dump(es, f, indent=2, ensure_ascii=False)
print("Updated es_keys.json")

