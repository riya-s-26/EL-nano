import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Card 9 (Cazuela replacing Sango de Choclo)
old_card9 = '''          <!-- Item: Sango de Choclo -->
          <article class="menu-card" data-cat="clasicos">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_traditional">Traditional</span>
              <img src="assets/img/pics from clients/VG-patacones-queso- ensalada.png" alt="Sango de Choclo: comforting sweet corn stew prepared with freshly grated choclo and coastal shrimp" width="1842" height="2304" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="dish_sango_title">Sango de Choclo</h4>
                <span class="menu-card-price" data-i18n="price_inquire">Sweet Corn Stew</span>
              </div>
              <p class="menu-card-desc" data-i18n="dish_sango_desc">Comforting coastal sweet corn stew prepared with freshly grated choclo, achiote aromatics, and tender coastal shrimp.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_clasicos_label">Classics</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

new_card9 = '''          <!-- Item: Cazuela -->
          <article class="menu-card" data-cat="clasicos">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_manabi">Manabí Heritage</span>
              <img src="assets/img/pics from clients/Cazuela platano pescado.jpg" alt="Cazuela: traditional Manabí fish stew with green plantain and peanut base" width="1792" height="1792" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="dish_sango_title">Cazuela</h4>
                <span class="menu-card-price" data-i18n="price_inquire">Coastal Casserole</span>
              </div>
              <p class="menu-card-desc" data-i18n="dish_sango_desc">From our Manabí Creole culture, a fish stew with a base of green plantain and peanut.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_clasicos_label">Classics</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

assert old_card9 in html, "Could not find old_card9 in index.html"
html = html.replace(old_card9, new_card9)
print("Updated Card 9 (Cazuela)")

# 2. Card 10 (Patacón con picaña replacing Bolón de Plátano)
old_card10 = '''          <!-- Item: Bolón de Plátano -->
          <article class="menu-card" data-cat="empezar">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_starter">Starter Icon</span>
              <img src="assets/img/pics from clients/Verde.png" alt="Bolón de Plátano" width="1842" height="2304" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="dish_bolon_title">Bolón de Plátano</h4>
                <span class="menu-card-price" data-i18n="price_inquire">Queso / Chicharrón</span>
              </div>
              <p class="menu-card-desc" data-i18n="dish_bolon_desc">Giant mashed green plantain dumpling stuffed with coastal white cheese, crispy pork chicharrón, or mixto, fried golden.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_empezar_label">Starters</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

new_card10 = '''          <!-- Item: Patacón con Picaña -->
          <article class="menu-card" data-cat="empezar">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_starter">Starter Icon</span>
              <img src="assets/img/pics from clients/Patacon con picania.jpg" alt="Patacón con picaña: crispy fried plantains topped with grilled picaña steak" width="1792" height="1792" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="dish_patacon_picania_title">Patacón con Picaña</h4>
                <span class="menu-card-price" data-i18n="price_inquire">Grilled Steak &amp; Plantain</span>
              </div>
              <p class="menu-card-desc" data-i18n="dish_patacon_picania_desc">Crispy green plantain patacones topped with tender grilled picaña steak.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_empezar_label">Starters</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

assert old_card10 in html, "Could not find old_card10 in index.html"
html = html.replace(old_card10, new_card10)
print("Updated Card 10 (Patacón con Picaña)")

