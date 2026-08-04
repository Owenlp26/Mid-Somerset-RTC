/* ============================================================
   Midsomerset RTC - script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behaviour ────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load in case page is already scrolled

  /* ── Mobile menu toggle ─────────────────────────────────── */
  const hamburger    = document.querySelector('.navbar__hamburger');
  const mobileMenu   = document.querySelector('.navbar__mobile-menu');

  function toggleMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when a mobile link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ── Active nav link detection ──────────────────────────── */
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';

    const allLinks = document.querySelectorAll('.navbar__link');

    allLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkFile = href.split('/').pop();

      // Match exact filename
      if (linkFile === currentFile) {
        link.classList.add('active');
      } else if (
        // Treat empty path / root as index.html
        (currentFile === '' || currentFile === '/') &&
        linkFile === 'index.html'
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();

  /* ── Smooth scroll for in-page anchor links ─────────────── */
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });

  /* ── Registration form handler ──────────────────────────── */
  const registrationForm = document.getElementById('registration-form');
  const formSuccess      = document.getElementById('form-success');

  if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation - check required fields
      const requiredFields = registrationForm.querySelectorAll('[required]');
      let allValid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          allValid = false;
          field.style.borderColor = '#dc2626';
          field.addEventListener(
            'input',
            function () {
              field.style.borderColor = '';
            },
            { once: true }
          );
        }
      });

      if (!allValid) return;

      // Simulate submission - in production this would POST to a server
      const submitBtn = registrationForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        registrationForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800);
    });
  }

  /* ── Intersection Observer - subtle card reveal ─────────── */
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealTargets = document.querySelectorAll(
      '.card, .news-card, .team-card, .coach-card, .stat-box, .info-box, .offer-item, .location-card, .stat-glass'
    );

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      revealObserver.observe(el);
    });
  }

  /* ── Animated counters (IntersectionObserver) ────────────── */
  if ('IntersectionObserver' in window) {

    /**
     * Easing function - ease out quad
     */
    function easeOutQuad(t) {
      return t * (2 - t);
    }

    /**
     * Animate a single counter element.
     * @param {Element} el  - element with data-count-to (number) and optional data-count-suffix
     * @param {number} duration - ms
     */
    function animateCounter(el, duration) {
      var target  = parseFloat(el.getAttribute('data-count-to')) || 0;
      var suffix  = el.getAttribute('data-count-suffix') || '';
      var prefix  = el.getAttribute('data-count-prefix') || '';
      var isInt   = Number.isInteger(target);
      var start   = performance.now();

      function step(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = easeOutQuad(progress);
        var current  = eased * target;
        var display  = isInt ? Math.round(current) : current.toFixed(1);
        el.textContent = prefix + display + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + (isInt ? target : target.toFixed(1)) + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target, 1800);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-count-to]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // Trophy carousels — infinite swipe + button nav
  document.querySelectorAll('.trophy-carousel').forEach(function (carousel) {
    var track   = carousel.querySelector('.trophy-carousel__track');
    var slides  = Array.prototype.slice.call(carousel.querySelectorAll('.trophy-carousel__slide'));
    var dotsEl  = carousel.querySelector('.trophy-carousel__dots');
    var prevBtn = carousel.querySelector('.trophy-carousel__btn--prev');
    var nextBtn = carousel.querySelector('.trophy-carousel__btn--next');
    var count   = slides.length;
    var current = 0;

    // Build dots
    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.className = 'trophy-carousel__dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Photo ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(d);
      return d;
    });

    function goTo(idx) {
      current = ((idx % count) + count) % count;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Touch/swipe
    var touchStartX = null;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      touchStartX = null;
    }, { passive: true });
  });

  // Girls timeline stagger reveal
  var timelineItems = document.querySelectorAll('.girls-timeline__item');
  if (timelineItems.length) {
    var tlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var delay = Array.prototype.indexOf.call(timelineItems, entry.target) * 120;
          setTimeout(function () {
            entry.target.classList.add('in-view');
          }, delay);
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    timelineItems.forEach(function (el) { tlObserver.observe(el); });
  }
})();
