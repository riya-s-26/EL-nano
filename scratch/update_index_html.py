import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Card 1: Encebollado
    (
        '<img src="assets/img/pics from clients/Encebollado mixto.jpg" alt="Encebollado Mixto: albacore tuna, coastal shrimp, and tender yuca in aromatic citrus herb broth" width="1792" height="1792" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Encebollado.jpg" alt="Encebollado: albacore tuna, tender yuca, pickled red onion, and fresh herb broth" width="1792" height="1792" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_encebollado_desc">Albacore tuna and tender yuca broth infused with cilantro, cumin, pickled red onions, and toasted chifles.</p>',
        '<p class="menu-card-desc" data-i18n="dish_encebollado_desc">From traditional Creole cuisine, our fish encebollado with pickled onion and our savory consommé.</p>'
    ),

    # Card 2: Guatita
    (
        '<img src="assets/img/pics from clients/VGA Arroz salteado verduras.png" alt="Guatita Ecuatoriana" width="1842" height="2304" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Guatita.jpg" alt="Guatita: tender stewed beef tripe in rich peanut and potato sauce" width="1792" height="1792" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_guatita_desc">Slow-simmered tender tripe in a rich peanut and achiote sauce with diced potatoes, white rice, and avocado.</p>',
        '<p class="menu-card-desc" data-i18n="dish_guatita_desc">Stewed tripe with potato and peanut.</p>'
    ),

    # Card 4: Fritada
    (
        '<img src="assets/img/pics from clients/Fritada.png" alt="Fritada Ecuatoriana" width="1086" height="1448" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Fritada.png" alt="Fritada ecuatoriana: seasoned braised and crisped pork ribs with patacón and criollo salad" width="1086" height="1448" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_fritada_desc">Succulent seasoned pork braised in spiced citrus broth and crisped in its own juices, served with sweet maduro and choclo.</p>',
        '<p class="menu-card-desc" data-i18n="dish_fritada_desc">Fried seasoned pork ribs, served with patacón (fried green plantain) and criollo salad.</p>'
    ),

    # Card 5: Churrasco Ecuatoriano
    (
        '<img src="assets/img/pics from clients/Parrillada carne completa.png" alt="Churrasco Ecuatoriano" width="1792" height="2396" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Churrasco ecuatoriano.jpg" alt="Churrasco ecuatoriano: braised beef steak in savory sauce with rice, french fries, and fried egg" width="1842" height="1842" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_churrasco_desc">Grilled seasoned steak topped with fried eggs, accompanied by white rice, french fries, sweet plantains, and fresh avocado salad.</p>',
        '<p class="menu-card-desc" data-i18n="dish_churrasco_desc">Braised beef in savory sauce served with rice, french fries, fried egg, and salad.</p>'
    ),

    # Card 6: Yapingacho
    (
        '<img src="assets/img/pics from clients/Yapingacho 1.png" alt="Yapingacho" width="1122" height="1402" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Yapingacho 1.png" alt="Yapingacho: roast pork served with potato patties in peanut sauce, chorizo, fried eggs, and avocado salad" width="1122" height="1402" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_yapingacho_desc">Golden pan-fried potato cakes filled with melted cheese, served with creamy peanut sauce, chorizo, fried egg, and salad.</p>',
        '<p class="menu-card-desc" data-i18n="dish_yapingacho_desc">Roast pork served with yapingacho potato patties in peanut sauce, chorizo, fried eggs, and avocado salad.</p>'
    ),

    # Card 7: Cazuela
    (
        '<img src="assets/img/pics from clients/Cesta marisco.png" alt="Cazuela de Pescado y Mariscos" width="1792" height="2396" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Cazuela platano mixta.jpg" alt="Cazuela: traditional Manabí fish and seafood stew with green plantain and peanut base" width="1792" height="1792" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_cazuela_desc">Baked green plantain and ground peanut casserole simmered with fresh fish or shrimp, herbs, and garlic, served bubbly hot.</p>',
        '<p class="menu-card-desc" data-i18n="dish_cazuela_desc">From our Manabí Creole culture, a fish stew with a base of green plantain and peanut.</p>'
    ),

    # Card 8: Encocado
    (
        '<img src="assets/img/pics from clients/Mix rebozados.png" alt="Encocado de Mariscos" width="1122" height="1402" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Encocado mixto.jpg" alt="Encocado mixto: fresh Pacific seafood simmered in coconut milk sauce" width="1792" height="1792" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_encocado_desc">Fresh seafood simmered in a luscious spiced coconut milk sauce with bell peppers, garlic, and cilantro, served with rice and patacones.</p>',
        '<p class="menu-card-desc" data-i18n="dish_encocado_desc">From the green province of Ecuador and across the Pacific coast, our fresh seafood in coconut sauce.</p>'
    ),

    # Card 9: Sango de Choclo
    (
        '<!-- Item: Cazuela -->\n          <article class="menu-card" data-cat="clasicos">\n            <div class="menu-card-media">\n              <span class="menu-card-tag" data-i18n="tag_traditional">Traditional</span>\n              <img src="assets/img/pics from clients/VG-patacones-queso- ensalada.png" alt="Cazuela" width="1842" height="2304" loading="lazy" decoding="async">\n            </div>\n            <div class="menu-card-body">\n              <div class="menu-card-head">\n                <h4 class="menu-card-title" data-i18n="dish_sango_title">Cazuela</h4>',
        '<!-- Item: Sango de Choclo -->\n          <article class="menu-card" data-cat="clasicos">\n            <div class="menu-card-media">\n              <span class="menu-card-tag" data-i18n="tag_traditional">Traditional</span>\n              <img src="assets/img/pics from clients/VG-patacones-queso- ensalada.png" alt="Sango de Choclo: comforting sweet corn stew prepared with freshly grated choclo and coastal shrimp" width="1842" height="2304" loading="lazy" decoding="async">\n            </div>\n            <div class="menu-card-body">\n              <div class="menu-card-head">\n                <h4 class="menu-card-title" data-i18n="dish_sango_title">Sango de Choclo</h4>'
    ),

    # Card 11: Patacones con Queso
    (
        '<img src="assets/img/pics from clients/patacones.png" alt="Patacones con Queso" width="1842" height="2304" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Patacones queso.jpg" alt="Patacones con queso: fried green plantains served with cheese and tartar sauce" width="1122" height="1122" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_patacones_queso_desc">Twice-fried crispy green plantain rounds served alongside thick slices of fresh Ecuadorian coastal white cheese.</p>',
        '<p class="menu-card-desc" data-i18n="dish_patacones_queso_desc">Fried green plantains served with cheese and tartar sauce.</p>'
    ),

    # Card 12: Maduros con Queso
    (
        '<img src="assets/img/pics from clients/Maduro.png" alt="Maduros con Queso" width="1842" height="2304" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Maduros queso.jpg" alt="Maduros con queso: fried sweet ripe plantain served with fresh cheese and guava sauce" width="1122" height="1122" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_maduros_queso_desc">Tender caramelized ripe sweet plantains baked to perfection and served with fresh coastal white cheese.</p>',
        '<p class="menu-card-desc" data-i18n="dish_maduros_queso_desc">Fried ripe sweet plantain, served with fresh cheese and guava sauce.</p>'
    ),

    # Card 14: Choclo Asado
    (
        '<img src="assets/img/pics from clients/patacones.png" alt="Choclo Asado" width="1842" height="2304" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Choclo asado.jpg" alt="Choclo asado: roasted corn on the cob served with grated cheese and salsa verde" width="1122" height="1122" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_choclo_desc">Charred giant-kernel Andean sweet corn on the cob served with thick cuts of fresh Ecuadorian white cheese.</p>',
        '<p class="menu-card-desc" data-i18n="dish_choclo_desc">Roasted corn served with grated cheese and salsa verde.</p>'
    ),

    # Card 16: Arroz Marinero
    (
        '<p class="menu-card-desc" data-i18n="dish_arroz_marinero_desc">Sautéed yellow spiced rice with whole jumbo prawns, mussels, calamari rings, crab claws, and fresh citrus herbs.</p>',
        '<p class="menu-card-desc" data-i18n="dish_arroz_marinero_desc">(TO SHARE) Sautéed with fresh Pacific seafood, our flavorful coastal seafood rice.</p>'
    ),

    # Card 17: Bandera Mixta
    (
        '<img src="assets/img/pics from clients/VGA Ensalada arroz maduros.png" alt="Bandera Mixta" width="1842" height="2304" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Bandera mixta.jpg" alt="Bandera mixta: combination platter of rice, guatita, and cazuela" width="1792" height="1792" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_bandera_mixta_desc">The quintessential combination plate featuring generous portions of Encebollado, Guatita, and Seco de Pollo over yellow rice.</p>',
        '<p class="menu-card-desc" data-i18n="dish_bandera_mixta_desc">Rice, guatita, and cazuela.</p>'
    ),

    # Card 18: Bandera Completa
    (
        '<img src="assets/img/pics from clients/Parrillada mini marisco.png" alt="Bandera Completa" width="1792" height="2396" loading="lazy" decoding="async">',
        '<img src="assets/img/pics from clients/Bandera completa.jpg" alt="Bandera completa: grand combination platter of guatita, cazuela, encebollado, and shrimp ceviche" width="1792" height="1792" loading="lazy" decoding="async">'
    ),
    (
        '<p class="menu-card-desc" data-i18n="dish_bandera_completa_desc">Grand coastal platter uniting Encebollado, Guatita, Ceviche de Camarón, and Seco de Pollo with sweet plantains and avocado.</p>',
        '<p class="menu-card-desc" data-i18n="dish_bandera_completa_desc">Guatita, cazuela, encebollado, and shrimp ceviche.</p>'
    ),
]

for target, repl in replacements:
    if target in content:
        content = content.replace(target, repl)
        print(f"Replaced successfully: {target[:50]}...")
    else:
        print(f"WARNING: Target not found: {repr(target[:50])}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished updating index.html!")

