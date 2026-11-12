import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Restore Encebollado in Authentic Coastal Flavors & Cocktails catalog (line 429)
target_encebollado = '<img src="assets/img/pics from clients/Encebollado.jpg" alt="Encebollado: albacore tuna, tender yuca, pickled red onion, and fresh herb broth" width="1792" height="1792" loading="lazy" decoding="async">'
replace_encebollado = '<img src="assets/img/pics from clients/Encebollado mixto.jpg" alt="Encebollado: albacore tuna, tender yuca, pickled red onion, and fresh herb broth" width="1792" height="1792" loading="lazy" decoding="async">'
assert target_encebollado in html, "Target Encebollado img not found!"
html = html.replace(target_encebollado, replace_encebollado)
print("PASS: Restored Encebollado photo in menu catalog")

# 2. Signature Dish 04 — Caldo de Bola (line 933)
target_caldo = '<img src="assets/img/pics from clients/VG-patacones-queso- ensalada.png" alt="Caldo de Bola: comforting Manabí-style green plantain dumpling soup" width="1842" height="2304" loading="lazy" decoding="async">'
replace_caldo = '<img src="assets/img/pics from clients/Caldo de Bola.png" alt="Caldo de Bola: comforting Manabí-style green plantain dumpling soup" width="1024" height="1536" loading="lazy" decoding="async">'
assert target_caldo in html, "Target Caldo de Bola img not found!"
html = html.replace(target_caldo, replace_caldo)
print("PASS: Connected Caldo de Bola.png to Signature Dish 04")

# 3. Cocktail Card — La Ñaña (line 790)
target_nana = '<img src="assets/img/experiences/exp-cocktails.webp" alt="La Ñaña: delicate, floral, and finished with a bubble" width="1600" height="1067" loading="lazy" decoding="async">'
replace_nana = '<img src="assets/img/pics from clients/la nana.png" alt="La Ñaña: delicate, floral, and finished with a bubble" width="1024" height="1536" loading="lazy" decoding="async">'
assert target_nana in html, "Target La Ñaña img not found!"
html = html.replace(target_nana, replace_nana)
print("PASS: Connected la nana.png to La Ñaña card")

# 4. Cocktail Card — Canelazo Miamero (line 809)
target_canelazo = '<img src="assets/img/experiences/exp-cocktails.webp" alt="Canelazo Miamero: the drink of cold Andean nights, served ice cold" width="1600" height="1067" loading="lazy" decoding="async">'
replace_canelazo = '<img src="assets/img/pics from clients/canelazo.png" alt="Canelazo Miamero: the drink of cold Andean nights, served ice cold" width="1024" height="1536" loading="lazy" decoding="async">'
assert target_canelazo in html, "Target Canelazo Miamero img not found!"
html = html.replace(target_canelazo, replace_canelazo)
print("PASS: Connected canelazo.png to Canelazo Miamero card")

# 5. Cocktail Card — Pineapple Brasa (line 828)
target_pina = '<img src="assets/img/experiences/exp-cocktails.webp" alt="Pineapple Brasa: born of fire and charcoal, deep, caramelized, and gently spiced" width="1600" height="1067" loading="lazy" decoding="async">'
replace_pina = '<img src="assets/img/pics from clients/pina.png" alt="Pineapple Brasa: born of fire and charcoal, deep, caramelized, and gently spiced" width="1024" height="1536" loading="lazy" decoding="async">'
assert target_pina in html, "Target Pineapple Brasa img not found!"
html = html.replace(target_pina, replace_pina)
print("PASS: Connected pina.png to Pineapple Brasa card")

# Bump script cache-busting version
html = html.replace('translations.js?v=5.0', 'translations.js?v=6.0')
html = html.replace('main.js?v=5.0', 'main.js?v=6.0')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Successfully written index.html!")

