import urllib.request, os

providers = [
    ('OSM_Standard', 'https://tile.openstreetmap.org/16/18157/27530.png'),
    ('OSM_Hot', 'https://a.tile.openstreetmap.fr/hot/16/18157/27530.png'),
    ('Esri_WorldStreetMap', 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/16/27530/18157'),
    ('Esri_TopoMap', 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/16/27530/18157'),
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for name, url in providers:
    req = urllib.request.Request(url, headers=headers)
    try:
        res = urllib.request.urlopen(req)
        data = res.read()
        print(f'{name:20s}: status {res.status}, length {len(data)} bytes')
        with open(f'scratch/test_{name}.png', 'wb') as f:
            f.write(data)
    except Exception as e:
        print(f'{name:20s}: ERROR - {e}')

