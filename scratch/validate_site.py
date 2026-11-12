import json
import os
import re

with open('en_keys.json', encoding='utf-8') as f:
    en = json.load(f)

with open('es_keys.json', encoding='utf-8') as f:
    es = json.load(f)

html_files = ['index.html', 'contact.html']

for hf in html_files:
    print(f"\n=================== VALIDATING {hf} ===================")
    with open(hf, encoding='utf-8') as f:
        html = f.read()

    # 1. Check all image sources
    img_srcs = re.findall(r'<img[^>]+src="([^">]+)"', html)
    print(f"Checking {len(img_srcs)} <img> tags in {hf}:")
    missing_imgs = []
    for src in img_srcs:
        clean_src = src.split('?')[0].split('#')[0]
        if not os.path.exists(clean_src):
            missing_imgs.append(clean_src)

    if missing_imgs:
        print(f"FAILED: {len(missing_imgs)} missing images:")
        for m in missing_imgs:
            print(f"   {m}")
    else:
        print(f"SUCCESS: All image paths in {hf} exist on disk!")

    # 2. Check all data-i18n keys
    i18n_keys = set(re.findall(r'data-i18n="([^">]+)"', html))
    print(f"Checking {len(i18n_keys)} unique data-i18n keys:")
    missing_en = [k for k in i18n_keys if k not in en]
    missing_es = [k for k in i18n_keys if k not in es]

    if missing_en:
        print(f"FAILED: {len(missing_en)} keys missing in en_keys.json: {missing_en}")
    else:
        print("SUCCESS: All data-i18n keys exist in en_keys.json!")

    if missing_es:
        print(f"FAILED: {len(missing_es)} keys missing in es_keys.json: {missing_es}")
    else:
        print("SUCCESS: All data-i18n keys exist in es_keys.json!")

# 3. Verify translations.js structure
with open('assets/js/translations.js', encoding='utf-8') as f:
    tjs = f.read()

if "window.I18N_DATA =" in tjs:
    print("\nSUCCESS: translations.js properly exports window.I18N_DATA!")
else:
    print("\nFAILED: translations.js missing window.I18N_DATA!")
