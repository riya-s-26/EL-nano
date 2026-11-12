import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

with open('es_keys.json', 'r', encoding='utf-8') as f:
    es = json.load(f)

# 1. Encebollado in Authentic Coastal Flavors & Cocktails section
menu_idx = html.find('id="menu"')
assert menu_idx != -1
enceb_card_idx = html.find('<!-- Item: Encebollado -->', menu_idx)
assert enceb_card_idx != -1
enceb_card_block = html[enceb_card_idx:enceb_card_idx+800]
assert 'src="assets/img/pics from clients/Encebollado mixto.jpg"' in enceb_card_block, "Encebollado in menu-grid does not use Encebollado mixto.jpg!"
print("PASS: Encebollado in Authentic Coastal Flavors & Cocktails catalog uses Encebollado mixto.jpg")

# 2. Encebollado in Signature Dishes carousel remains untouched
sig_idx = html.find('id="signature-dishes"')
assert sig_idx != -1
sig_enceb_idx = html.find('data-name="Encebollado"', sig_idx)
assert sig_enceb_idx != -1
sig_enceb_block = html[sig_enceb_idx:sig_enceb_idx+800]
assert 'src="assets/img/pics from clients/Encebollado mixto.jpg"' in sig_enceb_block, "Encebollado in carousel broken!"
print("PASS: Encebollado in Signature Dishes carousel untouched")

# 3. Signature Dish 04 — Caldo de Bola
caldo_idx = html.find('data-name="Caldo de Bola"', sig_idx)
assert caldo_idx != -1
caldo_block = html[caldo_idx:caldo_idx+800]
assert 'src="assets/img/pics from clients/Caldo de Bola.png"' in caldo_block, "Caldo de Bola image missing!"
assert os.path.exists('assets/img/pics from clients/Caldo de Bola.png')
assert 'data-i18n="sig_04_title">Caldo de Bola<' in caldo_block
assert 'data-i18n="sig_04_desc">' in caldo_block
assert en['sig_04_desc'] == "A comforting Manabí-style soup with a green plantain dumpling stuffed with seasoned meat, served in a homestyle broth."
assert 'data-i18n="sig_04_nav">Caldo de Bola<' in html
print("PASS: Signature Dish 04 Caldo de Bola verified with Caldo de Bola.png and navigation link")

# 4. Cocktail Card — La Ñaña
nana_idx = html.find('<!-- Cocktail: La Ñaña -->')
assert nana_idx != -1
nana_block = html[nana_idx:nana_idx+800]
assert 'src="assets/img/pics from clients/la nana.png"' in nana_block, "la nana.png missing!"
assert os.path.exists('assets/img/pics from clients/la nana.png')
assert en['cocktail_nana_desc'] == "Delicate, floral, and finished with a bubble. Our namesake, and the easiest yes on the list"
assert '$9 Happy Hour' in nana_block and '$14 Regular' in nana_block
print("PASS: La Ñaña cocktail card verified with la nana.png, approved copy, and $9/$14 pricing")

# 5. Cocktail Card — Canelazo Miamero
canelazo_idx = html.find('<!-- Cocktail: Canelazo Miamero -->')
assert canelazo_idx != -1
canelazo_block = html[canelazo_idx:canelazo_idx+800]
assert 'src="assets/img/pics from clients/canelazo.png"' in canelazo_block, "canelazo.png missing!"
assert os.path.exists('assets/img/pics from clients/canelazo.png')
assert en['cocktail_canelazo_desc'] == "The drink of cold Andean nights, served ice cold. Same tradition, different city."
assert '$9 Happy Hour' in canelazo_block and '$14 Regular' in canelazo_block
print("PASS: Canelazo Miamero cocktail card verified with canelazo.png, approved copy, and $9/$14 pricing")

# 6. Cocktail Card — Pineapple Brasa
pina_idx = html.find('<!-- Cocktail: Pineapple Brasa -->')
assert pina_idx != -1
pina_block = html[pina_idx:pina_idx+1200]
assert 'src="assets/img/pics from clients/pina.png"' in pina_block, "pina.png missing!"
assert os.path.exists('assets/img/pics from clients/pina.png')
assert en['cocktail_pina_desc'] == "Born of fire and charcoal. Deep, caramelized, and gently spiced."
assert '$9 Happy Hour' in pina_block and '$14 Regular' in pina_block
print("PASS: Pineapple Brasa cocktail card verified with pina.png, approved copy, and $9/$14 pricing")

print("\nALL VERIFICATIONS PASSED 100%!")
