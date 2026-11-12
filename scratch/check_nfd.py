import os
import unicodedata

client_dir = "assets/img/elnano client drive pics"

for root, dirs, files in os.walk(client_dir):
    for f in files:
        nfc = unicodedata.normalize('NFC', f)
        nfd = unicodedata.normalize('NFD', f)
        if f != nfc or f != nfd:
            print(f"File with accent: repr={repr(f)}")
            print(f"   is NFC: {f == nfc}, is NFD: {f == nfd}")

