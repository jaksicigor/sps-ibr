/* ================================================================
   SPS-IBR — slideshow.js
   Image slideshow for project detail pages
   ================================================================ */
(function () {
  'use strict';

  var slideshow = document.querySelector('.slideshow');
  if (!slideshow) return;

  var track = slideshow.querySelector('.slideshow__track');
  var slides = slideshow.querySelectorAll('.slideshow__slide');
  var prevBtn = slideshow.querySelector('.slideshow__prev');
  var nextBtn = slideshow.querySelector('.slideshow__next');
  var dotsContainer = slideshow.querySelector('.slideshow__dots');

  if (!track || slides.length < 2) return;

  var current = 0;
  var total = slides.length;
  var autoplayInterval = null;
  var AUTOPLAY_DELAY = 5000;

  /* Check reduced motion */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Create dots */
  if (dotsContainer) {
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Bild ' + (i + 1) + ' von ' + total);
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    }
  }

  var dots = dotsContainer ? dotsContainer.querySelectorAll('.slideshow__dot') : [];

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;

    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    /* Update dots */
    dots.forEach(function (d, di) {
      d.classList.toggle('active', di === current);
    });

    /* Update aria-live region */
    var liveRegion = slideshow.querySelector('.slideshow__live');
    if (liveRegion) {
      liveRegion.textContent = 'Bild ' + (current + 1) + ' von ' + total;
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* Controls */
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });

  /* Dots */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.getAttribute('data-index'), 10);
      goTo(idx);
      resetAutoplay();
    });
  });

  /* Keyboard */
  slideshow.setAttribute('tabindex', '0');
  slideshow.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
    if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
  });

  /* Autoplay */
  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayInterval = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  /* Pause on hover/focus */
  slideshow.addEventListener('mouseenter', stopAutoplay);
  slideshow.addEventListener('mouseleave', startAutoplay);
  slideshow.addEventListener('focusin', stopAutoplay);
  slideshow.addEventListener('focusout', startAutoplay);

  /* Aria live region */
  var live = document.createElement('div');
  live.className = 'slideshow__live';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  slideshow.appendChild(live);

  /* Init */
  goTo(0);
  startAutoplay();
})();
