import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Head
old_head = """  <link rel="preload" href="assets/fonts/PaytoneOne.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/Lexend.woff2" as="font" type="font/woff2" crossorigin>

  <link rel="stylesheet" href="assets/css/style.css?v=7.0">"""

new_head = """  <link rel="preload" href="assets/fonts/PaytoneOne.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/Lexend.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Leaflet Map CSS -->
  <link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">
  <link rel="stylesheet" href="assets/css/style.css?v=7.0">"""

if old_head in content:
    content = content.replace(old_head, new_head)
    print("1. Replaced head links.")
else:
    print("1. WARNING: old_head not found directly.")

# 2. Update Map and Gallery
old_section = """          <div class="contact-map-wrapper" id="contact-map-trigger" role="region" aria-label="Interactive map showing El Ñaño Miami at 339 Miracle Mile, Coral Gables">
            <div class="contact-map-view">
              <img class="contact-map-img" src="assets/img/contact/contact-map-graphic.png" alt="Map showing El Ñaño Miami at 339 Miracle Mile in Coral Gables" width="600" height="310" loading="lazy">
              <div class="contact-map-pin-hitbox" title="Click to open Google Maps directions"></div>
              <div class="contact-map-tooltip">El Ñaño Miami • Open Google Maps ↗</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 4-IMAGE PHOTOGRAPHY GALLERY SECTION -->
      <section class="contact-gallery-section" aria-label="Restaurant Atmosphere and Cuisine">
        <div class="contact-gallery-container">
          <div class="contact-gallery-grid">
            <div class="contact-gallery-card">
              <img src="assets/img/contact/contact-gallery-1.jpg" alt="El Ñaño Miami storefront at night on Miracle Mile" width="400" height="267" loading="lazy">
            </div>
            <div class="contact-gallery-card">
              <img src="assets/img/contact/contact-gallery-2.jpg" alt="Authentic Ecuadorian coastal ceviche bowl" width="400" height="267" loading="lazy">
            </div>
            <div class="contact-gallery-card">
              <img src="assets/img/contact/contact-gallery-3.jpg" alt="Warm interior dining room seating at El Ñaño Miami" width="400" height="267" loading="lazy">
            </div>
            <div class="contact-gallery-card">
              <img src="assets/img/contact/contact-gallery-4.jpg" alt="Handcrafted tropical signature cocktails on the bar counter" width="400" height="267" loading="lazy">
            </div>
          </div>
        </div>
      </section>"""

new_section = """          <div class="contact-map-wrapper">
            <div id="contact-map" class="contact-map-element" role="region" aria-label="Interactive map showing El Ñaño Miami at 339 Miracle Mile, Coral Gables"></div>
            <button type="button" class="contact-map-fullscreen-btn" id="map-fullscreen-btn" aria-label="Open in Google Maps" title="Open in Google Maps">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- 3. 4-IMAGE PHOTOGRAPHY GALLERY SECTION -->
      <section class="contact-gallery-section" aria-label="Restaurant Atmosphere and Cuisine">
        <div class="contact-gallery-container">
          <div class="contact-gallery-grid">
            <div class="contact-gallery-card">
              <picture>
                <source srcset="assets/img/contact/contact-gallery-1.webp" type="image/webp">
                <img src="assets/img/contact/contact-gallery-1.jpg" alt="El Ñaño Miami outdoor patio and storefront on Miracle Mile" width="400" height="267" loading="lazy">
              </picture>
            </div>
            <div class="contact-gallery-card">
              <picture>
                <source srcset="assets/img/contact/contact-gallery-2.webp" type="image/webp">
                <img src="assets/img/contact/contact-gallery-2.jpg" alt="Authentic Ecuadorian coastal Ceviche Mixto bowl" width="400" height="267" loading="lazy">
              </picture>
            </div>
            <div class="contact-gallery-card">
              <picture>
                <source srcset="assets/img/contact/contact-gallery-3.webp" type="image/webp">
                <img src="assets/img/contact/contact-gallery-3.jpg" alt="Warm interior dining room atmosphere at El Ñaño Miami" width="400" height="267" loading="lazy">
              </picture>
            </div>
            <div class="contact-gallery-card">
              <picture>
                <source srcset="assets/img/contact/contact-gallery-4.webp" type="image/webp">
                <img src="assets/img/contact/contact-gallery-4.jpg" alt="Handcrafted tropical cocktails arranged at El Ñaño bar" width="400" height="267" loading="lazy">
              </picture>
            </div>
          </div>
        </div>
      </section>"""

