with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Primary Navigation
old_nav = '''      <nav class="nav" aria-label="Primary Navigation">
        <a href="#menu" data-i18n="nav_menu">Menu</a>
        <a href="#lunch-specials" data-i18n="nav_lunch">Lunch Specials</a>
        <a href="#events" data-i18n="nav_events">Events</a>
        <a href="#story" data-i18n="nav_story">Our Story</a>
        <a href="#visit" data-i18n="nav_visit">Visit &amp; Hours</a>
      </nav>'''

new_nav = '''      <nav class="nav" aria-label="Primary Navigation">
        <a href="#menu" data-i18n="nav_menu">Menu</a>
        <a href="#lunch-specials" data-i18n="nav_lunch">Lunch Specials</a>
        <a href="#events" data-i18n="nav_events">Events</a>
        <a href="#story" data-i18n="nav_story">Our Story</a>
        <a href="#visit" data-i18n="nav_visit">Visit &amp; Hours</a>
        <a href="contact.html" data-i18n="nav_contact">Contact Us</a>
      </nav>'''

assert old_nav in html, "old_nav not found in index.html"
html = html.replace(old_nav, new_nav)

# 2. Update Mobile Drawer
old_drawer = '''    <nav aria-label="Mobile Navigation">
      <a href="#menu" data-i18n="nav_menu_full">The Menu</a>
      <a href="#lunch-specials" data-i18n="nav_lunch">Lunch Specials</a>
      <a href="#events" data-i18n="nav_events">Events &amp; Celebrations</a>
      <a href="#story" data-i18n="nav_story">Our Story</a>
      <a href="#visit" data-i18n="nav_visit">Location &amp; Hours</a>
      <a class="drawer-sublink" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="drawer_full_menu">Browse Digital Menu ↗</a>'''

new_drawer = '''    <nav aria-label="Mobile Navigation">
      <a href="#menu" data-i18n="nav_menu_full">The Menu</a>
      <a href="#lunch-specials" data-i18n="nav_lunch">Lunch Specials</a>
      <a href="#events" data-i18n="nav_events">Events &amp; Celebrations</a>
      <a href="#story" data-i18n="nav_story">Our Story</a>
      <a href="#visit" data-i18n="nav_visit">Location &amp; Hours</a>
      <a href="contact.html" data-i18n="nav_contact">Contact Us</a>
      <a class="drawer-sublink" href="https://el-nano-miami.micartaya.es" target="_blank" rel="noopener" data-i18n="drawer_full_menu">Browse Digital Menu ↗</a>'''

assert old_drawer in html, "old_drawer not found in index.html"
html = html.replace(old_drawer, new_drawer)

# 3. Update Footer Discover Column
old_foot = '''          <div class="foot-col">
            <h3 data-i18n="foot_col_discover">Discover</h3>
            <ul>
              <li><a href="#menu" data-i18n="nav_menu">The Menu</a></li>
              <li><a href="#lunch-specials" data-i18n="nav_lunch">Lunch Specials</a></li>
              <li><a href="#events" data-i18n="nav_events">Events &amp; Music</a></li>
              <li><a href="#signature-dishes" data-i18n="foot_sig_dishes">Signature Dishes</a></li>
              <li><a href="#story" data-i18n="nav_story">Our Heritage</a></li>
            </ul>
          </div>'''

new_foot = '''          <div class="foot-col">
            <h3 data-i18n="foot_col_discover">Discover</h3>
            <ul>
              <li><a href="#menu" data-i18n="nav_menu">The Menu</a></li>
              <li><a href="#lunch-specials" data-i18n="nav_lunch">Lunch Specials</a></li>
              <li><a href="#events" data-i18n="nav_events">Events &amp; Music</a></li>
              <li><a href="#signature-dishes" data-i18n="foot_sig_dishes">Signature Dishes</a></li>
              <li><a href="#story" data-i18n="nav_story">Our Heritage</a></li>
              <li><a href="contact.html" data-i18n="nav_contact">Contact Us</a></li>
            </ul>
          </div>'''

assert old_foot in html, "old_foot not found in index.html"
html = html.replace(old_foot, new_foot)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html navigation and footer successfully!")

