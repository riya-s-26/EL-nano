import subprocess

commits = ['6762300', '6055960', 'cf3eb05', '935a125']
for c in commits:
    out = subprocess.check_output(['git', 'show', '--stat', c], text=True, encoding='utf-8')
    print(f"=== COMMIT {c} ===")
    print(out)

