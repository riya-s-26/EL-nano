import subprocess, os

viewports = [
    ('laptop_1200', 1200, 2200),
    ('tablet_1024', 1024, 2400),
    ('tablet_768', 768, 2800),
    ('mobile_390', 390, 3200),
    ('mobile_375', 375, 3200),
]

html_path = 'file:///' + os.path.abspath('contact.html').replace('\\', '/')

for name, w, h in viewports:
    out_img = os.path.abspath(f'scratch/{name}.png')
    cmd = [
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless',
        '--disable-gpu',
        f'--screenshot={out_img}',
        f'--window-size={w},{h}',
        '--virtual-time-budget=2000',
        html_path
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    print(f'Captured {name}: {os.path.exists(out_img)}')

print('All responsive screenshots captured!')

