import sys

sys.stdout.reconfigure(encoding='utf-8')

new_css = """/* ──────────────────────────────────────────────────────────────────────────
   CONTACT US PAGE UPGRADED STYLES (MATCHING DESIGN REFERENCE MOCKUP)
   ────────────────────────────────────────────────────────────────────────── */

/* ── Hero Section ── */
.contact-hero {
  position: relative;
  background-color: var(--g);
  color: #FFFFFF;
  padding-top: var(--hh);
  padding-bottom: 52px;
  overflow: hidden;
  isolation: isolate;
  min-height: 400px;
}
.contact-hero-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 36px var(--pad) 44px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 330px;
  position: relative;
  z-index: 2;
}
.contact-hero-content {
  max-width: 480px;
  padding: 10px 0;
}
.contact-hero-kicker-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.contact-hero-dash {
  width: 22px;
  height: 2.5px;
  background-color: var(--teal);
  border-radius: 2px;
  display: inline-block;
}
.contact-hero-kicker {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--teal);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.contact-hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 4.6vw, 4.2rem);
  color: #FFFFFF;
  margin: 0 0 16px;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.contact-hero-lead {
  font-family: var(--font-body);
  font-size: clamp(0.98rem, 1.25vw, 1.2rem);
  color: rgba(250, 243, 230, 0.92);
  line-height: 1.55;
  max-width: 440px;
  margin: 0;
}
.contact-hero-visual {
  position: absolute;
  top: 0;
  right: 0;
  width: 54%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}
.contact-hero-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  display: block;
}
.contact-hero-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #003C28 0%, rgba(0, 60, 40, 0.45) 20%, transparent 45%);
  pointer-events: none;
}
.contact-hero-wave {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 60px;
  pointer-events: none;
  z-index: 3;
  line-height: 0;
}
.contact-hero-wave svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* ── Contact Main Body & Sections ── */
.contact-main-body {
  background-color: var(--cream);
  padding: 40px 0 20px;
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 5.5vw, 68px);
  overflow: hidden;
}

/* ── Row of 3 Contact Cards ── */
.contact-cards-section {
  padding: 0 var(--pad);
}
.contact-cards-grid {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.15fr 1fr 1fr;
  gap: clamp(18px, 2.5vw, 24px);
  align-items: stretch;
}

/* Card 1: Call Restaurant (Dominant Dark Green Card) */
.contact-card-call {
  background: linear-gradient(145deg, #003C28 0%, #002B1D 100%);
  border-radius: 22px;
  padding: clamp(26px, 3vw, 34px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 28px rgba(0, 60, 40, 0.18);
  border: 1px solid rgba(249, 238, 36, 0.2);
  min-height: 240px;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.contact-card-call:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(0, 60, 40, 0.26);
}
.card-call-top {
  position: relative;
  z-index: 2;
}
.card-call-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
.card-phone-icon-bubble {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--y);
  color: var(--g);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}
.card-phone-icon-bubble svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}
.card-call-title {
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 700;
  color: #FFFFFF;
}
.card-call-number {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.65rem, 2.4vw, 2.4rem);
  font-weight: 900;
  color: var(--y);
  text-decoration: none;
  letter-spacing: -0.01em;
  margin: 6px 0 18px;
  transition: color 0.2s var(--ease), transform 0.2s var(--ease);
  transform-origin: left;
}
.card-call-number:hover {
  color: #FFFFFF;
  transform: scale(1.02);
}
.card-call-bottom {
  position: relative;
  z-index: 2;
}
.btn-card-call {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--y);
  color: var(--g);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.92rem;
  padding: 10px 22px;
  border-radius: 999px;
  text-decoration: none;
  border: 1px solid transparent;
  transition: background-color 0.25s var(--ease), color 0.25s var(--ease), transform 0.2s var(--ease);
}
.btn-card-call:hover {
  background-color: #FFFFFF;
  color: var(--g);
  transform: translateY(-1px);
}
.card-leaf-watermark {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 95px;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  border-bottom-right-radius: 22px;
}
.card-leaf-watermark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Secondary & Group Cards (Off-white / Soft Cream) */
.contact-card-sub {
  background-color: var(--cream-soft);
  border: 1.5px solid var(--cream-alt);
  border-radius: 22px;
  padding: clamp(24px, 2.8vw, 32px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  min-height: 240px;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease), border-color 0.3s var(--ease);
}
.contact-card-sub:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 60, 40, 0.1);
  border-color: rgba(0, 60, 40, 0.22);
}
.card-sub-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.card-sub-icon {
  width: 38px;
  height: 38px;
  color: var(--g);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card-sub-icon svg {
  width: 28px;
  height: 28px;
  fill: currentColor;
}
.card-sub-heading {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--g);
  margin: 0;
  line-height: 1.25;
}
.card-ig-handle {
  display: block;
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--g);
  text-decoration: none;
  margin: 4px 0 6px;
  transition: color 0.2s var(--ease);
}
.card-ig-handle:hover {
  color: var(--teal);
  text-decoration: underline;
}
.card-sub-desc {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: rgba(0, 60, 40, 0.78);
  line-height: 1.48;
  margin: 0 0 18px;
}
.btn-card-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: transparent;
  color: var(--g);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.88rem;
  padding: 9px 20px;
  border-radius: 999px;
  border: 1.5px solid var(--g);
  text-decoration: none;
  transition: background-color 0.25s var(--ease), color 0.25s var(--ease), border-color 0.25s var(--ease), transform 0.2s var(--ease);
}
.btn-card-outline:hover {
  background-color: var(--g);
  color: #FFFFFF;
  border-color: var(--g);
  transform: translateY(-1px);
}

/* ── Location & Interactive Map Section ── */
.contact-location-section {
  padding: 0 var(--pad);
}
.contact-location-container {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  align-items: center;
  gap: clamp(28px, 4.5vw, 52px);
}
.contact-loc-kicker-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.contact-loc-dash {
  width: 22px;
  height: 2.5px;
  background-color: var(--teal);
  border-radius: 2px;
  display: inline-block;
}
.contact-loc-kicker {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--teal);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.contact-loc-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.4vw, 3.2rem);
  color: var(--g);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 20px;
  letter-spacing: -0.01em;
  word-wrap: break-word;
}
.contact-loc-address-wrap {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}
.contact-loc-pin-icon {
  width: 24px;
  height: 24px;
  color: var(--g);
  flex-shrink: 0;
  margin-top: 2px;
}
.contact-loc-pin-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
.contact-loc-address {
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--g);
  line-height: 1.4;
  margin: 0;
}
.contact-loc-directions-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--g);
  text-decoration: none;
  margin-top: 6px;
  transition: color 0.2s var(--ease), transform 0.2s var(--ease);
}
.contact-loc-directions-link:hover {
  color: var(--teal);
  transform: translateX(3px);
}
.contact-loc-directions-link svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
  flex-shrink: 0;
}

/* ── Interactive Leaflet Map Wrapper & Custom Branded Pin ── */
.contact-map-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  border: 1.5px solid var(--cream-alt);
  background-color: #E8ECE9;
  height: 320px;
  width: 100%;
}
.contact-map-element {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Fullscreen / Directions Button */
.contact-map-fullscreen-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 500;
  background: #FFFFFF;
  border: 1px solid var(--cream-alt);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  color: var(--g);
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}
.contact-map-fullscreen-btn:hover {
  background-color: var(--g);
  color: #FFFFFF;
  transform: scale(1.05);
}
.contact-map-fullscreen-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Custom El Ñaño Marker */
.leaflet-marker-icon.custom-el-nano-marker {
  background: transparent !important;
  border: none !important;
}
.pin-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
  cursor: pointer;
}
.pin-bubble {
  background: #003C28;
  padding: 7px 16px;
  border-radius: 14px;
  border: 1.5px solid rgba(249, 238, 36, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.pin-bubble img {
  width: 72px;
  height: 36px;
  display: block;
  object-fit: contain;
}
.pin-triangle {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 9px solid var(--y);
  margin-top: -1px;
}

/* Custom Popup Styling */
.leaflet-popup-content-wrapper {
  border-radius: 14px !important;
  padding: 4px 6px !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18) !important;
  border: 1px solid var(--cream-alt) !important;
  background: #FFFFFF !important;
}
.leaflet-popup-content {
  margin: 12px 14px !important;
  line-height: 1.4 !important;
  font-family: var(--font-body) !important;
}
.leaflet-popup-tip {
  background: #FFFFFF !important;
}

/* Leaflet Zoom Control Styling */
.leaflet-control-zoom {
  border: 1px solid var(--cream-alt) !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
  overflow: hidden;
}
.leaflet-control-zoom a {
  background-color: #FFFFFF !important;
  color: var(--g) !important;
  font-weight: 700 !important;
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
}
.leaflet-control-zoom a:hover {
  background-color: var(--cream) !important;
  color: var(--teal) !important;
}

/* ── 4-Image Photography Gallery Section ── */
.contact-gallery-section {
  padding: 0 var(--pad);
}
.contact-gallery-container {
  max-width: 1240px;
  margin: 0 auto;
}
.contact-gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(12px, 1.8vw, 20px);
}
.contact-gallery-card {
  border-radius: 18px;
  overflow: hidden;
  height: clamp(140px, 16vw, 210px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  background-color: #E6E1D8;
}
.contact-gallery-card picture,
.contact-gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s var(--ease);
}
.contact-gallery-card:hover img {
  transform: scale(1.05);
}

/* ── Quick Links Single Panel Section ── */
.contact-quicklinks-section {
  padding: 0 var(--pad);
}
.contact-quicklinks-container {
  max-width: 1240px;
  margin: 0 auto;
}
.contact-quicklinks-panel {
  background-color: var(--cream-soft);
  border: 1.5px solid var(--cream-alt);
  border-radius: 24px;
  padding: clamp(22px, 3.2vw, 36px) clamp(20px, 3.8vw, 48px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(20px, 3.5vw, 44px);
}
.quicklinks-panel-header {
  flex-shrink: 0;
}
.quicklinks-panel-title {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2vw, 1.85rem);
  color: var(--g);
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.01em;
}
.quicklinks-panel-items {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex: 1;
  gap: clamp(10px, 1.8vw, 28px);
}
.quicklink-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  text-decoration: none;
  flex: 1;
  transition: transform 0.25s var(--ease);
}
.quicklink-item:hover {
  transform: translateY(-3px);
}
.quicklink-item-icon {
  width: 32px;
  height: 32px;
  color: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s var(--ease), color 0.2s var(--ease);
}
.quicklink-item:hover .quicklink-item-icon {
  color: var(--g);
  transform: scale(1.1);
}
.quicklink-item-icon svg {
  width: 26px;
  height: 26px;
  fill: currentColor;
}
.quicklink-item-label {
  font-family: var(--font-body);
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--g);
  line-height: 1.25;
  transition: color 0.2s var(--ease);
}
.quicklink-item:hover .quicklink-item-label {
  color: var(--teal);
}

/* ── Closing Welcome Note & Corner Foliage ── */
.contact-closing-welcome {
  position: relative;
  padding: clamp(36px, 5vw, 60px) var(--pad) clamp(44px, 6vw, 76px);
  text-align: center;
  overflow: hidden;
}
.contact-closing-welcome-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(14px, 2.5vw, 28px);
  position: relative;
  z-index: 2;
  max-width: 100%;
}
.closing-yellow-line {
  width: clamp(24px, 4vw, 60px);
  height: 2.5px;
  background-color: var(--y);
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}
.closing-welcome-text {
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.8vw, 1.55rem);
  font-weight: 700;
  font-style: italic;
  color: var(--g);
  margin: 0;
}
.tropical-leaf-corner {
  position: absolute;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  width: clamp(75px, 11vw, 130px);
  height: auto;
}
.tropical-leaf-left {
  left: 0;
}
.tropical-leaf-right {
  right: 0;
}
.tropical-leaf-corner img {
  display: block;
  width: 100%;
  height: auto;
}

/* ── Responsive Breakpoints ── */
@media (max-width: 1024px) {
  .contact-hero {
    min-height: auto;
    padding-bottom: 40px;
  }
  .contact-hero-container {
    grid-template-columns: 1fr;
    gap: 24px;
    min-height: auto;
    padding-bottom: 30px;
  }
  .contact-hero-visual {
    position: relative;
    width: 100%;
    height: 280px;
    border-radius: 18px;
    margin-top: 10px;
  }
  .contact-hero-visual img {
    border-radius: 18px;
  }
  .contact-hero-fade {
    background: linear-gradient(to top, #003C28 0%, rgba(0, 60, 40, 0.45) 25%, transparent 50%);
  }
  .contact-cards-grid {
    grid-template-columns: 1fr;
  }
  .contact-location-container {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .contact-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .contact-gallery-card {
    height: 180px;
  }
  .contact-quicklinks-panel {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 24px;
  }
  .quicklinks-panel-title {
    text-align: center;
  }
  .quicklinks-panel-items {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .contact-quicklinks-panel {
    padding: 24px 18px;
  }
  .quicklinks-panel-items {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 12px;
  }
  .quicklinks-panel-items .quicklink-item:last-child {
    grid-column: 1 / -1;
  }
  .contact-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .contact-gallery-card {
    height: 130px;
  }
  .tropical-leaf-corner {
    width: 65px;
  }
  .closing-yellow-line {
    width: 18px;
  }
}

@media (max-width: 480px) {
  .contact-hero-title {
    font-size: 2.2rem;
  }
  .contact-loc-title {
    font-size: 1.7rem;
  }
  .contact-map-wrapper {
    height: 260px;
  }
  .contact-gallery-card {
    height: 110px;
  }
  .card-call-number {
    font-size: 1.6rem;
  }
  .tropical-leaf-corner {
    width: 55px;
  }
}
"""

with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

start_marker = "/* ──────────────────────────────────────────────────────────────────────────\n   CONTACT US PAGE UPGRADED STYLES"
start_idx = css_content.find("CONTACT US PAGE UPGRADED STYLES")
if start_idx == -1:
    start_idx = css_content.find("CONTACT US PAGE STYLES")
start_idx = css_content.rfind("/* ───", 0, start_idx)

end_idx = css_content.find("REDUCED MOTION")
end_idx = css_content.rfind("/* ───", 0, end_idx)

updated_css = css_content[:start_idx] + new_css + "\n" + css_content[end_idx:]

with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.write(updated_css)

print("Updated style.css with real map styles successfully!")
