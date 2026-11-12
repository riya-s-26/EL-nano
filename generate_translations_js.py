import json

with open('en_keys.json', encoding='utf-8') as f:
    en = json.load(f)

with open('es_keys.json', encoding='utf-8') as f:
    es = json.load(f)

js_content = f"""/**
 * El Ñaño Miami — Language Translations Dictionary (EN / ES)
 * Sourced from official restaurant menu, authentic Ecuadorian culinary terminology,
 * and verified client instructions.
 */
window.I18N_DATA = {{
  en: {json.dumps(en, ensure_ascii=False, indent=2)},
  es: {json.dumps(es, ensure_ascii=False, indent=2)}
}};
"""

with open('assets/js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Created assets/js/translations.js successfully!")
