/**
 * El Ñaño Miami — Premium Editorial Blog Script (blogs.js)
 * Implements: Category filtering, Interactive editorial reader modal,
 * and Client-side newsletter validation with EN/ES bilingual support.
 */

(function () {
  'use strict';

  // Editorial Story Database (EN & ES)
  var STORIES_DATA = {
    featured: {
      category_en: 'FEATURED STORY',
      category_es: 'HISTORIA DESTACADA',
      title_en: 'The Flavors of Ecuador, Served With Heart',
      title_es: 'Los Sabores del Ecuador, Servidos con el Corazón',
      author_en: 'El Ñaño Culinary Team • 5 min read',
      author_es: 'Equipo Culinario El Ñaño • 5 min de lectura',
      img: 'assets/img/pics from clients/Churrasco ecuatoriano.jpg',
      quote_en: '“In Ecuador, food is never just food—it is a family reunion on every plate, a celebration of heritage that speaks to the soul.”',
      quote_es: '“En Ecuador, la comida nunca es solo comida: es un reencuentro familiar en cada plato, una celebración de nuestras raíces que habla al corazón.”',
      text_en: [
        'At El Ñaño Miami, our culinary philosophy is rooted in the rich biodiversity and time-honored cooking traditions of Ecuador. From the Pacific shores of Manabí to the fertile Andean valleys and lush Amazon basin, Ecuadorian gastronomy is one of South America’s most vibrant culinary treasures.',
        'Our kitchen honors these regional heritage recipes by preparing every sofrito, reduction, and broth from scratch every morning. Whether it is our signature churrasco grilled over natural charcoal, tender braised secos simmered with sweet naranjilla and aromatic herbs, or crisp golden maduros, every ingredient is treated with reverence.',
        'We invite you to gather around our table, share generous family-style platters, and experience the warm, authentic hospitality that has defined El Ñaño since 2001.'
      ],
      text_es: [
        'En El Ñaño Miami, nuestra filosofía culinaria nace de la extraordinaria biodiversidad y las ancestrales tradiciones de la cocina ecuatoriana. Desde las costas del Pacífico manabita hasta los valles andinos y la Amazonía, la gastronomía del Ecuador es un tesoro vivo.',
        'Nuestra cocina rinde homenaje a estas recetas preparando cada sofrito, reducción y fondo desde cero cada mañana. Desde nuestro tradicional churrasco asado al carbón, tiernos secos cocinados a fuego lento con naranjilla y cilantro, hasta maduros dorados con queso fresco, cada ingrediente se elabora con auténtico respeto.',
        'Le invitamos a reunirse alrededor de nuestra mesa, compartir generosas fuentes familiares y vivir la calidez de la hospitalidad latina que nos ha distinguido desde 2001.'
      ]
    },
    art1: {
      category_en: 'ECUADORIAN CUISINE',
      category_es: 'COCINA ECUATORIANA',
      title_en: 'A Taste of Ecuador: Traditional Dishes Worth Discovering',
      title_es: 'Un Sabor del Ecuador: Platos Tradicionales por Descubrir',
      author_en: 'Gastronomy Chronicles • 4 min read',
      author_es: 'Crónicas Gastronómicas • 4 min de lectura',
      img: 'assets/img/pics from clients/Ceviche Mixto.jpeg',
      quote_en: '“Fresh citrus, tender seafood, and crunchy toasted chulpi—coastal Ecuadorian ceviche is unlike any other in the world.”',
      quote_es: '“Cítricos frescos, mariscos en su punto y maíz tostado crocante: el ceviche costeño del Ecuador es único en el mundo.”',
      text_en: [
        'Ecuadorian coastal cuisine is renowned for its delicate balance of fresh seafood, citrus, and toasted grains. Unlike raw Peruvian ceviches cured in minutes, authentic Ecuadorian ceviche features poached or simmered seafood enveloped in a deeply flavorful, aromatic broth of fresh lime juice, orange, red onion, and fresh cilantro.',
        'Served with crispy chifles (green plantain chips) and toasted Andean chulpi corn, every spoonful delivers contrasting textures and crisp ocean brightness.',
        'Alongside ceviches, classics like Fritada and Chaulafán show the remarkable breadth of regional flavors that have evolved over centuries.'
      ],
      text_es: [
        'La cocina costeña ecuatoriana destaca por su balance perfecto entre mariscos frescos, cítricos y granos andinos. A diferencia de otros estilos, el ceviche tradicional ecuatoriano se sirve con un caldo aromático y vibrante preparado con jugo fresco de lima, naranja, cebolla colorada curtida y cilantro fresco.',
        'Acompañado de chifles crujientes de plátano verde y maíz tostado chulpi, cada bocado ofrece un contraste irresistible de texturas y frescura marina.',
        'Junto a nuestros ceviches, recetas insignes como la Fritada y el Chaulafán demuestran la maravillosa riqueza de nuestra gastronomía regional.'
      ]
    },
    art2: {
      category_en: 'FOOD CULTURE',
      category_es: 'CULTURA GASTRONÓMICA',
      title_en: 'The Story Behind Ecuadorian Encebollado',
      title_es: 'La Historia Detrás del Encebollado Ecuatoriano',
      author_en: 'Culinary Heritage • 4 min read',
      author_es: 'Patrimonio Culinario • 4 min de lectura',
      img: 'assets/img/pics from clients/Encebollado mixto.jpg',
      quote_en: '“Encebollado is more than soup—it is the soul of Ecuadorian coastal identity and the ultimate comfort food.”',
      quote_es: '“El encebollado es más que una sopa: es el alma de la identidad costeña ecuatoriana y el plato reconfortante por excelencia.”',
      text_en: [
        'Ranked among the top fish soups globally by international culinary reviewers, Encebollado is the undisputed national dish of Ecuador. Originating from coastal fishermen in Guayas and Manabí, it was originally simmered on fishing boats using fresh bonito and cassava root.',
        'The broth is infused with cumin, sweet peppers, garlic, and fresh herbs, layered with soft melt-in-your-mouth yuca and crowned with pickled red onions and fresh lime juice.',
        'In Miami, our guests return week after week for the unmistakable comfort and restorative warmth of our slow-simmered recipe.'
      ],
      text_es: [
        'Reconocido internacionalmente entre las mejores sopas de pescado del mundo, el encebollado es el indiscutible plato insignia del Ecuador. Nacido en las caletas pesqueras de Guayas y Manabí, se cocinaba a bordo con albacora fresca y yuca tierna.',
        'El caldo se enriquece con comino, pimientos, ajo y hierbas aromáticas, reposando sobre trozos suaves de yuca y coronado con abundante cebolla morada curtida con limón fresco.',
        'En Miami, nuestros comensales regresan cada semana buscando ese sabor inconfundible y reconfortante de nuestra receta tradicional a fuego lento.'
      ]
    },
    art3: {
      category_en: 'INGREDIENTS',
      category_es: 'INGREDIENTES',
      title_en: 'Yuca, Plantain & More: The Ingredients of Ecuadorian Cooking',
      title_es: 'Yuca, Plátano y Más: Los Ingredientes de la Cocina Ecuatoriana',
      author_en: 'Market & Roots • 3 min read',
      author_es: 'Mercado y Raíces • 3 min de lectura',
      img: 'assets/img/menu/maduros-con-queso.jpg',
      quote_en: '“From green and savory to ripe and caramelized, the plantain is the versatile foundation of the Ecuadorian pantry.”',
      quote_es: '“Desde verde y crocante hasta maduro y caramelizado, el plátano es el pilar más noble de la despensa ecuatoriana.”',
      text_en: [
        'Few ingredients represent South American coastal cooking quite like plátano (plantain) and yuca (cassava). In the Ecuadorian kitchen, green plantain transforms into crispy patacones, rich bolones, and silky sango broths.',
        'When fully ripe, the plantain turns golden and sweet, caramelizing in the oven or on the grill to become Maduros con Queso—paired with salty, fresh Andean cheese for an unforgettable harmony of sweet and savory.',
        'Meanwhile, fresh cassava root provides natural velvety thickness to coastal stews while maintaining a gentle, comforting earthy sweetness.'
      ],
      text_es: [
        'Pocos ingredientes representan la cocina del Pacífico sur como el plátano y la yuca. En el recetario ecuatoriano, el plátano verde da vida a patacones crujientes, bolones tradicionales y caldos aterciopelados.',
        'Al madurar, el plátano se vuelve dulce y dorado, caramelizándose a la brasa para convertirse en Maduros con Queso: la perfecta combinación entre dulzor natural y queso criollo salpicado de frescura.',
        'La yuca, por su parte, aporta esa textura sedosa e insustituible a sopas y cazuelas, manteniendo una nobleza campesina en cada preparación.'
      ]
    },
    restaurant: {
      category_en: 'RESTAURANT STORIES',
      category_es: 'HISTORIAS DEL RESTAURANTE',
      title_en: 'Bringing a Taste of Ecuador to Coral Gables',
      title_es: 'Trayendo el Sabor del Ecuador a Coral Gables',
      author_en: 'The El Ñaño Journey • 5 min read',
      author_es: 'La Trayectoria El Ñaño • 5 min de lectura',
      img: 'assets/img/pics from clients/SIN PERSONAS.png',
      quote_en: '“Miracle Mile is historic, elegant, and vibrant—the perfect home for an Ecuadorian culinary experience crafted with warmth and pride.”',
      quote_es: '“Miracle Mile es histórica, elegante y acogedora: el hogar ideal para una experiencia culinaria ecuatoriana hecha con orgullo y calidez.”',
      text_en: [
        'When we first envisioned bringing El Ñaño to Coral Gables, our dream was simple yet ambitious: to create a space that feels like stepping into a gracious home in Ecuador, while honoring the sophistication of historic Miracle Mile.',
        'From our tropical botanical murals and natural wood finishes to our open kitchen and Josper charcoal ovens, every design element reflects our passion for genuine South American hospitality.',
        'Today, 339 Miracle Mile has become a beloved gathering place where expatriates rediscover their roots and new guests fall in love with the vibrant gastronomy of the equator.'
      ],
      text_es: [
        'Cuando soñamos con traer El Ñaño a Coral Gables, el anhelo era tan claro como ambicioso: crear un espacio que evocara la calidez de un hogar ecuatoriano, respetando la elegancia de la histórica Miracle Mile.',
        'Desde los detalles botánicos en nuestros murales y la nobleza de la madera natural, hasta nuestro horno de carbón Josper, cada rincón celebra el espíritu de la hospitalidad latina.',
        'Hoy, el 339 Miracle Mile se ha convertido en el punto de encuentro donde quienes añoran su tierra se sienten en casa y nuevos amigos descubren la magia de nuestra cocina.'
      ]
    },
    art4: {
      category_en: 'DINING EXPERIENCE',
      category_es: 'EXPERIENCIA GASTRONÓMICA',
      title_en: 'The Joy of Sharing Food Around the Table',
      title_es: 'La Alegría de Compartir la Mesa',
      author_en: 'Table Stories • 3 min read',
      author_es: 'Historias de Sobremesa • 3 min de lectura',
      img: 'assets/img/pics from clients/a-table-outside.jpg',
      quote_en: '“A meal shared with good friends is not measured in minutes, but in laughter, memories, and shared platters.”',
      quote_es: '“Una comida compartida con buenos amigos no se mide en minutos, sino en risas, recuerdos y platos que se pasan de mano en mano.”',
      text_en: [
        'In Ecuadorian culture, dining is fundamentally a communal celebration. Meals are never rushed; dishes are placed in the center of the table so everyone can pass them around, sample different sauces, and savor the conversation.',
        'Whether sitting outside in the Coral Gables evening breeze or relaxing in our main dining room, our team takes pride in making you feel like family from the moment you step through our doors.',
        'Pull up a chair, raise a glass, and let us take care of everything.'
      ],
      text_es: [
        'En la cultura ecuatoriana, la mesa es un santuario para compartir. La comida nunca se apresura; los platos se colocan al centro para que todos puedan servirse, probar distintos ajíes y disfrutar de la sobremesa.',
        'Ya sea disfrutando de la brisa exterior en Miracle Mile o en nuestro salón principal, nuestro equipo se esmera en hacerle sentir parte de nuestra familia desde el primer saludo.',
        'Tome asiento, levante su copa y permítanos deleitarle con lo mejor de nuestra casa.'
      ]
    },
    art5: {
      category_en: 'DRINKS & CULTURE',
      category_es: 'BEBIDAS Y CULTURA',
      title_en: 'Discover the Inspiration Behind Ecuadorian Drinks',
      title_es: 'Descubra la Inspiración de las Bebidas Ecuatorianas',
      author_en: 'Craft & Spirits • 4 min read',
      author_es: 'Coctelería y Tradición • 4 min de lectura',
      img: 'assets/img/menu/vaso-de-jugo.jpg',
      quote_en: '“From refreshing tropical passion fruit to spiced warm canelazo, our drinks celebrate Ecuador’s rich terroir.”',
      quote_es: '“Desde el maracuyá más refrescante hasta el canelazo especiado, nuestras bebidas rinden tributo a la riqueza del trópico y los Andes.”',
      text_en: [
        'Ecuador’s lush geography yields an astounding variety of exotic fruits: maracuyá (passion fruit), mora (Andean blackberry), naranjilla (lulo), and tamarindo. Prepared fresh to order, our 100% natural tropical fruit juices are an essential part of the Ecuadorian midday ritual.',
        'At our cocktail bar, we blend these authentic fruit reductions with fine spirits and warming spices like cinnamon and cloves to craft signature drinks like our Canelazo Miamero and La Ñaña cocktail.',
        'Every sip is a vibrant reflection of equatorial sunlight and handcrafted passion.'
      ],
      text_es: [
        'La geografía privilegiada del Ecuador produce una variedad asombrosa de frutas exóticas: maracuyá de la costa, mora andina silvestre, naranjilla aromática y tamarindo dulce y ácido. Preparados frescos al momento, nuestros jugos naturales son una tradición indispensable del día a día.',
        'En nuestra barra, fusionamos estas pulpas puras con destilados selectos y especias tradicionales como canela y clavo de olor, dando origen a creaciones como el Canelazo Miamero y nuestro emblemático cóctel La Ñaña.',
        'Cada trago es una invitación a brindar con el sol y la calidez de nuestra tierra.'
      ]
    }
  };

  // Helper: Get current language
  function getCurrentLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  // 1. Initialize Category Filters
  function initCategoryFilters() {
    var filterBtns = document.querySelectorAll('.blog-filter-btn');
    var filterableCards = document.querySelectorAll('[data-category]');

    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filterVal = btn.getAttribute('data-filter') || 'all';

        // Update active class on filter buttons
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter cards
        filterableCards.forEach(function (card) {
          var cardCat = card.getAttribute('data-category') || '';
          if (filterVal === 'all' || cardCat === filterVal) {
            card.style.display = '';
            card.classList.remove('filtered-out');
          } else {
            card.style.display = 'none';
            card.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // 2. Initialize Article Reader Modal
  function initReaderModal() {
    var modalBackdrop = document.getElementById('blog-modal');
    if (!modalBackdrop) return;

    var closeBtn = modalBackdrop.querySelector('.blog-modal-close-btn');
    var backBtn = modalBackdrop.querySelector('.blog-modal-back-btn');
    var badgeEl = modalBackdrop.querySelector('.blog-modal-badge');
    var authorEl = modalBackdrop.querySelector('.blog-modal-author');
    var headlineEl = modalBackdrop.querySelector('.blog-modal-headline');
    var figureEl = modalBackdrop.querySelector('.blog-modal-figure img');
    var quoteEl = modalBackdrop.querySelector('.blog-modal-quote');
    var textEl = modalBackdrop.querySelector('.blog-modal-text');

    var currentStoryId = null;

    function renderModalContent(storyId) {
      var story = STORIES_DATA[storyId];
      if (!story) return;

      var lang = getCurrentLang();
      var isEs = lang === 'es';

      if (badgeEl) badgeEl.textContent = isEs ? story.category_es : story.category_en;
      if (authorEl) authorEl.textContent = isEs ? story.author_es : story.author_en;
      if (headlineEl) headlineEl.textContent = isEs ? story.title_es : story.title_en;
      if (quoteEl) quoteEl.textContent = isEs ? story.quote_es : story.quote_en;

      if (figureEl) {
        figureEl.src = story.img;
        figureEl.alt = isEs ? story.title_es : story.title_en;
      }

      if (textEl) {
        var paragraphs = isEs ? story.text_es : story.text_en;
        textEl.innerHTML = paragraphs.map(function (p) {
          return '<p>' + p + '</p>';
        }).join('');
      }
    }

    function openModal(storyId) {
      currentStoryId = storyId;
      renderModalContent(storyId);
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentStoryId = null;
    }

    // Bind triggers on all read more buttons
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-story]');
      if (trigger) {
        e.preventDefault();
        var storyId = trigger.getAttribute('data-open-story');
        if (storyId) openModal(storyId);
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });

    // Re-render open modal on language switch
    document.addEventListener('languageChanged', function () {
      if (currentStoryId && modalBackdrop.classList.contains('active')) {
        renderModalContent(currentStoryId);
      }
    });
  }

  // 3. Initialize Newsletter Form Validation
  function initNewsletterForm() {
    var form = document.querySelector('.blog-newsletter-form');
    if (!form) return;

    var input = form.querySelector('.blog-newsletter-input');
    var msg = form.parentNode.querySelector('.blog-newsletter-msg') || form.querySelector('.blog-newsletter-msg');
    if (!msg) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var lang = getCurrentLang();
      var dict = window.I18N_DATA && window.I18N_DATA[lang] ? window.I18N_DATA[lang] : {};

      if (!val || !emailRegex.test(val)) {
        msg.className = 'blog-newsletter-msg error';
        msg.textContent = dict['blog_newsletter_invalid'] || 'Please enter a valid email address.';
        input.focus();
      } else {
        msg.className = 'blog-newsletter-msg success';
        msg.textContent = dict['blog_newsletter_success'] || 'Thank you for subscribing to El Ñaño Miami food stories!';
        input.value = '';
      }
    });
  }

  // DOM Ready bootstrap
  document.addEventListener('DOMContentLoaded', function () {
    initCategoryFilters();
    initReaderModal();
    initNewsletterForm();
  });
})();
