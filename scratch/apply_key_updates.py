import json
import re

# 1. Update en_keys.json
with open('en_keys.json', encoding='utf-8') as f:
    en = json.load(f)

en_updates = {
    "dish_encebollado_title": "Encebollado",
    "dish_encebollado_desc": "From traditional Creole cuisine, our fish encebollado with pickled onion and our savory consommé.",
    "dish_guatita_title": "Guatita",
    "dish_guatita_desc": "Stewed tripe with potato and peanut.",
    "dish_seco_title": "Seco de Pollo",
    "dish_seco_desc": "Tender chicken braised in a savory reduction of herbs, mild spices, and fruit notes with fragrant yellow rice and maduros.",
    "dish_fritada_title": "Fritada",
    "dish_fritada_desc": "Fried seasoned pork ribs, served with patacón (fried green plantain) and criollo salad.",
    "dish_churrasco_title": "Churrasco Ecuatoriano",
    "dish_churrasco_desc": "Braised beef in savory sauce served with rice, french fries, fried egg, and salad.",
    "dish_yapingacho_title": "Yapingacho",
    "dish_yapingacho_desc": "Roast pork served with yapingacho potato patties in peanut sauce, chorizo, fried eggs, and avocado salad.",
    "dish_cazuela_title": "Cazuela",
    "dish_cazuela_desc": "From our Manabí Creole culture, a fish stew with a base of green plantain and peanut.",
    "dish_encocado_title": "Encocado",
    "dish_encocado_desc": "From the green province of Ecuador and across the Pacific coast, our fresh seafood in coconut sauce.",
    "dish_sango_title": "Sango de Choclo",
    "dish_sango_desc": "Comforting coastal sweet corn stew prepared with freshly grated choclo, achiote aromatics, and tender coastal shrimp.",
    "dish_bolon_title": "Bolón de Plátano",
    "dish_bolon_desc": "Giant mashed green plantain dumpling stuffed with coastal white cheese, crispy pork chicharrón, or mixto, fried golden.",
    "dish_patacones_queso_title": "Patacones con Queso",
    "dish_patacones_queso_desc": "Fried green plantains served with cheese and tartar sauce.",
    "dish_maduros_queso_title": "Maduros con Queso",
    "dish_maduros_queso_desc": "Fried ripe sweet plantain, served with fresh cheese and guava sauce.",
    "dish_pan_yuca_title": "Pan de Yuca",
    "dish_pan_yuca_desc": "Warm, cheesy baked Ecuadorian cassava rolls with crisp golden crust and light, airy chewy interior.",
    "dish_choclo_title": "Choclo Asado",
    "dish_choclo_desc": "Roasted corn served with grated cheese and salsa verde.",
    "dish_chaulafan_title": "Chaulafán",
    "dish_chaulafan_desc": "Ecuadorian wok-tossed seasoned rice packed with tender pork, chicken, shrimp, vegetables, and scrambled egg.",
    "dish_arroz_marinero_title": "Arroz Marinero",
    "dish_arroz_marinero_desc": "(TO SHARE) Sautéed with fresh Pacific seafood, our flavorful coastal seafood rice.",
    "dish_bandera_mixta_title": "Bandera Mixta",
    "dish_bandera_mixta_desc": "Rice, guatita, and cazuela.",
    "dish_bandera_completa_title": "Bandera Completa",
    "dish_bandera_completa_desc": "Guatita, cazuela, encebollado, and shrimp ceviche.",
    "dish_acompanantes_title": "Patacones, Maduros & Moros",
    "dish_acompanantes_desc": "Crispy patacones, sweet caramelized maduros, seasoned lentil moro rice, and traditional savory menestra.",
    "cocktail_nana_title": "La Ñaña",
    "cocktail_nana_desc": "Our namesake cocktail crafted with fresh maracuyá (passion fruit), premium aged rum, citrus cordial, and mint.",
    "cocktail_canelazo_title": "Canelazo Miamero",
    "cocktail_canelazo_desc": "Spiced naranjilla and cinnamon infusion balanced with cane spirits, panela reduction, and citrus zest. Served chilled.",
    "cocktail_sour_title": "Ecuadorian Sour",
    "cocktail_sour_desc": "Artisanal spirits shaken with Andean fruit reduction, fresh lime juice, egg white froth, and aromatic bitters."
}

for k, v in en_updates.items():
    en[k] = v

