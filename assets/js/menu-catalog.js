/**
 * El Ñaño Miami — Menu Catalog Interactive Script
 * - Category filter pills with active centering
 * - Default 'All' view showcases top 6 featured dishes (matching approved client mockup)
 * - 'Explore Full Menu' reveals complete catalog of all items
 * - Smooth scroll handlers for Hero & CTA buttons
 * - Signature circular dish quick-links
 */
(function () {
  'use strict';

  var catNav = document.getElementById('mc-cat-nav');
  var scroller = document.getElementById('mc-cat-scroller');
  var pills = [].slice.call(document.querySelectorAll('.mc-cat-pill'));
  var cards = [].slice.call(document.querySelectorAll('.mc-dish-card[data-cat]'));
  var mainSection = document.getElementById('menu-catalog-main');
  var exploreFullBtn = document.getElementById('mc-filter-all-btn');
  var sigDiscoverBtn = document.getElementById('mc-sig-discover-btn');
  var filterDrinksBtn = document.getElementById('mc-filter-drinks-btn');

  var isFullExpanded = false;

  // Calculate sticky offset for smooth scroll
  function getStickyOffset() {
    var hh = 76;
    var navH = catNav ? catNav.offsetHeight : 54;
    return hh + navH + 16;
  }

  // Smooth scroll to an element with sticky nav offset
  function scrollToElement(el) {
    if (!el) return;
    var offset = getStickyOffset();
    var targetY = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }

  // Center active pill in horizontal scroller
  function centerPill(pill) {
    if (!scroller || !pill) return;
    var pillLeft = pill.offsetLeft;
    var pillWidth = pill.offsetWidth;
    var scrollerWidth = scroller.offsetWidth;
    var targetScroll = pillLeft - (scrollerWidth / 2) + (pillWidth / 2);
    scroller.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth'
    });
  }

  // Filter cards by category
  function filterCategory(catSlug, triggerScroll, forceExpandAll) {
    // Update active pill
    pills.forEach(function (p) {
      var isMatch = p.getAttribute('data-cat') === catSlug;
      p.classList.toggle('active', isMatch);
      if (isMatch) centerPill(p);
    });

    if (forceExpandAll) {
      isFullExpanded = true;
    }

    // Show/hide cards
    cards.forEach(function (card) {
      var cardCat = card.getAttribute('data-cat');
      var isFeatured = card.getAttribute('data-featured') === 'true';

      if (catSlug === 'all') {
        if (isFullExpanded) {
          card.classList.remove('is-hidden');
        } else {
          // Default curated overview matching approved client mockup
          if (isFeatured) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        }
      } else {
        if (cardCat === catSlug) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      }
    });

    // Update button text if toggling
    if (exploreFullBtn) {
      var btnSpan = exploreFullBtn.querySelector('span');
      if (btnSpan) {
        if (catSlug === 'all' && isFullExpanded) {
          btnSpan.textContent = (window.currentLang === 'es') ? 'Ver Destacados' : 'Show Featured';
        } else {
          btnSpan.textContent = (window.currentLang === 'es') ? 'Ver Todo el Menú' : 'Explore Full Menu';
        }
      }
    }

    if (triggerScroll && mainSection) {
      scrollToElement(mainSection);
    }
  }

  // Wire up category pills
  pills.forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      var cat = pill.getAttribute('data-cat') || 'all';
      if (cat !== 'all') {
        isFullExpanded = false;
      }
      filterCategory(cat, false, false);
    });
  });

  // Explore Full Menu button in sidebar
  if (exploreFullBtn) {
    exploreFullBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isFullExpanded) {
        isFullExpanded = false;
        filterCategory('all', true, false);
      } else {
        filterCategory('all', true, true);
      }
    });
  }

  // Signature Discover More button
  if (sigDiscoverBtn) {
    sigDiscoverBtn.addEventListener('click', function (e) {
      e.preventDefault();
      filterCategory('clasicos', true, false);
    });
  }

  // Explore Drinks & Desserts button
  if (filterDrinksBtn) {
    filterDrinksBtn.addEventListener('click', function (e) {
      e.preventDefault();
      filterCategory('sangrias', true, false);
    });
  }

  // Signature Circular Dish quick-links
  var circleItems = [].slice.call(document.querySelectorAll('.mc-circle-item'));
  circleItems.forEach(function (item) {
    item.addEventListener('click', function () {
      filterCategory('clasicos', true, false);
    });
  });

  // Hero "Explore Our Menu" anchor smooth scroll
  var heroExploreLink = document.querySelector('.mc-btn-hero');
  if (heroExploreLink) {
    heroExploreLink.addEventListener('click', function (e) {
      var href = heroExploreLink.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) scrollToElement(target);
      }
    });
  }

  // Initialize with curated mockup overview
  filterCategory('all', false, false);
})();