if old_section in content:
    content = content.replace(old_section, new_section)
    print("2. Replaced map and gallery section.")
else:
    print("2. WARNING: old_section not found directly.")

# 3. Update Footer Scripts
old_footer = """  <!-- Contact Map Interactive Click Handler -->
  <script>
    (function initContactMapTrigger() {
      var mapTrigger = document.getElementById('contact-map-trigger');
      if (!mapTrigger) return;
      mapTrigger.addEventListener('click', function () {
        window.open('https://www.google.com/maps/search/?api=1&query=El+%C3%91a%C3%B1o+339+Miracle+Mile+Coral+Gables+FL+33134', '_blank', 'noopener');
      });
    })();
  </script>

  <script src="assets/js/translations.js?v=7.0" defer></script>
  <script src="assets/js/main.js?v=7.0" defer></script>"""

new_footer = """  <!-- Leaflet Interactive Map Script -->
  <script src="assets/vendor/leaflet/leaflet.js"></script>
  <script>
    (function initContactInteractiveMap() {
      var mapEl = document.getElementById('contact-map');
      if (!mapEl || typeof L === 'undefined') return;

      var coords = [25.7497384, -80.2616234];
      var map = L.map('contact-map', {
        center: coords,
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: false
      });

      // Zoom control at bottom right to match mockup
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Esri World Street Map vector-styled tile layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> &copy; OpenStreetMap'
      }).addTo(map);

      // Branded El Ñaño Miami map pin marker
      var pinIcon = L.divIcon({
        className: 'custom-el-nano-marker',
        html: '<div class="pin-wrap"><div class="pin-bubble"><img src="assets/logo/el-nano-miami-yellow.svg" alt="El Ñaño Miami"></div><div class="pin-triangle"></div></div>',
        iconSize: [96, 56],
        iconAnchor: [48, 54],
        popupAnchor: [0, -50]
      });

      var marker = L.marker(coords, { icon: pinIcon }).addTo(map);

      var popupHtml = '<div style="text-align:center;font-family:Lexend,sans-serif;padding:2px 4px;">' +
        '<strong style="color:#003C28;font-size:15px;display:block;margin-bottom:3px;font-weight:800;">El Ñaño Miami</strong>' +
        '<span style="font-size:12px;color:#4A5568;display:block;margin-bottom:8px;line-height:1.35;">339 Miracle Mile<br>Coral Gables, FL 33134</span>' +
        '<a href="https://www.google.com/maps/search/?api=1&query=El+%C3%91a%C3%B1o+339+Miracle+Mile+Coral+Gables+FL+33134" target="_blank" rel="noopener" style="display:inline-block;background-color:#003C28;color:#FFFFFF;padding:6px 14px;border-radius:999px;font-weight:700;font-size:11px;text-decoration:none;">Get Directions ↗</a>' +
        '</div>';

      marker.bindPopup(popupHtml);

      // Fullscreen / external Google Maps button handler
      var fsBtn = document.getElementById('map-fullscreen-btn');
      if (fsBtn) {
        fsBtn.addEventListener('click', function () {
          window.open('https://www.google.com/maps/search/?api=1&query=El+%C3%91a%C3%B1o+339+Miracle+Mile+Coral+Gables+FL+33134', '_blank', 'noopener');
        });
      }
    })();
  </script>

  <script src="assets/js/translations.js?v=7.0" defer></script>
  <script src="assets/js/main.js?v=7.0" defer></script>"""

if old_footer in content:
    content = content.replace(old_footer, new_footer)
    print("3. Replaced footer script.")
else:
    print("3. WARNING: old_footer not found directly.")

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished updating contact.html!")

