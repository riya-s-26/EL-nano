/**
 * El Ñaño Miami — About Us Page Interactions
 * Handles: Language toggle (EN/ES), mobile drawer navigation,
 * IntersectionObserver reveals, and smooth scrolling for anchors.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));

  /* ── 1. Intersection Observer for Restrained Section Reveals ── */
  if ('IntersectionObserver' in window && !mq.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── 2. Header Scroll Effect ── */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 3. Mobile Navigation Drawer ── */
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

  /* ── 4. Language Switcher (EN / ES) ── */
  var langBtns = [].slice.call(document.querySelectorAll('.lang-btn'));

  function setLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'en';
    root.lang = lang;

    langBtns.forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang');
      var isActive = btnLang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

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

    try {
      localStorage.setItem('el_nano_lang', lang);
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }

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

  // Initialize language from URL param or localStorage
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

  /* ── 5. Smooth Scroll for Anchor Links with Header Offset ── */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      var hash = anchor.getAttribute('href');
      if (hash === '#' || hash === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: mq.matches ? 'auto' : 'smooth' });
        return;
      }
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        var headerOffset = 90;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: mq.matches ? 'auto' : 'smooth'
        });
      }
    }
  });

})();
