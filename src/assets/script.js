/* =========================================================
   CAP'AVENIR78 — Interactive behaviours
   Edit this file to change UI behaviour (not content).
   Content lives in index.html, styles in assets/styles.css.
   ========================================================= */

(function () {
  'use strict';

  /* ── Smooth scroll for all anchor links ─────────────────── */
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').replace('#', '');
    if (!id) return;
    e.preventDefault();
    scrollToId(id);
    closeMobileMenu();
    setActiveLink(id);
  });

  /* ── Navbar shadow on scroll ────────────────────────────── */
  var nav = document.getElementById('main-nav');
  function updateNavShadow() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('shadow-md');
      nav.classList.remove('shadow-sm');
    } else {
      nav.classList.remove('shadow-md');
      nav.classList.add('shadow-sm');
    }
  }
  window.addEventListener('scroll', updateNavShadow, { passive: true });

  /* ── Active nav link tracking ───────────────────────────── */
  function setActiveLink(activeId) {
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href').replace(/^\/?#/, '');
      if (href === activeId) {
        link.classList.add('text-[#1a3a6b]');
        link.classList.remove('text-gray-600');
      } else {
        link.classList.remove('text-[#1a3a6b]');
        link.classList.add('text-gray-600');
      }
    });
  }

  window.addEventListener('scroll', function () {
    var sections = document.querySelectorAll('.nav-link[href^="#"]');
    var current = 'accueil';
    sections.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    });
    setActiveLink(current);
  }, { passive: true });

  /* ── Mobile menu ────────────────────────────────────────── */
  var menuBtn    = document.getElementById('menu-btn');
  var iconOpen   = document.getElementById('icon-menu-open');
  var iconClose  = document.getElementById('icon-menu-close');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    if (iconOpen)  iconOpen.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.classList.remove('hidden');
        if (iconOpen)  iconOpen.classList.add('hidden');
        if (iconClose) iconClose.classList.remove('hidden');
      }
    });
  }

  /* ── FAQ accordion ──────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn    = item.querySelector('.faq-btn');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('faq-open');

      /* close all */
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('faq-open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        var chev = other.querySelector('.faq-chevron');
        if (chev) chev.style.transform = '';
      });

      /* open the clicked one if it was closed */
      if (!isOpen) {
        item.classList.add('faq-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        var chev = item.querySelector('.faq-chevron');
        if (chev) chev.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* ── Scroll-triggered fade-in animations ───────────────── */
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(function (el) {
    animObserver.observe(el);
  });

  /* ── Stats counter animation ────────────────────────────── */
  function animateCounter(el) {
    var target   = parseInt(el.dataset.target, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1800;
    var step     = Math.ceil(target / (duration / 16));
    var current  = 0;
    var timer = setInterval(function () {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + suffix;
    }, 16);
  }

  var statsSection = document.getElementById('stats-section');
  if (statsSection) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-counter').forEach(animateCounter);
          this.unobserve(entry.target);
        }
      }.bind(this));
    }, { threshold: 0.2 }).observe(statsSection);
  }

  /* ── Contact form → mailto ──────────────────────────────── */
  var form        = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var formReset   = document.getElementById('form-reset');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = form.querySelector('[name="name"]').value;
      var email   = form.querySelector('[name="email"]').value;
      var phone   = form.querySelector('[name="phone"]').value;
      var level   = form.querySelector('[name="level"]').value;
      var service = form.querySelector('[name="service"]').value;
      var message = form.querySelector('[name="message"]').value;

      var subject = encodeURIComponent("Demande d'inscription - " + name);
      var body    = encodeURIComponent(
        'Nom : ' + name + '\n' +
        'Email : ' + email + '\n' +
        'Téléphone : ' + phone + '\n' +
        'Niveau : ' + level + '\n' +
        'Service souhaité : ' + service + '\n\n' +
        'Message :\n' + message
      );
      window.location.href = 'mailto:capavenir78@gmail.com?subject=' + subject + '&body=' + body;

      form.classList.add('hidden');
      if (formSuccess) formSuccess.classList.remove('hidden');
    });
  }

  if (formReset) {
    formReset.addEventListener('click', function () {
      if (form)        form.classList.remove('hidden');
      if (formSuccess) formSuccess.classList.add('hidden');
    });
  }

})();
