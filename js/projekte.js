/* ================================================================
   SPS-IBR — projekte.js
   Category filter + debounced search for project grid
   ================================================================ */
(function () {
  'use strict';

  var filterBtns = document.querySelectorAll('.filter-btn');
  var searchInput = document.querySelector('.search-input');
  var cards = document.querySelectorAll('.project-card');
  var noResults = document.querySelector('.no-results');
  var debounceTimer = null;

  if (!cards.length) return;

  var activeCategory = 'alle';

  function getSearchTerm() {
    return searchInput ? searchInput.value.trim().toLowerCase() : '';
  }

  function filterCards() {
    var term = getSearchTerm();
    var visibleCount = 0;

    cards.forEach(function (card) {
      var category = (card.getAttribute('data-category') || '').toLowerCase();
      var name = (card.getAttribute('data-name') || '').toLowerCase();

      var matchCategory = activeCategory === 'alle' || category === activeCategory;
      var matchSearch = !term || name.indexOf(term) !== -1 || category.indexOf(term) !== -1;

      if (matchCategory && matchSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.add('visible');
      } else {
        noResults.classList.remove('visible');
      }
    }
  }

  /* Filter buttons */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      activeCategory = (btn.getAttribute('data-filter') || 'alle').toLowerCase();
      filterCards();
    });
  });

  /* Debounced search */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterCards, 300);
    });
  }
})();
