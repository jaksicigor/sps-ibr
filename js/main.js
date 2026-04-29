/* ================================================================
   SPS-IBR — main.js
   Header, nav, mobile menu, scroll, footer year
   ================================================================ */
(function () {
  'use strict';

  /* --- Header scroll state --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Active nav state --- */
  var navLinks = document.querySelectorAll('.main-nav__link');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    var hrefBase = href.split('#')[0];
    if (hrefBase === currentPage || (currentPage === '' && hrefBase === 'index.html')) {
      if (!href.includes('#')) {
        link.setAttribute('aria-current', 'page');
      }
    }
  });

  /* --- Homepage section-based nav highlighting (Aktuell, Kontakt, Nachhaltigkeit) --- */
  var isHomepage = currentPage === 'index.html' || currentPage === '';
  if (isHomepage && 'IntersectionObserver' in window) {
    var sectionNavMap = [];
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.includes('index.html#') || (href.startsWith('#'))) {
        var hash = href.indexOf('#') !== -1 ? href.substring(href.indexOf('#') + 1) : '';
        if (hash) {
          var sec = document.getElementById(hash);
          if (sec) sectionNavMap.push({ el: sec, link: link, hash: hash });
        }
      }
    });

    if (sectionNavMap.length) {
      var homeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var match = sectionNavMap.find(function (s) { return s.el === entry.target; });
          if (match) {
            if (entry.isIntersecting) {
              match.link.setAttribute('aria-current', 'page');
            } else {
              match.link.removeAttribute('aria-current');
            }
          }
        });
      }, {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      });

      sectionNavMap.forEach(function (s) { homeObserver.observe(s.el); });
    }
  }

  /* --- Mobile nav --- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileLinks = mobileNav ? mobileNav.querySelectorAll('a, button') : [];
  var focusableInMobile = [];

  function openMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Gather focusable
    focusableInMobile = mobileNav.querySelectorAll('a, button');
    if (focusableInMobile.length) focusableInMobile[0].focus();
  }

  function closeMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close on backdrop click
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) closeMobileNav();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
    // Focus trap
    if (e.key === 'Tab' && mobileNav && mobileNav.classList.contains('open')) {
      var focusable = mobileNav.querySelectorAll('a, button');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Close mobile nav on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* --- Büro sub-nav active section (IntersectionObserver) --- */
  var subNavLinks = document.querySelectorAll('.buero-subnav__link');
  if (subNavLinks.length) {
    var sections = [];
    subNavLinks.forEach(function (link) {
      var target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        var el = document.querySelector(target);
        if (el) sections.push({ el: el, link: link });
      }
    });

    if (sections.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            subNavLinks.forEach(function (l) { l.classList.remove('active'); });
            var match = sections.find(function (s) { return s.el === entry.target; });
            if (match) match.link.classList.add('active');
          }
        });
      }, {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      });

      sections.forEach(function (s) { observer.observe(s.el); });
    }
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerH = header ? header.offsetHeight : 0;
        var subNav = document.querySelector('.buero-subnav');
        var subNavH = subNav ? subNav.offsetHeight : 0;
        var y = target.getBoundingClientRect().top + window.scrollY - headerH - subNavH - 10;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* --- Footer year --- */
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- Fade-in on scroll --- */
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.fade-in');
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  }
})();
