/* ================================================================
   SPS-IBR — lang.js
   Bilingual language system (DE / EN)
   ================================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'sps-lang';
  var DEFAULT_LANG = 'de';

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* storage not available */
    }
  }

  function applyLang(lang) {
    /* Update html lang attribute */
    document.documentElement.setAttribute('lang', lang);

    /* Update all translatable text nodes */
    var els = document.querySelectorAll('[data-de][data-en]');
    els.forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    /* Update placeholders */
    var placeholders = document.querySelectorAll('[data-placeholder-de][data-placeholder-en]');
    placeholders.forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute('data-placeholder-' + lang));
    });

    /* Update language toggle buttons */
    var langBtns = document.querySelectorAll('.lang-toggle__btn');
    langBtns.forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    setLang(lang);
  }

  /* Init on DOM load */
  function init() {
    var currentLang = getLang();
    applyLang(currentLang);

    /* Bind toggle buttons */
    var langBtns = document.querySelectorAll('.lang-toggle__btn');
    langBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        applyLang(lang);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
