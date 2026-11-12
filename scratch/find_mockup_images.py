import os, sys
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

# Mockup gallery is at y in [665, 835] of mockup
mockup = Image.open('C:/Users/Admin/.gemini/antigravity/brain/e38ac0c0-7b15-41d8-a583-dcc562d3f6f9/.user_uploaded/media_1793444033566_8285367a.jpg')
mw, mh = mockup.size

# Let's crop each of the 4 gallery cards from the mockup
# In mockup, the 4 cards are equally distributed across width
g_top = int(mh * 0.67)
g_bot = int(mh * 0.83)

card1 = mockup.crop((int(mw * 0.02), g_top, int(mw * 0.25), g_bot))
card2 = mockup.crop((int(mw * 0.26), g_top, int(mw * 0.49), g_bot))
card3 = mockup.crop((int(mw * 0.50), g_top, int(mw * 0.73), g_bot))
card4 = mockup.crop((int(mw * 0.74), g_top, int(mw * 0.98), g_bot))

card1.save('scratch/gal_card1_mockup.jpg')
card2.save('scratch/gal_card2_mockup.jpg')
card3.save('scratch/gal_card3_mockup.jpg')
card4.save('scratch/gal_card4_mockup.jpg')

print("Cropped individual gallery cards from mockup!")

# Now let's search for matches for card2 (ceviche) and card4 (cocktails)
candidates = []
for root, dirs, files in os.walk('assets/img'):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            candidates.append(os.path.join(root, f))

print(f"Total image candidates: {len(candidates)}")

def color_dist(im1, im2_path):
    try:
        im2 = Image.open(im2_path).convert('RGB')
        im2_res = im2.resize(im1.size)
        a1 = np.array(im1.convert('RGB'), dtype=float)
        a2 = np.array(im2_res, dtype=float)
        return np.mean(np.abs(a1 - a2))
    except:
        return 999999

# Find closest for card2
scores2 = [(color_dist(card2, c), c) for c in candidates if 'ceviche' in c.lower() or 'deliciosos' in c.lower() or 'encebollado' in c.lower()]
scores2.sort()
print("\nTop matches for Card 2 (Ceviche):")
for s, c in scores2[:5]:
    print(f"  {s:.2f}: {c}")

# Find closest for card4 (Cocktails)
scores4 = [(color_dist(card4, c), c) for c in candidates if 'bebidas' in c.lower() or 'bar' in c.lower() or 'cocktail' in c.lower() or 'pina' in c.lower() or 'canelazo' in c.lower() or 'exp-cocktails' in c.lower()]
scores4.sort()
print("\nTop matches for Card 4 (Cocktails):")
for s, c in scores4[:5]:
    print(f"  {s:.2f}: {c}")

# Also check all candidates for card 4
scores4_all = [(color_dist(card4, c), c) for c in candidates]
scores4_all.sort()
print("\nTop matches across ALL images for Card 4:")
for s, c in scores4_all[:5]:
    print(f"  {s:.2f}: {c}")

# Check hero match
hero_mockup = mockup.crop((int(mw * 0.45), int(mh * 0.04), int(mw * 0.98), int(mh * 0.24)))
scores_hero = [(color_dist(hero_mockup, c), c) for c in candidates]
scores_hero.sort()
print("\nTop matches for Hero:")
for s, c in scores_hero[:5]:
    print(f"  {s:.2f}: {c}")

