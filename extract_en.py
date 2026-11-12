import re, json
from html.parser import HTMLParser

class I18nParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current_key = None
        self.depth = 0
        self.buffer = []
        self.result = {}

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if 'data-i18n' in attr_dict:
            self.current_key = attr_dict['data-i18n']
            self.depth = 1
            self.buffer = []
        elif self.current_key is not None:
            self.depth += 1
            # Reconstruct tag
            attr_str = ''.join([f' {k}="{v}"' if v is not None else f' {k}' for k, v in attrs])
            self.buffer.append(f'<{tag}{attr_str}>')

    def handle_endtag(self, tag):
        if self.current_key is not None:
            self.depth -= 1
            if self.depth == 0:
                self.result[self.current_key] = ''.join(self.buffer).strip()
                self.current_key = None
            else:
                self.buffer.append(f'</{tag}>')

    def handle_data(self, data):
        if self.current_key is not None:
            self.buffer.append(data)

    def handle_entityref(self, name):
        if self.current_key is not None:
            self.buffer.append(f'&{name};')

    def handle_charref(self, name):
        if self.current_key is not None:
            self.buffer.append(f'&#{name};')

parser = I18nParser()
with open('index.html', encoding='utf-8') as f:
    parser.feed(f.read())

print(f"Extracted {len(parser.result)} keys for English")
with open('en_keys.json', 'w', encoding='utf-8') as f:
    json.dump(parser.result, f, ensure_ascii=False, indent=2)
print("Saved en_keys.json")
