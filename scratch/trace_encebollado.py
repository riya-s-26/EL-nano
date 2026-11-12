import subprocess, re, sys
sys.stdout.reconfigure(encoding='utf-8')

commits = subprocess.run(['git', 'log', '--pretty=format:%h %s', 'index.html'], capture_output=True, text=True).stdout.strip().split('\n')

for line in commits:
    cid = line.split()[0]
    html = subprocess.run(['git', 'show', f'{cid}:index.html'], capture_output=True, text=True, errors='ignore').stdout
    m = re.search(r'<!-- Item: Encebollado -->\s*<article class="menu-card"[^>]*>.*?<img[^>]+src=["\']([^"\']+)["\']', html, re.DOTALL)
    print(f"{line} --> {m.group(1) if m else 'NOT FOUND'}")

