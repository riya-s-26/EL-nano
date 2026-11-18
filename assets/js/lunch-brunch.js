/* ==========================================================================
   El Ñaño Miami — Lunch & Brunch Page JavaScript
   ========================================================================== */

(function () {
  'use strict';

  // Elements
  const tabLunchBtn = document.getElementById('lb-tab-lunch');
  const tabBrunchBtn = document.getElementById('lb-tab-brunch');
  const dayMonThuBtn = document.getElementById('lb-day-monthu');
  const dayFridayBtn = document.getElementById('lb-day-friday');

  const heroEyebrow = document.getElementById('lb-hero-eyebrow');
  const heroTitle = document.getElementById('lb-hero-title');
  const heroDayWrap = document.getElementById('lb-hero-day-wrap');
  const heroTbdBadge = document.getElementById('lb-hero-tbd-badge');

  const priceAmount = document.getElementById('lb-price-amount');
  const priceSub = document.getElementById('lb-price-sub');

  const viewLunch = document.getElementById('lb-view-lunch');
  const viewBrunch = document.getElementById('lb-view-brunch');

  const fridayBanner = document.getElementById('lb-friday-banner');
  const caldoCard = document.getElementById('lb-card-caldo');
  const course1Grid = document.getElementById('lb-course1-grid');

  const bannerKicker = document.getElementById('lb-banner-kicker');
  const bannerTitle = document.getElementById('lb-banner-title');
  const bannerToggleBtn = document.getElementById('lb-banner-toggle-btn');

  let currentTab = 'lunch';
  let currentDay = 'friday'; // default to Friday as shown in Reference Screenshot 1, or allow toggle

  function updateView() {
    const isEs = document.documentElement.lang === 'es';

    if (currentTab === 'lunch') {
      tabLunchBtn.classList.add('active');
      tabBrunchBtn.classList.remove('active');

      heroEyebrow.textContent = isEs ? '12 PM – 4 PM · MIRACLE MILE' : '12 PM – 4 PM · MIRACLE MILE';
      heroTitle.textContent = isEs ? 'Almuerzo' : 'Lunch';

      heroDayWrap.style.display = 'inline-flex';
      heroTbdBadge.style.display = 'none';

      priceAmount.textContent = '$26';
      priceSub.textContent = isEs ? '3 TIEMPOS' : '3 COURSES';

      viewLunch.style.display = 'block';
      viewBrunch.style.display = 'none';

      // Bottom banner
      bannerKicker.textContent = isEs ? 'TAMBIÉN EN EL ÑAÑO' : 'ALSO AT EL ÑAÑO';
      bannerTitle.textContent = isEs ? '¿Buscas brunch?' : 'Looking for brunch?';
      bannerToggleBtn.textContent = isEs ? 'VER MENÚ DE BRUNCH →' : 'SEE THE BRUNCH MENU →';

      // Day selection logic
      if (currentDay === 'friday') {
        dayFridayBtn.classList.add('active');
        dayMonThuBtn.classList.remove('active');
        fridayBanner.classList.remove('hidden');
        if (caldoCard) caldoCard.style.display = 'flex';
        course1Grid.classList.remove('lb-grid-4');
        course1Grid.classList.add('lb-grid-5');
      } else {
        dayMonThuBtn.classList.add('active');
        dayFridayBtn.classList.remove('active');
        fridayBanner.classList.add('hidden');
        if (caldoCard) caldoCard.style.display = 'none';
        course1Grid.classList.remove('lb-grid-5');
        course1Grid.classList.add('lb-grid-4');
      }
    } else {
      // Brunch view
      tabBrunchBtn.classList.add('active');
      tabLunchBtn.classList.remove('active');

      heroEyebrow.textContent = isEs ? 'HORARIO TBD · MIRACLE MILE' : 'HOURS TBD · MIRACLE MILE';
      heroTitle.textContent = 'Brunch';

      heroDayWrap.style.display = 'none';
      heroTbdBadge.style.display = 'inline-block';

      priceAmount.textContent = isEs ? 'PRECIO' : 'PRICE';
      priceSub.textContent = 'TBD';

      viewLunch.style.display = 'none';
      viewBrunch.style.display = 'block';

      // Bottom banner
      bannerKicker.textContent = isEs ? 'TAMBIÉN EN EL ÑAÑO' : 'ALSO AT EL ÑAÑO';
      bannerTitle.textContent = isEs ? '¿Volver al almuerzo?' : 'Back to lunch?';
      bannerToggleBtn.textContent = isEs ? 'VER MENÚ DE ALMUERZO →' : 'SEE THE LUNCH MENU →';
    }
  }

  // Event Listeners
  if (tabLunchBtn && tabBrunchBtn) {
    tabLunchBtn.addEventListener('click', function () {
      currentTab = 'lunch';
      updateView();
    });

    tabBrunchBtn.addEventListener('click', function () {
      currentTab = 'brunch';
      updateView();
    });
  }

  if (dayMonThuBtn && dayFridayBtn) {
    dayMonThuBtn.addEventListener('click', function () {
      currentDay = 'monthu';
      updateView();
    });

    dayFridayBtn.addEventListener('click', function () {
      currentDay = 'friday';
      updateView();
    });
  }

  if (bannerToggleBtn) {
    bannerToggleBtn.addEventListener('click', function () {
      currentTab = (currentTab === 'lunch') ? 'brunch' : 'lunch';
      updateView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Listen for language changes if language switcher is triggered
  document.addEventListener('languageChanged', updateView);
  window.addEventListener('load', updateView);

  // Initial call
  updateView();
})();
