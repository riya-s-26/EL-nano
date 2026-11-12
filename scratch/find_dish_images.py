import os
import sys
import unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

def strip_accents(text):
    return ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn').lower()

img_dir = Path("assets/img/elnano client drive pics")
all_files = []
for root, dirs, files in os.walk(img_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            full_path = os.path.join(root, f)
            rel_from_root = os.path.relpath(full_path, ".").replace("\\", "/")
            all_files.append({
                'filename': f,
                'path': rel_from_root,
                'clean_name': strip_accents(Path(f).stem),
                'folder': os.path.basename(root)
            })

dishes_to_test = [
    ("Encebollado", ["encebollado"]),
    ("Guatita", ["guatita"]),
    ("Seco de Pollo", ["seco"]),
    ("Fritada", ["fritada"]),
    ("Churrasco Ecuatoriano", ["churrasco"]),
    ("Yapingacho", ["yapingacho", "llapingacho"]),
    ("Cazuela", ["cazuela"]),
    ("Encocado", ["encocado"]),
    ("Sango de Choclo / Cazuela 2", ["sango", "choclo"]),
    ("Bolon de Platano", ["bolon", "verde"]),
    ("Patacones con Queso", ["patacon"]),
    ("Maduros con Queso", ["maduro"]),
    ("Pan de Yuca", ["yuca"]),
    ("Choclo Asado", ["choclo"]),
    ("Chaulafan", ["chaulafan"]),
    ("Arroz Marinero", ["marinero"]),
    ("Bandera Mixta", ["bandera mixta", "bandera"]),
    ("Bandera Completa", ["bandera completa", "bandera"]),
    ("Acompanantes (Moros/Menestra/Patacones)", ["moro", "menestra", "acompan"]),
    ("La Nana", ["nana", "cocktail", "bebida"]),
    ("Canelazo Miamero", ["canelazo"]),
    ("Ecuadorian Sour", ["sour"]),
    ("Camarones Reventados", ["camaron", "reventado"])
]

for dname, keys in dishes_to_test:
    clean_keys = [strip_accents(k) for k in keys]
    matches = [f for f in all_files if any(k in f['clean_name'] for k in clean_keys)]
    print(f"\n==========================================")
    print(f"Dish: {dname}")
    print(f"Matches count: {len(matches)}")
    for m in matches:
        print(f"   [{m['folder']}] {m['path']}")