with open('en_keys.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)

print("Updated en_keys.json successfully.")

# 2. Update es_keys.json
with open('es_keys.json', encoding='utf-8') as f:
    es = json.load(f)

es_updates = {
    "dish_encebollado_title": "Encebollado",
    "dish_encebollado_desc": "De la comida criolla, nuestro encebollado de pescado, cebolla encurtida y nuestro consomé.",
    "dish_guatita_title": "Guatita",
    "dish_guatita_desc": "Callos guisados con patata y maní.",
    "dish_seco_title": "Seco de Pollo",
    "dish_seco_desc": "Presas de pollo braseadas a fuego lento con naranjilla, cerveza, pimientos y cilantro, servido con arroz amarillo.",
    "dish_fritada_title": "Fritada",
    "dish_fritada_desc": "Costillas de cerdo adobadas fritas, servidas con patacón y ensalada criolla.",
    "dish_churrasco_title": "Churrasco Ecuatoriano",
    "dish_churrasco_desc": "Sudado de ternera en salsa servido con arroz, patatas fritas, huevo y ensalada.",
    "dish_yapingacho_title": "Yapingacho",
    "dish_yapingacho_desc": "Cerdo asado, acompañado de tortilla de yapingacho con salsa de mani, chorizo, huevos fritos y ensalada de aguacate.",
    "dish_cazuela_title": "Cazuela",
    "dish_cazuela_desc": "De nuestra cultura criolla manabita un guiso de pescado con base de plátano macho y cacahuete.",
    "dish_encocado_title": "Encocado",
    "dish_encocado_desc": "Desde la provincia verde de Ecuador y toda la costa pacífica, nuestros mariscos en salsa de coco.",
    "dish_sango_title": "Sango de Choclo",
    "dish_sango_desc": "Guiso espeso de maíz choclo tierno aromatizado con achiote y mariscos, servido con arroz blanco y patacones.",
    "dish_bolon_title": "Bolón de Plátano",
    "dish_bolon_desc": "Bola tradicional de plátano verde frito y majado a mano con abundante queso fresco costeño o chicharrón.",
    "dish_patacones_queso_title": "Patacones con Queso",
    "dish_patacones_queso_desc": "Plátanos verdes fritos servidos con queso y salsa tártara.",
    "dish_maduros_queso_title": "Maduros con Queso",
    "dish_maduros_queso_desc": "Plátano maduro frito, servido con queso fresco y salsa de guayaba.",
    "dish_pan_yuca_title": "Pan de Yuca",
    "dish_pan_yuca_desc": "Panecillos suaves y esponjosos preparados con almidón de yuca y queso artesanal, servidos calientes.",
    "dish_choclo_title": "Choclo Asado",
    "dish_choclo_desc": "Choclo asado servido con queso rallado y salsa verde.",
    "dish_chaulafan_title": "Chaulafán",
    "dish_chaulafan_desc": "Arroz salteado al wok al estilo chifa ecuatoriano con pollo, camarones, carne de cerdo, huevo y cebollín verde.",
    "dish_arroz_marinero_title": "Arroz Marinero",
    "dish_arroz_marinero_desc": "(PARA COMPARTIR) Con los mariscos frescos del pacífico salteamos con mucho sabor nuestro arroz marinero.",
    "dish_bandera_mixta_title": "Bandera Mixta",
    "dish_bandera_mixta_desc": "Arroz, guatita, cazuela.",
    "dish_bandera_completa_title": "Bandera Completa",
    "dish_bandera_completa_desc": "Guatita, cazuela, encebollado, ceviche de gambas.",
    "dish_acompanantes_title": "Acompañantes Típicos",
    "dish_acompanantes_desc": "Patacones crocantes, maduros dulces caramelizados, arroz moro con lentejas y menestra tradicional.",
    "cocktail_nana_title": "La Ñaña (Signature)",
    "cocktail_nana_desc": "Aguardiente artesanal ecuatoriano, pulpa de maracuyá fresca, jarabe de hierba luisa y un toque cítrico balanceado.",
    "cocktail_canelazo_title": "Canelazo Miamero",
    "cocktail_canelazo_desc": "Nuestra versión fresca del clásico andino: aguardiente, infusión de canela, jugo de naranjilla natural y hielo picado.",
    "cocktail_sour_title": "Ecuadorian Sour",
    "cocktail_sour_desc": "Pisco y aguardiente macerados con fruta de la pasión, clara de huevo emulsionada, limón sutil y gotas de amargo."
}

for k, v in es_updates.items():
    es[k] = v

with open('es_keys.json', 'w', encoding='utf-8') as f:
    json.dump(es, f, ensure_ascii=False, indent=2)

print("Updated es_keys.json successfully.")

