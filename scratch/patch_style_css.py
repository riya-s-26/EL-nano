with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Add active state for nav links
target1 = '''.nav a:hover::after {
  width: 100%;
}'''

replacement1 = '''.nav a:hover::after {
  width: 100%;
}
.nav a.active {
  color: var(--y);
}
.nav a.active::after {
  width: 100%;
}'''

assert target1 in css, "target1 not found in style.css"
css = css.replace(target1, replacement1)

# 2. Add header nav breathing room between 800px and 1100px
target2 = '/* Laptop / Small Desktop (<= 1200px) */'
replacement2 = '''/* Nav adjustment for 6 links between 800px and 1100px */
@media (max-width: 1100px) and (min-width: 800px) {
  .bar {
    gap: 12px;
  }
  .nav {
    gap: clamp(10px, 1.4vw, 18px);
  }
  .nav a {
    font-size: 0.88rem;
  }
}

/* Laptop / Small Desktop (<= 1200px) */'''

assert target2 in css, "target2 not found in style.css"
css = css.replace(target2, replacement2)

# 3. Add Contact Page styles before REDUCED MOTION
target3 = '/* ──────────────────────────────────────────────────────────────────────────\n   REDUCED MOTION'
if target3 not in css:
    # Try with CRLF
    target3 = '/* ──────────────────────────────────────────────────────────────────────────\r\n   REDUCED MOTION'

