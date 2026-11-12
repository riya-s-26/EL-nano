import os
import shutil
import hashlib

src_base = "assets/img/elnano client drive pics"
dest_base = "assets/img/pics from clients"

copies = [
    ("COCINA CRIOLLA TRADICIONAL/JPG/Encebollados/Encebollado.jpg", "Encebollado.jpg"),
    ("COCINA CRIOLLA TRADICIONAL/JPG/Guatita.jpg", "Guatita.jpg"),
    ("PLATOS PRINCIPALES/JPG/Churrasco ecuatoriano.jpg", "Churrasco ecuatoriano.jpg"),
    ("COCINA CRIOLLA TRADICIONAL/JPG/Encocados/Encocado mixto.jpg", "Encocado mixto.jpg"),
    ("PARA PICAR/JPG/Patacones queso.jpg", "Patacones queso.jpg"),
    ("PARA PICAR/JPG/Maduros queso.jpg", "Maduros queso.jpg"),
    ("PARA PICAR/JPG/Choclo asado.jpg", "Choclo asado.jpg"),
    ("COCINA CRIOLLA TRADICIONAL/JPG/Bandera mixta.jpg", "Bandera mixta.jpg"),
    ("COCINA CRIOLLA TRADICIONAL/JPG/Bandera completa.jpg", "Bandera completa.jpg"),
    ("COCINA CRIOLLA TRADICIONAL/JPG/Cazuelas/Cazuela plátano mixta.jpg", "Cazuela platano mixta.jpg"),
]

for rel_src, dest_name in copies:
    src_path = os.path.join(src_base, rel_src)
    dest_path = os.path.join(dest_base, dest_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        sz = os.path.getsize(dest_path)
        with open(dest_path, 'rb') as f:
            h = hashlib.md5(f.read()).hexdigest()
        print(f"Copied {rel_src} -> {dest_name} ({sz} bytes, md5={h})")
    else:
        print(f"ERROR: {src_path} does not exist!")

