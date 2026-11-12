import subprocess, os

with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add script to switch to ES
es_html = html.replace('</body>', '<script>window.addEventListener("load", function() { if (window.setWebsiteLanguage) window.setWebsiteLanguage("es"); });</script></body>')

with open('scratch/contact_es.html', 'w', encoding='utf-8') as f:
    f.write(es_html)

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--disable-gpu',
    '--screenshot=' + os.path.abspath('scratch/screenshot_es.png'),
    '--window-size=1440,2400',
    '--virtual-time-budget=2000',
    'file:///' + os.path.abspath('scratch/contact_es.html').replace('\\', '/')
]
res = subprocess.run(cmd, capture_output=True, text=True)
print('ES screenshot generated:', os.path.exists('scratch/screenshot_es.png'))

