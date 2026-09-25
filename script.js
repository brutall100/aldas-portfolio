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

  /* ── Project card EN / LT switch ─────────────────────── */
  // Each switch flips only its own card: the text goes to the other language
  // and, when the project has both, the screenshot goes to the other theme.
  Array.prototype.forEach.call(document.querySelectorAll('.lang-switch'), function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.project-card');
      var flipped = card.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', String(flipped));
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

  /* ── Scroll progress bar, sticky header, active nav link ── */
  var progressBar = document.getElementById('progressBar');
  var header = document.getElementById('siteHeader');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('main section[id]');
  var ticking = false;
  var sectionTops = [];
  var maxScroll = 0;
  var lastSection = null;

  // Measure the page once (and again on resize or when content changes)
  // instead of on every scroll frame; reading layout while scrolling is
  // what makes a page stutter.
  function measure() {
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    sectionTops = Array.prototype.map.call(sections, function (sec) {
      return { id: sec.id, top: sec.getBoundingClientRect().top + window.pageYOffset };
    });
  }

  function onScroll() {
    var scrollTop = window.pageYOffset;

    if (progressBar) {
      var ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;
      progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, ratio)) + ')';
    }

    if (header) header.classList.toggle('is-stuck', scrollTop > 12);

    var current = '';
    var probe = scrollTop + window.innerHeight * 0.35;
    sectionTops.forEach(function (sec) { if (sec.top <= probe) current = sec.id; });
    if (current !== lastSection) {
      lastSection = current;
      Array.prototype.forEach.call(navLinks, function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
      });
    }

    ticking = false;
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', function () { measure(); requestTick(); });
  window.addEventListener('load', function () { measure(); requestTick(); });
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { measure(); requestTick(); }).observe(document.body);
  }

  measure();
  onScroll();

  /* ── In-page links: scroll there without adding #section to the address ── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var id = link.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    if (id === 'home') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

    // the skip link still has to move keyboard focus into the page
    if (link.classList.contains('skip-link')) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  // An old bookmark such as /#projects still lands on the section; then tidy the address.
  if (window.location.hash && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

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
