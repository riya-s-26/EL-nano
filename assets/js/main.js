/**
 * El Ñaño Miami — Main JavaScript
 * Interactions: Header scroll transition, mobile drawer, pinned story animation,
 * intersection reveals, and accessible keyboard navigation.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  var story = document.querySelector('.story');
  var dishes = [].slice.call(document.querySelectorAll('.dish'));
  var navBtns = [].slice.call(document.querySelectorAll('.story-nav button'));
  var parallax = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  var vh = window.innerHeight;
  var ticking = false;

  /* ── Pinned Story Mode Check ── */
  function setMode() {
    var pin = !mq.matches && window.CSS && CSS.supports('position', 'sticky') && window.innerWidth >= 800;
    root.classList.toggle('pinned', pin);
    if (story) story.style.setProperty('--n', dishes.length);
    if (!pin) {
      dishes.forEach(function (d) { d.classList.remove('on', 'seen'); });
      parallax.forEach(function (p) { p.style.transform = ''; });
    }
    update();
  }

  /* ── Intersection Observer for Content Reveals ── */
  if ('IntersectionObserver' in window && !mq.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '100px 0px 50px 0px' });

    reveals.forEach(function (el) { io.observe(el); });

    // Safety fallback: immediately reveal any elements currently near or inside viewport on mobile
    if (window.innerWidth <= 999) {
      reveals.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.5) {
          el.classList.add('in');
        }
      });
    }
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Scroll & Animation Loop ── */
  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;

    /* Header turns solid on scroll */
    if (header) {
      header.classList.toggle('solid', y > 60);
    }

    /* Pinned story section progression */
    if (story && root.classList.contains('pinned')) {
      var r = story.getBoundingClientRect();
      var span = story.offsetHeight - vh;
      var idx = -1;
      if (r.top < vh * 0.5) {
        var p = Math.min(1, Math.max(0, -r.top / span));
        idx = Math.min(dishes.length - 1, Math.floor(p * dishes.length));
      }
      dishes.forEach(function (d, i) {
        d.classList.toggle('seen', i <= idx);
        d.classList.toggle('on', i === idx);
      });
      navBtns.forEach(function (b, i) {
        b.classList.toggle('on', i === idx);
      });
    }

    /* Parallax for marked images */
    if (!mq.matches && parallax.length > 0) {
      parallax.forEach(function (el) {
        var b = el.parentNode.getBoundingClientRect();
        if (b.bottom < -100 || b.top > vh + 100) return;
        var t = b.top + b.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' + (-t * 0.08).toFixed(1) + 'px,0)';
      });
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    vh = window.innerHeight;
    setMode();
    onScroll();
  });
  if (mq.addEventListener) {
    mq.addEventListener('change', setMode);
  }

  /* ── Interactive Story Nav Buttons ── */
  navBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.getAttribute('data-go');
      var top = story.getBoundingClientRect().top + window.scrollY;
      var span = story.offsetHeight - vh;
      window.scrollTo({
        top: top + ((i + 0.5) / dishes.length) * span,
        behavior: mq.matches ? 'auto' : 'smooth'
      });
    });
  });

  /* ── Mobile Navigation Drawer ── */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (drawer) {
      if (open) {
        drawer.removeAttribute('hidden');
      } else {
        drawer.setAttribute('hidden', '');
      }
    }
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var isOpen = document.body.classList.contains('menu-open');
      setMenu(!isOpen);
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        setMenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        setMenu(false);
        burger.focus();
      }
    });

    window.matchMedia('(min-width: 800px)').addEventListener('change', function (e) {
      if (e.matches) {
        setMenu(false);
      }
    });
  }

  /* ── On-Site Menu Category Tabs Filter ── */
  var menuTabs = [].slice.call(document.querySelectorAll('.menu-tab-btn'));
  var menuCards = [].slice.call(document.querySelectorAll('.menu-card'));
  var lunchBox = document.getElementById('lunch-specials');
  var hhBox = document.getElementById('happy-hour') || document.getElementById('happy-hour-promo');

  if (menuTabs.length > 0) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var cat = tab.getAttribute('data-cat');

        // Update active tab button
        menuTabs.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', String(isActive));
        });

        // Filter cards
        if (cat === 'lunch-specials') {
          menuCards.forEach(function (c) { c.style.display = ''; });
          if (lunchBox) {
            lunchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            lunchBox.classList.add('pulse-highlight');
            setTimeout(function () { lunchBox.classList.remove('pulse-highlight'); }, 1500);
          }
        } else if (cat === 'happy-hour') {
          menuCards.forEach(function (c) {
            c.style.display = (c.getAttribute('data-cat') === 'drinks') ? '' : 'none';
          });
          if (hhBox) {
            hhBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            hhBox.classList.add('pulse-highlight');
            setTimeout(function () { hhBox.classList.remove('pulse-highlight'); }, 1500);
          }
        } else if (cat === 'all') {
          menuCards.forEach(function (c) { c.style.display = ''; });
        } else {
          menuCards.forEach(function (c) {
            var cardCat = c.getAttribute('data-cat');
            c.style.display = (cardCat === cat) ? '' : 'none';
          });
        }
      });
    });
  }

  /* ── English / Español Language Switcher ── */
  var langBtns = [].slice.call(document.querySelectorAll('.lang-btn'));

  function setLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'en';

    // Update document lang
    document.documentElement.lang = lang;

    // Update all language toggle buttons
    langBtns.forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang');
      var isActive = btnLang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Update text content across page
    if (window.I18N_DATA && window.I18N_DATA[lang]) {
      var dict = window.I18N_DATA[lang];
      var elements = [].slice.call(document.querySelectorAll('[data-i18n]'));
      elements.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
          el.innerHTML = dict[key];
        }
      });
    }

    // Persist choice in localStorage
    try {
      localStorage.setItem('el_nano_lang', lang);
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }

  // Bind click events on all language buttons (with delegation)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.lang-btn');
    if (btn) {
      e.preventDefault();
      var targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        setLanguage(targetLang);
      }
    }
  });

  // Expose for testing
  window.setWebsiteLanguage = setLanguage;

  // Initialize language from URL param (?lang=es / ?lang=en), localStorage, or default to English
  var urlParams = new URLSearchParams(window.location.search);
  var langParam = urlParams.get('lang');
  var savedLang = (langParam === 'es' || langParam === 'en') ? langParam : null;
  if (!savedLang) {
    try {
      savedLang = localStorage.getItem('el_nano_lang') || 'en';
    } catch (e) {
      savedLang = 'en';
    }
  }
  setLanguage(savedLang);

  setMode();
})();
