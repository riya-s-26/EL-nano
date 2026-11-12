import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Old image must be absent
assert 'assets/brand-extracted/page3_6_Im6.jpg' not in html, 'Old image page3_6_Im6.jpg still present!'

# 2. Section A Check (Traditional Coastal Specialties -> Encebollado)
sec_a_idx = html.find('class="dish-card dish-card--encebollado"')
assert sec_a_idx != -1, 'Could not find dish-card--encebollado!'
sec_a_block = html[sec_a_idx:sec_a_idx+600]
assert 'src="assets/img/pics from clients/Encebollado mixto.jpg"' in sec_a_block, 'Section A missing Encebollado mixto.jpg!'
print("PASS: Section A (Traditional Coastal Specialties -> Encebollado) has correct image!")

# 3. Section B Check (Signature Dish 01 -> Encebollado)
sec_b_idx = html.find('id="signature-dishes"')
assert sec_b_idx != -1, 'Could not find #signature-dishes!'
sec_b_block = html[sec_b_idx:sec_b_idx+1000]
assert 'src="assets/img/pics from clients/Encebollado mixto.jpg"' in sec_b_block, 'Section B missing Encebollado mixto.jpg!'
print("PASS: Section B (Signature Dish 01 -> Encebollado) has correct image!")

# 4. File existence and integrity
img_path = 'assets/img/pics from clients/Encebollado mixto.jpg'
assert os.path.exists(img_path), f'Missing {img_path}!'
print(f"PASS: {img_path} exists on disk (size: {os.path.getsize(img_path)} bytes)")

# 5. Carousel structure and navigation intact
assert 'story-nav' in html, 'story-nav missing!'
assert 'data-go="0">Encebollado</button>' in html, 'Button 0 missing!'
assert 'article class="dish" data-name="Encebollado"' in html, 'Dish 1 article missing!'
assert 'article class="dish" data-name="Fritada"' in html, 'Dish 2 article missing!'
assert 'article class="dish" data-name="Mariscos"' in html, 'Dish 3 article missing!'
assert 'article class="dish" data-name="Arroz con maduro y aguacate"' in html, 'Dish 4 article missing!'
print("PASS: Carousel structure and navigation controls 100% intact!")

# 6. Check i18n keys for both sections
assert 'data-i18n="rec_title">Traditional Coastal Specialties<' in html
assert 'data-i18n="sig_01_label">Signature Dish 01<' in html
assert 'data-i18n="sig_01_desc">' in html
print("PASS: All i18n bindings intact!")

