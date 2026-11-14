/**
 * El Ñaño Miami — Menu Catalog Interactive Script
 * - Category smooth scroll with sticky offset
 * - Active pill tracking on scroll with auto-centering
 */
(function () {
  'use strict';

  var subnav = document.getElementById('menu-subnav');
  var scroller = document.getElementById('subnav-scroller');
  var pills = [].slice.call(document.querySelectorAll('.cat-pill'));
  var sections = [].slice.call(document.querySelectorAll('.menu-catalog-section'));

  if (!pills.length || !sections.length) return;

  // Header height & subnav height helper
  function getStickyOffset() {
    var hh = 76;
    var subnavH = subnav ? subnav.offsetHeight : 54;
    return hh + subnavH + 16;
  }

  // Smooth scroll click handler
  pills.forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = pill.getAttribute('data-cat-target');
      var section = document.getElementById(targetId);
      if (!section) return;

      var offset = getStickyOffset();
      var targetY = section.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });

      // Optimistically activate pill
      setActivePill(targetId);
    });
  });

  // Set active pill and ensure it is visible in horizontal scroller
  function setActivePill(targetId) {
    pills.forEach(function (p) {
      var isMatch = p.getAttribute('data-cat-target') === targetId;
      p.classList.toggle('active', isMatch);
      if (isMatch && scroller) {
        // Auto-center the active pill in the scroller
        var pillLeft = p.offsetLeft;
        var pillWidth = p.offsetWidth;
        var scrollerWidth = scroller.offsetWidth;
        var targetScroll = pillLeft - (scrollerWidth / 2) + (pillWidth / 2);
        scroller.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    });
  }

  // IntersectionObserver to track active section while scrolling
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          if (id) setActivePill(id);
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  // Also support Hero "Explore Our Menu" button
  var heroExploreBtn = document.querySelector('.btn-hero-explore');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var firstSec = sections[0];
      if (firstSec) {
        var offset = getStickyOffset();
        var targetY = firstSec.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
      }
    });
  }
})();
