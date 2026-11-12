import json

with open('en_keys.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

new_en = {
    "nav_contact": "Contact Us",
    "contact_page_title": "Contact Us — El Ñaño Miami | Ecuadorian Restaurant",
    "contact_meta_desc": "Get in touch with El Ñaño Miami on Miracle Mile. Call us directly at (786) 558-5466 or message us on Instagram.",
    "contact_hero_kicker": "Get in Touch",
    "contact_hero_title": "Let’s connect.",
    "contact_hero_desc": "Have a question about visiting El Ñaño Miami? We’re happy to help.",
    "contact_phone_kicker": "Immediate Assistance",
    "contact_phone_title": "Call the Restaurant",
    "contact_phone_desc": "The fastest way to reach our hosts during operating hours for immediate questions.",
    "contact_phone_btn": "Call the Restaurant",
    "contact_ig_kicker": "Social & Messages",
    "contact_ig_title": "Instagram",
    "contact_ig_desc": "Follow along or send us a message.",
    "contact_ig_btn": "Message us on Instagram",
    "contact_group_kicker": "Special Occasions",
    "contact_group_title": "Planning a group visit?",
    "contact_group_desc": "Have a question about a group visit or celebration? Get in touch with us.",
    "contact_group_btn": "Ask About Group Visits",
    "contact_links_title": "Looking for something specific?",
    "contact_link_menu_title": "Browse food & drinks",
    "contact_link_menu_desc": "View our on-site specialties and full digital catalog.",
    "contact_link_reserve_title": "Book a table",
    "contact_link_reserve_desc": "Reserve your spot online instantly via SevenRooms.",
    "contact_link_hours_title": "Hours & directions",
    "contact_link_hours_desc": "Find us at 339 Miracle Mile in Coral Gables.",
    "contact_link_events_title": "Live music & events",
    "contact_link_events_desc": "Check upcoming Latin music nights and celebrations.",
    "contact_link_delivery_title": "Order delivery",
    "contact_link_delivery_desc": "Order authentic Ecuadorian favorites on Uber Eats and DoorDash.",
    "contact_closing_text": "We look forward to welcoming you."
}

for k, v in new_en.items():
    en[k] = v

with open('en_keys.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)

print(f"Updated en_keys.json, total keys: {len(en)}")

