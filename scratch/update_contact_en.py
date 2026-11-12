import json

with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

updates_en = {
    "contact_hero_kicker": "GET IN TOUCH",
    "contact_hero_title": "Let’s connect.",
    "contact_hero_desc": "Have a question about visiting El Ñaño Miami? We’re happy to help.",
    "contact_phone_title": "Call the Restaurant",
    "contact_phone_btn": "Call the Restaurant →",
    "contact_ig_title": "Message us on Instagram",
    "contact_ig_desc": "Follow along or send us a message.",
    "contact_ig_btn": "Message on Instagram ↗",
    "contact_group_title": "Planning a group visit?",
    "contact_group_desc": "Have a question about a group visit or celebration? Get in touch with us.",
    "contact_group_btn": "Ask About Group Visits →",
    "contact_loc_kicker": "OUR LOCATION",
    "contact_loc_title": "Find Us in Coral Gables",
    "contact_loc_directions": "Get Directions on Google Maps ↗",
    "contact_links_title": "Looking for<br>something specific?",
    "contact_link_menu": "Menu ↗",
    "contact_link_reserve": "Reserve<br>a Table ↗",
    "contact_link_hours": "Hours &<br>Directions ↗",
    "contact_link_events": "Live Music<br>& Events ↗",
    "contact_link_delivery": "Order<br>Delivery ↗",
    "contact_closing_text": "We look forward to welcoming you."
}

for k, v in updates_en.items():
    en[k] = v

with open('en_keys.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)

print("Updated en_keys.json successfully! Total keys:", len(en))

