import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('=== CARD 9 & 10 (lines 575-615) ===')
for i in range(575, 615):
    print(f'{i+1}: {lines[i].strip()}')

print('\n=== CARD 13 (lines 645-670) ===')
for i in range(645, 670):
    print(f'{i+1}: {lines[i].strip()}')

print('\n=== COCKTAILS 6, 7, 8 (lines 785-843) ===')
for i in range(785, 843):
    print(f'{i+1}: {lines[i].strip()}')

print('\n=== SIGNATURE DISHES 03 & 04 (lines 910-946) ===')
for i in range(910, 946):
    print(f'{i+1}: {lines[i].strip()}')

