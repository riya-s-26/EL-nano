import json

with open('en_keys.json', encoding='utf-8') as f:
    en = json.load(f)

with open('es_keys.json', encoding='utf-8') as f:
    es = json.load(f)

dish_keys = [
    'dish_encebollado_title', 'dish_encebollado_desc',
    'dish_guatita_title', 'dish_guatita_desc',
    'dish_seco_title', 'dish_seco_desc',
    'dish_fritada_title', 'dish_fritada_desc',
    'dish_churrasco_title', 'dish_churrasco_desc',
    'dish_yapingacho_title', 'dish_yapingacho_desc',
    'dish_cazuela_title', 'dish_cazuela_desc',
    'dish_encocado_title', 'dish_encocado_desc',
    'dish_sango_title', 'dish_sango_desc',
    'dish_bolon_title', 'dish_bolon_desc',
    'dish_patacones_queso_title', 'dish_patacones_queso_desc',
    'dish_maduros_queso_title', 'dish_maduros_queso_desc',
    'dish_pan_yuca_title', 'dish_pan_yuca_desc',
    'dish_choclo_title', 'dish_choclo_desc',
    'dish_chaulafan_title', 'dish_chaulafan_desc',
    'dish_arroz_marinero_title', 'dish_arroz_marinero_desc',
    'dish_bandera_mixta_title', 'dish_bandera_mixta_desc',
    'dish_bandera_completa_title', 'dish_bandera_completa_desc',
    'dish_acompanantes_title', 'dish_acompanantes_desc',
    'cocktail_nana_title', 'cocktail_nana_desc',
    'cocktail_canelazo_title', 'cocktail_canelazo_desc',
    'cocktail_sour_title', 'cocktail_sour_desc',
]

for k in dish_keys:
    print(f"KEY: {k}")
    print(f"  EN: {en.get(k)}")
    print(f"  ES: {es.get(k)}")
    print()