# 3. Card 13 (Pulpo a la brasa con patatas replacing Pan de Yuca)
old_card13 = '''          <!-- Item: Pan de Yuca -->
          <article class="menu-card" data-cat="empezar">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_starter">Baked Fresh</span>
              <img src="assets/img/pics from clients/Guacamole.png" alt="Pan de Yuca" width="1842" height="2304" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="dish_pan_yuca_title">Pan de Yuca</h4>
                <span class="menu-card-price" data-i18n="price_inquire">Cassava Bread</span>
              </div>
              <p class="menu-card-desc" data-i18n="dish_pan_yuca_desc">Warm, cheesy baked Ecuadorian cassava rolls with crisp golden crust and light, airy chewy interior.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_empezar_label">Starters</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

new_card13 = '''          <!-- Item: Pulpo a la Brasa con Patatas -->
          <article class="menu-card" data-cat="empezar">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_starter">Grilled Seafood</span>
              <img src="assets/img/pics from clients/Pulpo brasa.jpg" alt="Pulpo a la brasa con patatas: tender grilled octopus over seasoned potatoes" width="1122" height="1122" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="dish_pulpo_title">Pulpo a la Brasa con Patatas</h4>
                <span class="menu-card-price" data-i18n="price_inquire">Grilled Octopus</span>
              </div>
              <p class="menu-card-desc" data-i18n="dish_pulpo_desc">Tender grilled octopus served over boiled potatoes seasoned with paprika and olive oil.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_empezar_label">Starters</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

assert old_card13 in html, "Could not find old_card13 in index.html"
html = html.replace(old_card13, new_card13)
print("Updated Card 13 (Pulpo a la Brasa con Patatas)")

# 4. Cocktail 6 (La Ñaña)
old_cocktail6 = '''          <!-- Cocktail: La Ñaña -->
          <article class="menu-card" data-cat="drinks">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_signature_cocktail">Signature Cocktail</span>
              <img src="assets/img/experiences/exp-cocktails.webp" alt="La Ñaña Cocktail" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="cocktail_nana_title">La Ñaña</h4>
                <span class="menu-card-price cocktail-price" data-i18n="cocktail_price"><span class="price-hh">$9 Happy Hour</span><span class="price-reg">$14 Regular</span></span>
              </div>
              <p class="menu-card-desc" data-i18n="cocktail_nana_desc">Our namesake cocktail crafted with fresh maracuyá (passion fruit), premium aged rum, citrus cordial, and mint.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_drinks_label">Drinks &amp; Bar</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

new_cocktail6 = '''          <!-- Cocktail: La Ñaña -->
          <article class="menu-card" data-cat="drinks">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_signature_cocktail">Signature Cocktail</span>
              <img src="assets/img/experiences/exp-cocktails.webp" alt="La Ñaña: delicate, floral, and finished with a bubble" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="cocktail_nana_title">La Ñaña</h4>
                <span class="menu-card-price cocktail-price" data-i18n="cocktail_price"><span class="price-hh">$9 Happy Hour</span><span class="price-reg">$14 Regular</span></span>
              </div>
              <p class="menu-card-desc" data-i18n="cocktail_nana_desc">Delicate, floral, and finished with a bubble. Our namesake, and the easiest yes on the list</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_drinks_label">Drinks &amp; Bar</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

assert old_cocktail6 in html, "Could not find old_cocktail6 in index.html"
html = html.replace(old_cocktail6, new_cocktail6)
print("Updated Cocktail 6 (La Ñaña)")

# 5. Cocktail 7 (Canelazo Miamero)
old_cocktail7 = '''          <!-- Cocktail: Canelazo Miamero -->
          <article class="menu-card" data-cat="drinks">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_house_special">House Favorite</span>
              <img src="assets/img/experiences/exp-cocktails.webp" alt="Canelazo Miamero" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="cocktail_canelazo_title">Canelazo Miamero</h4>
                <span class="menu-card-price cocktail-price" data-i18n="cocktail_price"><span class="price-hh">$9 Happy Hour</span><span class="price-reg">$14 Regular</span></span>
              </div>
              <p class="menu-card-desc" data-i18n="cocktail_canelazo_desc">Spiced naranjilla and cinnamon infusion balanced with cane spirits, panela reduction, and citrus zest. Served chilled.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_drinks_label">Drinks &amp; Bar</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

new_cocktail7 = '''          <!-- Cocktail: Canelazo Miamero -->
          <article class="menu-card" data-cat="drinks">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_house_special">House Favorite</span>
              <img src="assets/img/experiences/exp-cocktails.webp" alt="Canelazo Miamero: the drink of cold Andean nights, served ice cold" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="cocktail_canelazo_title">Canelazo Miamero</h4>
                <span class="menu-card-price cocktail-price" data-i18n="cocktail_price"><span class="price-hh">$9 Happy Hour</span><span class="price-reg">$14 Regular</span></span>
              </div>
              <p class="menu-card-desc" data-i18n="cocktail_canelazo_desc">The drink of cold Andean nights, served ice cold. Same tradition, different city.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_drinks_label">Drinks &amp; Bar</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

