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

  /* ── Project screenshots: fade in once loaded (the ghost sweep shows until then) ── */
  Array.prototype.forEach.call(document.querySelectorAll('.project-media img'), function (img) {
    function done() { img.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    }
  });

  /* ── Click ripple on buttons ─────────────────────────── */
  if (!reduceMotion) {
    document.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest('.btn, .project-link, .lang-switch, .icon-btn, .burger, .social-link, .to-top');
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      // big enough to reach the farthest corner from where you pressed
      var size = 2 * Math.hypot(Math.max(e.clientX - rect.left, rect.right - e.clientX),
                                Math.max(e.clientY - rect.top, rect.bottom - e.clientY));
      var wave = document.createElement('span');
      wave.className = 'ripple';
      wave.style.width = wave.style.height = size + 'px';
      wave.style.left = (e.clientX - rect.left - size / 2) + 'px';
      wave.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(wave);
      wave.addEventListener('animationend', function () { wave.remove(); });
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

  /* ── Space quote: orbiting planets + three quotes made of stardust ── */
  var spaceQuote = document.getElementById('spaceQuote');
  if (spaceQuote) initSpaceQuote(spaceQuote);

  function initSpaceQuote(box) {
    var quotes = [
      { text: '“Choose a job you love, and you will never have to work a day in your life.”', by: 'Confucius' },
      { text: '“Measure twice, cut once.”', by: 'Carpenter’s proverb' },
      { text: '“First, solve the problem. Then, write the code.”', by: 'John Johnson' }
    ];
    var textEl = document.getElementById('quoteText');
    var citeEl = document.getElementById('quoteCite');
    var dotsEl = document.getElementById('quoteDots');
    var canvas = box.querySelector('.space-canvas');
    var ctx = canvas.getContext('2d');
    var current = 0;
    var busy = false;
    var visible = false;
    var timer = null;
    var HOLD = 7500;

    function rand(a, b) { return a + Math.random() * (b - a); }

    // Build the quote as word spans holding letter spans. Each letter starts
    // somewhere out in space (--dx/--dy) so it can fly in to its place.
    function build(text) {
      textEl.textContent = '';
      var spoken = document.createElement('span');   // what screen readers read
      spoken.className = 'sr-only';
      spoken.textContent = text;
      var shown = document.createElement('span');    // the letters people see
      shown.setAttribute('aria-hidden', 'true');
      textEl.appendChild(spoken);
      textEl.appendChild(shown);
      var i = 0;
      text.split(' ').forEach(function (word, w) {
        if (w) shown.appendChild(document.createTextNode(' '));
        var ws = document.createElement('span');
        ws.className = 'qw';
        Array.prototype.forEach.call(word, function (ch) {
          var c = document.createElement('span');
          c.className = 'qc';
          c.textContent = ch;
          c.style.setProperty('--i', i++);
          c.style.setProperty('--dx', rand(-320, 320).toFixed(0) + 'px');
          c.style.setProperty('--dy', rand(-160, 160).toFixed(0) + 'px');
          c.style.setProperty('--r', rand(-240, 240).toFixed(0) + 'deg');
          ws.appendChild(c);
        });
        shown.appendChild(ws);
      });
      return i;
    }

    function setDots() {
      Array.prototype.forEach.call(dotsEl.children, function (d, i) {
        d.setAttribute('aria-current', String(i === current));
      });
    }

    function show(next) {
      if (busy || next === current) return;
      busy = true;
      var letters = textEl.querySelectorAll('.qc');

      // letters crumble: they fall down and drift apart, leaving dust on the canvas
      var boxRect = box.getBoundingClientRect();
      Array.prototype.forEach.call(letters, function (c, i) {
        c.style.setProperty('--dx', rand(-90, 90).toFixed(0) + 'px');
        c.style.setProperty('--dy', rand(40, 170).toFixed(0) + 'px');
        c.style.setProperty('--r', rand(-200, 200).toFixed(0) + 'deg');
        if (i % 2 === 0) {
          var r = c.getBoundingClientRect();
          addDust(r.left - boxRect.left + r.width / 2, r.top - boxRect.top + r.height / 2, i * 9);
        }
      });
      box.classList.add('is-out');

      setTimeout(function () {
        current = next;
        build(quotes[current].text);   // new letters start scattered (box is still .is-out)
        citeEl.textContent = quotes[current].by;
        setDots();
        void textEl.offsetWidth;        // let the browser place them before they fly in
        box.classList.remove('is-out');
        setTimeout(function () { busy = false; }, 900);
      }, reduceMotion ? 400 : 700 + letters.length * 9);
    }

    function schedule() {
      clearTimeout(timer);
      if (visible && !document.hidden) {
        timer = setTimeout(function () { show((current + 1) % quotes.length); schedule(); }, HOLD);
      }
    }

    quotes.forEach(function (q, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Quote ' + (i + 1) + ' of ' + quotes.length);
      d.addEventListener('click', function () { show(i); schedule(); });
      dotsEl.appendChild(d);
    });
    dotsEl.hidden = false;
    build(quotes[0].text);
    setDots();

    /* the space scene */
    var W = 0, H = 0, dpr = 1, stars = [], dust = [], meteor = null, last = 0, raf = 0;
    var planets = [
      { orbit: .34, size: 3.4, speed: .55,  color: '#22d3ee', a: 1.2 },
      { orbit: .55, size: 5.6, speed: .32,  color: '#f472b6', a: 3.9 },
      { orbit: .78, size: 7.4, speed: .2,   color: '#e8b04b', a: 5.2, ring: true },
      { orbit: 1.02, size: 4.6, speed: .13, color: '#7c6cff', a: 2.4 }
    ];

    function resize() {
      var r = box.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      var n = Math.round(W * H / 3200);
      for (var i = 0; i < n; i++) {
        stars.push({ x: Math.random() * W, y: Math.random() * H, r: rand(.3, 1.3), p: rand(0, 6.3), s: rand(.6, 2) });
      }
      if (reduceMotion) draw(0);
    }

    function addDust(x, y, delay) {
      if (reduceMotion) return;
      for (var k = 0; k < 2; k++) {
        dust.push({ x: x, y: y, vx: rand(-25, 25), vy: rand(-20, 10), life: 0, max: rand(.9, 1.6), wait: delay / 1000 });
      }
      wake();
    }

    function sun() {
      var narrow = W < 560;
      return narrow ? { x: W * .5, y: H * .1, R: W * .5 }
                    : { x: W * .84, y: H * .5, R: Math.min(W * .26, H * 1.1) };
    }

    function drawPlanet(p, cx, cy, R) {
      var rx = R * p.orbit, ry = rx * .3;
      var x = cx + Math.cos(p.a) * rx, y = cy + Math.sin(p.a) * ry;
      var depth = .8 + .35 * Math.sin(p.a);          // closer = bigger and brighter
      var r = p.size * depth;
      ctx.globalAlpha = .55 + .45 * (depth - .45);
      var g = ctx.createRadialGradient(x - r * .4, y - r * .4, r * .1, x, y, r);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(.35, p.color);
      g.addColorStop(1, 'rgba(0,0,0,.6)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      if (p.ring) {
        ctx.strokeStyle = 'rgba(232,176,75,.55)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(x, y, r * 2.1, r * .6, -.35, 0, 6.2832); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function draw(t) {
      var dt = Math.min(.05, (t - last) / 1000 || 0);
      last = t;
      ctx.clearRect(0, 0, W, H);

      // twinkling stars
      stars.forEach(function (s) {
        ctx.globalAlpha = .35 + .45 * Math.abs(Math.sin(s.p + t / 1000 * s.s));
        ctx.fillStyle = '#fff';
        ctx.fillRect(s.x, s.y, s.r, s.r);
      });
      ctx.globalAlpha = 1;

      var S = sun();
      // orbits
      ctx.strokeStyle = 'rgba(255,255,255,.07)';
      ctx.lineWidth = 1;
      planets.forEach(function (p) {
        ctx.beginPath(); ctx.ellipse(S.x, S.y, S.R * p.orbit, S.R * p.orbit * .3, 0, 0, 6.2832); ctx.stroke();
        p.a += p.speed * dt;
      });
      // planets behind the sun, the sun, then planets in front of it
      planets.forEach(function (p) { if (Math.sin(p.a) < 0) drawPlanet(p, S.x, S.y, S.R); });
      var glow = ctx.createRadialGradient(S.x, S.y, 0, S.x, S.y, S.R * .28);
      glow.addColorStop(0, 'rgba(255,236,200,1)');
      glow.addColorStop(.12, 'rgba(255,190,110,.9)');
      glow.addColorStop(.35, 'rgba(244,114,182,.25)');
      glow.addColorStop(1, 'rgba(124,108,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(S.x, S.y, S.R * .28, 0, 6.2832); ctx.fill();
      planets.forEach(function (p) { if (Math.sin(p.a) >= 0) drawPlanet(p, S.x, S.y, S.R); });

      // a shooting star now and then
      if (!meteor && Math.random() < dt * .12) {
        meteor = { x: rand(W * .1, W * .7), y: rand(0, H * .3), vx: rand(260, 380), vy: rand(80, 140), life: 0 };
      }
      if (meteor) {
        meteor.life += dt;
        meteor.x += meteor.vx * dt; meteor.y += meteor.vy * dt;
        var tail = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * .15, meteor.y - meteor.vy * .15);
        tail.addColorStop(0, 'rgba(255,255,255,.9)');
        tail.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = tail; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.vx * .15, meteor.y - meteor.vy * .15); ctx.stroke();
        if (meteor.life > 1.2 || meteor.x > W || meteor.y > H) meteor = null;
      }

      // stardust left behind by falling letters
      dust = dust.filter(function (d) {
        if (d.wait > 0) { d.wait -= dt; return true; }
        d.life += dt;
        d.vy += 60 * dt;
        d.x += d.vx * dt; d.y += d.vy * dt;
        var k = 1 - d.life / d.max;
        if (k <= 0) return false;
        ctx.globalAlpha = k;
        ctx.fillStyle = d.life < .2 ? '#fff' : '#9ee7f5';
        ctx.fillRect(d.x, d.y, 1.6, 1.6);
        return true;
      });
      ctx.globalAlpha = 1;

      raf = visible && !document.hidden && !reduceMotion ? requestAnimationFrame(draw) : 0;
    }

    function wake() {
      if (!raf && visible && !document.hidden && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    // only animate while the box is on screen and the tab is open
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) { resize(); wake(); }
        schedule();
      }, { threshold: .1 }).observe(box);
    } else {
      visible = true; wake(); schedule();
    }
    document.addEventListener('visibilitychange', function () { wake(); schedule(); });
    if (reduceMotion) draw(0);
  }

  /* ── Rotating job title ───────────────────────────────── */
  var rotator = document.getElementById('rotator');
  if (rotator && !reduceMotion) {
    var roles = [
      'Full-Stack Developer',
      'TypeScript Developer',
      'Next.js Builder',
      'Real-time App Maker',
      'AI Integrator',
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
