with open('build_translations.py', 'r', encoding='utf-8') as f:
    content = f.read()

target = '  "foot_copy": "&copy; 2026 El Ñaño Miami. Todos los derechos reservados. 339 Miracle Mile, Coral Gables, FL 33134."'

replacement = '''  "foot_copy": "&copy; 2026 El Ñaño Miami. Todos los derechos reservados. 339 Miracle Mile, Coral Gables, FL 33134.",

  # Manabí tag
  "tag_manabi": "Herencia Manabita",

  # Contact Page & Navigation
  "nav_contact": "Contáctanos",
  "contact_page_title": "Contáctanos — El Ñaño Miami | Restaurante Ecuatoriano",
  "contact_meta_desc": "Información de contacto de El Ñaño Miami en Miracle Mile. Llámanos directamente al (786) 558-5466 o escríbenos por Instagram.",
  "contact_hero_kicker": "Contacto Directo",
  "contact_hero_title": "Conectemos.",
  "contact_hero_desc": "¿Tienes alguna pregunta sobre tu visita a El Ñaño Miami? Estamos aquí para ayudarte.",
  "contact_phone_kicker": "Atención Inmediata",
  "contact_phone_title": "Llamar al Restaurante",
  "contact_phone_desc": "La forma más rápida de comunicarte con nuestro equipo durante horarios de servicio.",
  "contact_phone_btn": "Llamar al Restaurante",
  "contact_ig_kicker": "Redes y Mensajes",
  "contact_ig_title": "Instagram",
  "contact_ig_desc": "Síguenos o escríbenos.",
  "contact_ig_btn": "Escríbenos por Instagram",
  "contact_group_kicker": "Ocasiones Especiales",
  "contact_group_title": "¿Planeas una visita en grupo?",
  "contact_group_desc": "¿Tienes alguna pregunta sobre una visita en grupo o celebración? Comunícate con nosotros.",
  "contact_group_btn": "Consultar sobre visitas en grupo",
  "contact_links_title": "¿Buscas algo en particular?",
  "contact_link_menu_title": "Explorar comida y bebidas",
  "contact_link_menu_desc": "Descubre nuestros platos típicos y la carta digital completa.",
  "contact_link_reserve_title": "Reservar una mesa",
  "contact_link_reserve_desc": "Asegura tu mesa en línea al instante con SevenRooms.",
  "contact_link_hours_title": "Horarios y cómo llegar",
  "contact_link_hours_desc": "Encuéntranos en 339 Miracle Mile, Coral Gables.",
  "contact_link_events_title": "Música en vivo y eventos",
  "contact_link_events_desc": "Conoce las próximas noches latinas y celebraciones.",
  "contact_link_delivery_title": "Pedir a domicilio",
  "contact_link_delivery_desc": "Pide tus platos ecuatorianos favoritos por Uber Eats y DoorDash.",
  "contact_closing_text": "Esperamos darte la bienvenida."'''

assert target in content, "Target not found in build_translations.py"
content = content.replace(target, replacement)

with open('build_translations.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated build_translations.py successfully!")