assert old_cocktail7 in html, "Could not find old_cocktail7 in index.html"
html = html.replace(old_cocktail7, new_cocktail7)
print("Updated Cocktail 7 (Canelazo Miamero)")

# 6. Cocktail 8 (Pineapple Brasa replacing Ecuadorian Sour)
old_cocktail8 = '''          <!-- Cocktail: Ecuadorian Sour -->
          <article class="menu-card" data-cat="drinks">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_craft_cocktail">Craft Cocktail</span>
              <img src="assets/img/experiences/exp-cocktails.webp" alt="Ecuadorian Sour" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="cocktail_sour_title">Ecuadorian Sour</h4>
                <span class="menu-card-price cocktail-price" data-i18n="cocktail_price"><span class="price-hh">$9 Happy Hour</span><span class="price-reg">$14 Regular</span></span>
              </div>
              <p class="menu-card-desc" data-i18n="cocktail_sour_desc">Artisanal spirits shaken with Andean fruit reduction, fresh lime juice, egg white froth, and aromatic bitters.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_drinks_label">Drinks &amp; Bar</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

new_cocktail8 = '''          <!-- Cocktail: Pineapple Brasa -->
          <article class="menu-card" data-cat="drinks">
            <div class="menu-card-media">
              <span class="menu-card-tag" data-i18n="tag_craft_cocktail">Craft Cocktail</span>
              <img src="assets/img/experiences/exp-cocktails.webp" alt="Pineapple Brasa: born of fire and charcoal, deep, caramelized, and gently spiced" width="1600" height="1067" loading="lazy" decoding="async">
            </div>
            <div class="menu-card-body">
              <div class="menu-card-head">
                <h4 class="menu-card-title" data-i18n="cocktail_pina_title">Pineapple Brasa</h4>
                <span class="menu-card-price cocktail-price" data-i18n="cocktail_price"><span class="price-hh">$9 Happy Hour</span><span class="price-reg">$14 Regular</span></span>
              </div>
              <p class="menu-card-desc" data-i18n="cocktail_pina_desc">Born of fire and charcoal. Deep, caramelized, and gently spiced.</p>
              <div class="menu-card-meta">
                <span data-i18n="cat_drinks_label">Drinks &amp; Bar</span>
                <a class="menu-card-link" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="card_view_digital">View on Digital Menu ↗</a>
              </div>
            </div>
          </article>'''

assert old_cocktail8 in html, "Could not find old_cocktail8 in index.html"
html = html.replace(old_cocktail8, new_cocktail8)
print("Updated Cocktail 8 (Pineapple Brasa)")

# 7. Signature Dishes 03 & 04 + Navigation Buttons
old_sig_block = '''          <article class="dish" data-name="Mariscos">
            <div class="dish-text">
              <span class="kicker" data-i18n="sig_03_label">Signature Dish 03</span>
              <h2 data-i18n="sig_03_title">Mariscos &amp; Cazuela</h2>
              <p data-i18n="sig_03_desc">Sizzling prawns, mussels, and tender seafood simmered in a coastal garlic-herb reduction with lime and cilantro.</p>
            </div>
            <figure class="dish-shot">
              <picture>
                <img src="assets/img/pics from clients/Parrillada mini marisco.png" alt="Hot sizzling seafood platter with grilled octopus, prawns, fish, potatoes, and citrus herbs" width="1792" height="2396" loading="lazy" decoding="async">
              </picture>
            </figure>
          </article>

          <article class="dish" data-name="Arroz con maduro y aguacate">
            <div class="dish-text">
              <span class="kicker" data-i18n="sig_04_label">Signature Dish 04</span>
              <h2 data-i18n="sig_04_title">Arroz con maduro y aguacate</h2>
              <p data-i18n="sig_04_desc">Spiced yellow rice accompanied by sweet fried ripe plantains and creamy avocado, served alongside a savory slow-cooked stew.</p>
            </div>
            <figure class="dish-shot">
              <picture>
                <img src="assets/img/pics from clients/VGA Ensalada arroz maduros.png" alt="Plated yellow spiced rice accompanied by sweet caramelized maduros, fresh garden salad, and savory stewed menestra" width="1842" height="2304" loading="lazy" decoding="async">
              </picture>
            </figure>
          </article>
        </div>

        <ol class="story-nav" aria-label="Signature Dishes Navigation">
          <li><button type="button" data-go="0">Encebollado</button></li>
          <li><button type="button" data-go="1" data-i18n="sig_02_nav">Fritada</button></li>
          <li><button type="button" data-go="2">Mariscos</button></li>
          <li><button type="button" data-go="3">Arroz con maduro</button></li>
        </ol>'''

new_sig_block = '''          <article class="dish" data-name="Parrillada Mini Mariscos">
            <div class="dish-text">
              <span class="kicker" data-i18n="sig_03_label">Signature Dish 03</span>
              <h2 data-i18n="sig_03_title">Parrillada Mini Mariscos</h2>
              <p data-i18n="sig_03_desc">Grilled seafood served with your choice of side: patacones or avocado salad.</p>
            </div>
            <figure class="dish-shot">
              <picture>
                <img src="assets/img/pics from clients/Parrillada mini marisco.png" alt="Parrillada Mini Mariscos: grilled seafood platter served with choice of patacones or avocado salad" width="1792" height="2396" loading="lazy" decoding="async">
              </picture>
            </figure>
          </article>

          <article class="dish" data-name="Caldo de Bola">
            <div class="dish-text">
              <span class="kicker" data-i18n="sig_04_label">Signature Dish 04</span>
              <h2 data-i18n="sig_04_title">Caldo de Bola</h2>
              <p data-i18n="sig_04_desc">A comforting Manabí-style soup with a green plantain dumpling stuffed with seasoned meat, served in a homestyle broth.</p>
            </div>
            <figure class="dish-shot">
              <picture>
                <img src="assets/img/pics from clients/VG-patacones-queso- ensalada.png" alt="Caldo de Bola: comforting Manabí-style green plantain dumpling soup" width="1842" height="2304" loading="lazy" decoding="async">
              </picture>
            </figure>
          </article>
        </div>

        <ol class="story-nav" aria-label="Signature Dishes Navigation">
          <li><button type="button" data-go="0">Encebollado</button></li>
          <li><button type="button" data-go="1" data-i18n="sig_02_nav">Fritada</button></li>
          <li><button type="button" data-go="2" data-i18n="sig_03_nav">Parrillada Mini Mariscos</button></li>
          <li><button type="button" data-go="3" data-i18n="sig_04_nav">Caldo de Bola</button></li>
        </ol>'''

assert old_sig_block in html, "Could not find old_sig_block in index.html"
html = html.replace(old_sig_block, new_sig_block)
print("Updated Signature Dishes 03 & 04 + Navigation Buttons")

# Bump script cache-busting version
html = html.replace('translations.js?v=4.0', 'translations.js?v=5.0')
html = html.replace('main.js?v=4.0', 'main.js?v=5.0')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved index.html successfully!")

