import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

images_to_check = [
    # Card 1: Encebollado
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Encebollados/Encebollado.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Encebollados/Encebollado mixto.jpg",
    # Card 2: Guatita
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Guatita.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/PNG/Guatita.png",
    # Card 3: Seco de Pollo
    "assets/img/pics from clients/Seco de Pollo.jpeg",
    # Card 4: Fritada
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Fritada.jpg",
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/PNG/Fritada.png",
    # Card 5: Churrasco Ecuatoriano
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Churrasco ecuatoriano.jpg",
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/PNG/Churrasco ecuatoriano.png",
    # Card 6: Yapingacho
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 1.jpg",
    "assets/img/elnano client drive pics/PLATOS PRINCIPALES/JPG/Yapingacho 2.jpg",
    # Card 7: Cazuela
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Cazuelas/Cazuela plátano mixta.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Cazuelas/Cazuela plátano pescado.jpg",
    # Card 8: Encocado
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Encocados/Encocado mixto.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Encocados/Encocado pescado.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Encocados/Encocado gambas.jpg",
    # Card 9: Sango de Choclo
    # Card 10: Bolon
    # Card 11: Patacones con Queso
    "assets/img/elnano client drive pics/PARA PICAR/JPG/Patacones queso.jpg",
    "assets/img/elnano client drive pics/PARA PICAR/PNG/Patacones queso.png",
    # Card 12: Maduros con Queso
    "assets/img/elnano client drive pics/PARA PICAR/JPG/Maduros queso.jpg",
    "assets/img/elnano client drive pics/PARA PICAR/PNG/Maduros queso.png",
    # Card 13: Pan de Yuca
    # Card 14: Choclo Asado
    "assets/img/elnano client drive pics/PARA PICAR/JPG/Choclo asado.jpg",
    "assets/img/elnano client drive pics/PARA PICAR/PNG/Choclo asado.png",
    # Card 15: Chaulafan
    "assets/img/elnano client drive pics/SABROSOS ARROCES/JPG/3Chaulafan.jpg",
    "assets/img/elnano client drive pics/SABROSOS ARROCES/PNG/Chaulafan.png",
    # Card 16: Arroz Marinero
    "assets/img/elnano client drive pics/SABROSOS ARROCES/JPG/2Arroz marinero.jpg",
    "assets/img/elnano client drive pics/SABROSOS ARROCES/PNG/Arroz marinero.png",
    # Card 17: Bandera Mixta
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Bandera mixta.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/PNG/Bandera mixta.png",
    # Card 18: Bandera Completa
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/JPG/Bandera completa.jpg",
    "assets/img/elnano client drive pics/COCINA CRIOLLA TRADICIONAL/PNG/Bandera completa.png",
    # Card 19: Acompanantes
    "assets/img/elnano client drive pics/RACIONES/JPG/Moros.jpg",
    "assets/img/elnano client drive pics/RACIONES/PNG/Moros.png",
    # Cards 20-22: Drinks
    "assets/img/experiences/exp-cocktails.webp",
    "assets/img/pics from clients/all drinks.png"
]

for p in images_to_check:
    if os.path.exists(p):
        with Image.open(p) as im:
            sz_bytes = os.path.getsize(p)
            print(f"EXISTS: {p}")
            print(f"   Size: {im.size}, Format: {im.format}, Mode: {im.mode}, FileSize: {sz_bytes} bytes ({sz_bytes/1024:.1f} KB)")
    else:
        print(f"MISSING: {p}")

