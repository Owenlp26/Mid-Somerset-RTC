/* ============================================================
   Midsomerset RTC — script.js
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

      // Basic validation — check required fields
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

      // Simulate submission — in production this would POST to a server
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

  /* ── Intersection Observer — subtle card reveal ─────────── */
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.card, .news-card, .team-card, .coach-card, .stat-box, .info-box, .offer-item'
    );

    const revealObserver = new IntersectionObserver(
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
})();
