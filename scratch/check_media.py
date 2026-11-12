import os, sys, glob, json, time
sys.stdout.reconfigure(encoding='utf-8')

# Check transcript for media
with open(r'C:\Users\Admin\.gemini\antigravity\brain\e38ac0c0-7b15-41d8-a583-dcc562d3f6f9\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
            if 'media' in obj and obj['media']:
                print('Transcript media:', obj['media'])
        except:
            pass

# Check Downloads for recent image files (modified in last 7 days)
now = time.time()
print('\nRecent files in Downloads:')
for f in os.listdir(r'c:\Users\Admin\Downloads'):
    p = os.path.join(r'c:\Users\Admin\Downloads', f)
    if os.path.isfile(p) and (now - os.path.getmtime(p) < 7*86400):
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            print(' ', f)

