import subprocess, re, sys
sys.stdout.reconfigure(encoding='utf-8')

commits = subprocess.run(['git', 'rev-list', '--all', 'index.html'], capture_output=True, text=True).stdout.strip().split()

print(f"Total commits touching index.html: {len(commits)}")
for c in commits:
    msg = subprocess.run(['git', 'log', '-1', '--pretty=%h %cd %s', '--date=short', c], capture_output=True, text=True).stdout.strip()
    content = subprocess.run(['git', 'show', f'{c}:index.html'], capture_output=True, text=True, errors='ignore').stdout
    idx = content.find('menu-grid')
    if idx != -1:
        card_idx = content.find('Item: Encebollado', idx)
        if card_idx == -1:
            card_idx = content.find('Encebollado', idx)
        if card_idx != -1:
            snippet = content[card_idx:card_idx+400]
            m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', snippet)
            src = m.group(1) if m else 'None'
            print(f"{msg} -> {src}")