contact_css = '''/* ──────────────────────────────────────────────────────────────────────────
   CONTACT US PAGE STYLES
   ────────────────────────────────────────────────────────────────────────── */
.contact-hero {
  position: relative;
  background-color: var(--g-deep);
  color: #FFFFFF;
  padding-top: calc(var(--hh) + clamp(36px, 6vw, 64px));
  padding-bottom: clamp(40px, 6vw, 68px);
  text-align: center;
  overflow: hidden;
  isolation: isolate;
}
.contact-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(circle at 50% 25%, rgba(7, 75, 52, 0.45) 0%, rgba(0, 39, 26, 0.95) 100%);
  pointer-events: none;
}
.contact-hero-wrap {
  max-width: 760px;
  margin: 0 auto;
  padding-inline: var(--pad);
}
.contact-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  color: var(--y);
  margin: 12px 0 16px;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.contact-hero p.lead {
  font-family: var(--font-body);
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  color: rgba(250, 243, 230, 0.9);
  line-height: 1.6;
  margin: 0 auto;
  max-width: 620px;
}

/* Contact Main Area */
.contact-main {
  background-color: var(--cream);
  padding: clamp(40px, 6vw, 72px) var(--pad);
}
.contact-container {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4.5vw, 48px);
}

/* Section B: Primary Phone Card */
.contact-primary-card {
  background: linear-gradient(145deg, #003C28 0%, #00271A 100%);
  color: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: clamp(32px, 4.5vw, 52px);
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(249, 238, 36, 0.28);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.contact-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(249, 238, 36, 0.16);
  color: var(--y);
  border: 1px solid rgba(249, 238, 36, 0.35);
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
}
.contact-primary-card h2 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  color: #FFFFFF;
  margin: 0 0 10px;
}
.contact-primary-card p {
  font-family: var(--font-body);
  font-size: clamp(0.98rem, 1.2vw, 1.1rem);
  color: rgba(250, 243, 230, 0.85);
  max-width: 540px;
  line-height: 1.55;
  margin: 0 0 24px;
}
.contact-phone-display {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-body);
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 800;
  color: var(--y);
  text-decoration: none;
  letter-spacing: 0.02em;
  margin-bottom: 24px;
  transition: transform 0.25s var(--ease), color 0.25s var(--ease);
}
.contact-phone-display:hover {
  color: #FFFFFF;
  transform: scale(1.03);
}
.contact-phone-display svg {
  width: clamp(28px, 3.2vw, 36px);
  height: clamp(28px, 3.2vw, 36px);
  fill: currentColor;
  flex-shrink: 0;
}
.contact-call-btn {
  font-size: 1.05rem;
  min-height: 52px;
  padding: 0 36px;
}

/* Secondary & Group Grid */
.contact-secondary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(20px, 3vw, 32px);
}
@media (max-width: 768px) {
  .contact-secondary-grid {
    grid-template-columns: 1fr;
  }
}

/* Secondary & Group Cards */
.contact-card {
  background-color: var(--cream-soft);
  border: 1px solid var(--cream-alt);
  border-radius: var(--radius-md);
  padding: clamp(24px, 3.2vw, 36px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease), border-color 0.3s var(--ease);
}
.contact-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(0, 60, 40, 0.2);
}
.contact-card .card-top {
  margin-bottom: 24px;
}
.contact-card .card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.contact-card .card-icon.ig-icon {
  background: rgba(0, 60, 40, 0.08);
  color: var(--g);
}
.contact-card .card-icon.group-icon {
  background: rgba(50, 180, 166, 0.12);
  color: var(--teal);
}
.contact-card .card-icon svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
.contact-card h3 {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2vw, 1.55rem);
  color: var(--g);
  margin: 0 0 8px;
}
.contact-card p {
  font-family: var(--font-body);
  font-size: 0.96rem;
  color: rgba(0, 60, 40, 0.78);
  line-height: 1.5;
  margin: 0;
}
.contact-ig-handle {
  display: inline-block;
  font-weight: 700;
  color: var(--teal);
  margin-top: 8px;
  font-size: 0.95rem;
  text-decoration: none;
}
.contact-ig-handle:hover {
  text-decoration: underline;
}
.contact-card .btn {
  width: 100%;
}

/* Section E: Quick Links */
.contact-quicklinks {
  background-color: #FAF3E6;
  border-top: 1px solid var(--cream-alt);
  padding: clamp(48px, 6vw, 76px) var(--pad);
}
.contact-quicklinks-wrap {
  max-width: 1080px;
  margin: 0 auto;
}
.contact-quicklinks-head {
  text-align: center;
  margin-bottom: clamp(28px, 4vw, 44px);
}
.contact-quicklinks-head h2 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.4vw, 2.5rem);
  color: var(--g);
  margin: 0 0 10px;
}
.contact-quicklinks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(16px, 2vw, 24px);
}
.quicklink-card {
  background-color: var(--cream-soft);
  border: 1px solid var(--cream-alt);
  border-radius: var(--radius-sm);
  padding: 24px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease), border-color 0.25s var(--ease);
}
.quicklink-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: rgba(0, 60, 40, 0.22);
}
.quicklink-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.quicklink-card h3 {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--g);
  margin: 0;
}
.quicklink-card .quicklink-arrow {
  color: var(--g);
  font-size: 1.15rem;
  font-weight: 800;
  transition: transform 0.2s var(--ease), color 0.2s var(--ease);
}
.quicklink-card:hover .quicklink-arrow {
  transform: translateX(4px);
  color: var(--teal);
}
.quicklink-card p {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: rgba(0, 60, 40, 0.72);
  line-height: 1.5;
  margin: 0;
}
.quicklink-sublinks {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px dashed rgba(0, 60, 40, 0.12);
}
.quicklink-sublinks a {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--teal);
  text-decoration: underline;
  transition: color 0.2s;
}
.quicklink-sublinks a:hover {
  color: var(--g);
}

/* Section F: Closing Message */
.contact-closing {
  background-color: var(--cream);
  text-align: center;
  padding: clamp(32px, 4vw, 52px) var(--pad);
  border-top: 1px solid rgba(0, 60, 40, 0.08);
}
.contact-closing-wrap {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.contact-closing-accent {
  width: 36px;
  height: 3px;
  background-color: var(--y);
  border-radius: 2px;
}
.contact-closing p {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  color: var(--g);
  margin: 0;
}

'''

assert target3 in css, "target3 not found in style.css"
css = css.replace(target3, contact_css + target3)

with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated assets/css/style.css successfully!")

