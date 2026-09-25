/* ═══════════════════════════════════════════════════════════
   Aldas Kšečkauskas — Portfolio interactions
   No dependencies. Everything degrades gracefully.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Footer year ──────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Theme toggle (remembers your choice) ─────────────── */
  var root = document.documentElement;
  var themeBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      var goingLight = theme === 'dark';
      themeBtn.setAttribute('aria-pressed', String(theme === 'light'));
      themeBtn.setAttribute('aria-label',
        goingLight ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // Dark is the signature look, so it stays the default. The inline script in
  // <head> already applied any saved choice before first paint; this just syncs
  // the button's label and pressed state to whatever ended up on <html>.
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ── Project card language (EN / LT, remembers your choice) ── */
  // The inline script in <head> already set data-card-lang before first paint.
  // A switch on any card flips every card, so the list never mixes languages.
  var langSwitches = document.querySelectorAll('.lang-switch');

  function applyCardLang(lang) {
    root.setAttribute('data-card-lang', lang);
    Array.prototype.forEach.call(langSwitches, function (btn) {
      btn.setAttribute('aria-label', lang === 'lt' ? 'Show in English' : 'Rodyti lietuviškai');
    });
  }

  applyCardLang(root.getAttribute('data-card-lang') === 'lt' ? 'lt' : 'en');

  Array.prototype.forEach.call(langSwitches, function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-card-lang') === 'lt' ? 'en' : 'lt';
      applyCardLang(next);
      try { localStorage.setItem('cardLang', next); } catch (e) { /* ignore */ }
    });
  });

  /* ── "Show all projects" ──────────────────────────────── */
  var projectGrid = document.getElementById('projectGrid');
  var showAllBtn = document.getElementById('showAllProjects');

  if (projectGrid && showAllBtn) {
    var extraCount = projectGrid.querySelectorAll('.is-extra').length;
    if (!extraCount) showAllBtn.parentNode.hidden = true;

    showAllBtn.addEventListener('click', function () {
      var open = projectGrid.classList.toggle('is-expanded');
      showAllBtn.setAttribute('aria-expanded', String(open));
      showAllBtn.firstChild.textContent = open ? 'Show fewer projects ' : 'Show all projects ';
      if (!open) document.getElementById('projects').scrollIntoView();
    });
  }

  /* ── Mobile menu ──────────────────────────────────────── */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* ── Scroll reveal + one-shot heading flash ───────────── */
  var revealEls = document.querySelectorAll('.reveal');

  Array.prototype.forEach.call(revealEls, function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--d', delay);
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealEls, function (el) { revealObserver.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('is-visible'); });
  }

  /* ── Scroll progress bar ──────────────────────────────── */
  var progressBar = document.getElementById('progressBar');
  var header = document.getElementById('siteHeader');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('main section[id]');
  var ticking = false;

  function onScroll() {
    var scrollTop = window.pageYOffset || root.scrollTop;

    // progress
    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (scrollTop / max) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    // header background once we leave the very top
    if (header) header.classList.toggle('is-stuck', scrollTop > 12);

    // active nav link
    var current = '';
    var probe = scrollTop + window.innerHeight * 0.35;
    Array.prototype.forEach.call(sections, function (sec) {
      if (sec.offsetTop <= probe) current = sec.id;
    });
    Array.prototype.forEach.call(navLinks, function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  /* ── Cursor spotlight on cards ────────────────────────── */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    var glowCards = document.querySelectorAll('.glow-card');

    Array.prototype.forEach.call(glowCards, function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });

    /* Subtle tilt on the avatar */
    var tilt = document.querySelector('.tilt');
    if (tilt) {
      var hero = document.querySelector('.hero');
      hero.addEventListener('pointermove', function (e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        tilt.style.transform =
          'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) ' +
          'rotateX(' + (-y * 10).toFixed(2) + 'deg)';
      });
      hero.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
    }
  }

  /* ── Rotating job title ───────────────────────────────── */
  var rotator = document.getElementById('rotator');
  if (rotator && !reduceMotion) {
    var roles = [
      'Full-Stack Developer',
      'TypeScript Developer',
      'Next.js Builder',
      'Problem Solver'
    ];
    var i = 0;

    setInterval(function () {
      i = (i + 1) % roles.length;
      var word = document.createElement('span');
      word.className = 'rotator-word';
      word.textContent = roles[i];
      rotator.replaceChildren(word);
    }, 2600);
  }
})();
