with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace specifically inside dish-card--ceviche
idx = text.find('class="dish-card dish-card--ceviche"')
if idx != -1:
    end_idx = text.find('</article>', idx)
    ceviche_block = text[idx:end_idx]
    new_block = ceviche_block.replace(
        '<img src="assets/img/pics from clients/Encebollado.jpg" alt="Encebollado: albacore tuna, tender yuca, pickled red onion, and fresh herb broth"',
        '<img src="assets/img/pics from clients/Encebollado mixto.jpg" alt="Encebollado Mixto: albacore tuna, coastal shrimp, and tender yuca in aromatic citrus herb broth"'
    )
    text = text[:idx] + new_block + text[end_idx:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully restored Section 3 Dish 4 image!")
else:
    print("Could not find dish-card--ceviche")

