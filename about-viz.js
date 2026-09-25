/* ═══════════════════════════════════════════════════════════
   About cards: one small animated scene per card.
   Every <canvas class="about-viz" data-viz="…"> gets the scene named
   in data-viz. One shared animation loop draws only the scenes that
   are on screen, and stops completely when none are.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var canvases = document.querySelectorAll('canvas.about-viz');
  if (!canvases.length || !window.requestAnimationFrame) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var FONT = '"Space Grotesk", "Segoe UI", system-ui, sans-serif';
  var MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  var TAU = Math.PI * 2;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  /* colours come from the site's CSS variables, so both themes just work */
  var C = {}, colorVersion = 0;
  function readColors() {
    colorVersion++;
    cache = {};
    var cs = getComputedStyle(root);
    ['text', 'text-muted', 'text-faint', 'accent-1', 'accent-2', 'accent-3', 'border']
      .forEach(function (k) { C[k] = cs.getPropertyValue('--' + k).trim(); });
    C.light = root.getAttribute('data-theme') === 'light';
  }
  readColors();
  new MutationObserver(readColors).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  // "#7c6cff" + 0.3 → "rgba(124,108,255,0.3)", worked out once and remembered
  // (building colours as text every frame is surprisingly slow)
  var probe = document.createElement('canvas').getContext('2d');
  var cache = {};
  function alpha(color, a) {
    var key = color + a.toFixed(2);
    if (cache[key]) return cache[key];
    probe.fillStyle = '#000';
    probe.fillStyle = color;
    var c = probe.fillStyle, r = 0, g = 0, b = 0;
    if (c[0] === '#') {
      r = parseInt(c.slice(1, 3), 16); g = parseInt(c.slice(3, 5), 16); b = parseInt(c.slice(5, 7), 16);
    } else {
      var m = c.match(/[\d.]+/g) || [0, 0, 0];
      r = +m[0]; g = +m[1]; b = +m[2];
    }
    return (cache[key] = 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(2) + ')');
  }
  function fillA(ctx, color, a) { ctx.fillStyle = alpha(color, a); }

  /* letters that decode from random symbols into a word */
  var GLYPHS = '#%&*+<>/\\=?!{}[]01';
  function scramble(word, progress) {
    var out = '';
    for (var i = 0; i < word.length; i++) {
      out += progress * (word.length + 3) > i + 3 || word[i] === ' ' ? word[i] : pick(GLYPHS);
    }
    return out;
  }

  /* ── the six scenes ─────────────────────────────────────── */
  var scenes = {

    /* 🎯 Curiosity first: question marks drift to the target and turn into "!" */
    curiosity: function () {
      var marks = [], sparks = [], clock = 0;
      return function (ctx, w, h, dt) {
        clock += dt;
        var cx = w * .5, cy = h * .5;

        for (var r = 3; r >= 1; r--) {
          ctx.beginPath(); ctx.arc(cx, cy, r * 9, 0, TAU);
          fillA(ctx, r % 2 ? C['accent-1'] : C['accent-3'], .10 + (3 - r) * .08); ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, TAU); ctx.fillStyle = C['accent-2']; ctx.fill();

        if (clock > .55 && marks.length < 9) {
          clock = 0;
          var side = Math.random() < .5 ? -1 : 1;
          marks.push({ x: cx + side * rand(w * .35, w * .55), y: rand(8, h - 8), wob: rand(0, TAU),
                       sp: rand(.35, .6), size: rand(12, 18), state: 0, life: 0 });
        }

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '700 16px ' + FONT;
        marks = marks.filter(function (m) {
          m.life += dt;
          if (m.state === 0) {
            m.x += (cx - m.x) * m.sp * dt;
            m.y += (cy - m.y) * m.sp * dt + Math.sin(m.life * 3 + m.wob) * 14 * dt;
            if (Math.hypot(m.x - cx, m.y - cy) < 12) {
              m.state = 1; m.life = 0;
              for (var k = 0; k < 7; k++) sparks.push({ x: cx, y: cy, vx: rand(-60, 60), vy: rand(-60, 60), life: 0 });
            }
          }
          var fade = m.state ? Math.max(0, 1 - m.life * 1.4) : Math.min(1, m.life * 2);
          ctx.globalAlpha = fade;
          var scale = (m.state ? m.size + m.life * 14 : m.size) / 16;   // one font, scaled
          ctx.save(); ctx.translate(m.x, m.y - (m.state ? m.life * 20 : 0)); ctx.scale(scale, scale);
          ctx.fillStyle = m.state ? C['accent-2'] : C['text-muted'];
          ctx.fillText(m.state ? '!' : '?', 0, 0);
          ctx.restore();
          ctx.globalAlpha = 1;
          return fade > 0;
        });

        sparks = sparks.filter(function (s) {
          s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
          ctx.globalAlpha = Math.max(0, 1 - s.life * 2);
          ctx.fillStyle = C['accent-3'];
          ctx.fillRect(s.x, s.y, 2, 2);
          ctx.globalAlpha = 1;
          return s.life < .5;
        });
      };
    },

    /* 🧰 Front to back: UI / API / DB layers, packets travel between them,
          and each layer's tech name decodes from scrambled symbols */
    layers: function () {
      var rows = [
        { label: 'UI',  words: ['React', 'Next.js', 'Preact', 'Tailwind'], c: 'accent-1' },
        { label: 'API', words: ['Node.js', 'Deno', 'Express', 'PHP'],      c: 'accent-2' },
        { label: 'DB',  words: ['PostgreSQL', 'MongoDB', 'SQLite', 'MySQL'], c: 'accent-3' }
      ];
      rows.forEach(function (r, i) { r.i = i; r.word = 0; r.t = 1 - i * .35; r.flash = 0; });
      var packets = [], clock = 0;
      return function (ctx, w, h, dt) {
        var bandH = 20, gap = (h - bandH * 3) / 4;
        clock += dt;
        if (clock > .7) {
          clock = 0;
          packets.push({ x: rand(w * .42, w * .92), y: 0, down: Math.random() < .6, p: 0 });
        }

        rows.forEach(function (r, i) {
          var y = gap + i * (bandH + gap);
          r.y = y + bandH / 2;
          r.t += dt * .45;
          if (r.t > 1.9) { r.t = 0; r.word = (r.word + 1) % r.words.length; }
          r.flash = Math.max(0, r.flash - dt * 2.5);

          fillA(ctx, C[r.c], .10 + r.flash * .25);
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(8, y, w - 16, bandH, 6) : ctx.rect(8, y, w - 16, bandH);
          ctx.fill(); ctx.globalAlpha = 1;

          ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
          ctx.font = '700 10px ' + FONT; ctx.fillStyle = C[r.c];
          ctx.fillText(r.label, 16, r.y);
          ctx.font = '500 11px ' + MONO; ctx.fillStyle = C.text;
          ctx.fillText(scramble(r.words[r.word], Math.min(1, r.t * 1.4)), 46, r.y);
        });

        packets = packets.filter(function (pk) {
          pk.p += dt * .7;
          var top = rows[0].y, bottom = rows[2].y;
          var y = pk.down ? top + (bottom - top) * pk.p : bottom - (bottom - top) * pk.p;
          rows.forEach(function (r) { if (Math.abs(r.y - y) < 2) r.flash = 1; });
          ctx.beginPath(); ctx.arc(pk.x, y, 2.6, 0, TAU);
          ctx.fillStyle = pk.down ? C['accent-2'] : C['accent-3']; ctx.fill();
          fillA(ctx, pk.down ? C['accent-2'] : C['accent-3'], .25);
          ctx.fillRect(pk.x - .75, pk.down ? y - 14 : y, 1.5, 14);
          ctx.globalAlpha = 1;
          return pk.p < 1;
        });
      };
    },

    /* 🤖 AI and real time: a tiny chat; the answer streams in letter by letter */
    chat: function () {
      var talks = [
        ['plan my week', 'Mon: soup · Tue: pasta · Wed: salad…'],
        ['a book for tonight?', 'Try "Solaris" by Stanisław Lem'],
        ['hi from Vilnius 👋', 'hi from Kaunas! live on WebRTC ⚡']
      ];
      var n = 0, t = 0;
      function bubble(ctx, text, x, y, right, color, textColor) {
        ctx.font = '500 11px ' + FONT;
        var tw = ctx.measureText(text).width, bw = tw + 18, bh = 22;
        var bx = right ? x - bw : x;
        fillA(ctx, color, right ? .9 : .16);
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y, bw, bh, 10) : ctx.rect(bx, y, bw, bh);
        ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = textColor; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        ctx.fillText(text, bx + 9, y + bh / 2 + .5);
        return bx + bw;
      }
      return function (ctx, w, h, dt) {
        t += dt;
        var q = talks[n][0], a = talks[n][1];
        var qIn = Math.min(1, t / .35);
        ctx.globalAlpha = qIn;
        bubble(ctx, q, w - 10, 10 + (1 - qIn) * 8, true, C['accent-1'], '#fff');
        ctx.globalAlpha = 1;

        if (t > .7 && t < 1.4) {                      // "typing…" dots
          for (var d = 0; d < 3; d++) {
            ctx.beginPath();
            ctx.arc(20 + d * 9, 60 + Math.sin(t * 10 + d) * 2, 2.4, 0, TAU);
            ctx.fillStyle = C['text-muted']; ctx.fill();
          }
        }
        if (t >= 1.4) {
          var chars = Array.from(a);
          var shown = chars.slice(0, Math.floor((t - 1.4) * 22)).join('');
          var end = bubble(ctx, shown || ' ', 10, 50, false, C['accent-2'], C.text);
          if (shown.length < chars.length && Math.floor(t * 4) % 2) {
            ctx.fillStyle = C['accent-2']; ctx.fillRect(end - 8, 55, 1.5, 12);
          }
          if (t > 1.4 + chars.length / 22 + 2.2) { t = 0; n = (n + 1) % talks.length; }
        }
      };
    },

    /* 🚀 Finished, not just started: the checklist fills, then the rocket launches */
    launch: function () {
      var items = ['live demo', 'README', 'light/dark', 'mobile', 'CI ✓'];
      var t = 0, trail = [];
      return function (ctx, w, h, dt) {
        t += dt;
        var step = .7, done = Math.min(items.length, Math.floor(t / step));
        ctx.font = '600 10.5px ' + FONT; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';

        var x = 10, y = 16;
        items.forEach(function (it, i) {
          var label = (i < done ? '✓ ' : '○ ') + it;
          var tw = ctx.measureText(label).width + 14;
          if (x + tw > w - 44) { x = 10; y += 24; }
          fillA(ctx, i < done ? C['accent-2'] : C['text-faint'], i < done ? .18 : .10);
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y - 9, tw, 18, 9) : ctx.rect(x, y - 9, tw, 18);
          ctx.fill(); ctx.globalAlpha = 1;
          ctx.fillStyle = i < done ? C.text : C['text-faint'];
          ctx.fillText(label, x + 7, y);
          x += tw + 6;
        });

        // progress bar
        var p = Math.min(1, t / (step * items.length));
        fillA(ctx, C['text-faint'], .2);
        ctx.fillRect(10, h - 12, w - 60, 4); ctx.globalAlpha = 1;
        ctx.fillStyle = C['accent-2']; ctx.fillRect(10, h - 12, (w - 60) * p, 4);
        ctx.fillStyle = C['accent-1']; ctx.fillRect(10, h - 12, (w - 60) * p * .5, 4);

        // rocket: waits on the pad, then lifts off with a trail of sparks
        var lift = Math.max(0, t - step * items.length - .3);
        var rx = w - 24, ry = h - 16 - lift * lift * 90;
        if (lift > 0) trail.push({ x: rx + rand(-2, 2), y: ry + 10, life: 0 });
        trail = trail.filter(function (s) {
          s.life += dt; s.y += 30 * dt;
          ctx.globalAlpha = Math.max(0, 1 - s.life * 2);
          ctx.fillStyle = s.life < .15 ? '#ffd27a' : C['accent-3'];
          ctx.fillRect(s.x, s.y, 2, 2);
          ctx.globalAlpha = 1;
          return s.life < .5;
        });
        ctx.save(); ctx.translate(rx, ry);                 // a little rocket, drawn with shapes
        ctx.fillStyle = C['accent-3'];                      // fins
        ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(-2, 0); ctx.lineTo(-2, 7); ctx.fill();
        ctx.beginPath(); ctx.moveTo(6, 6); ctx.lineTo(2, 0); ctx.lineTo(2, 7); ctx.fill();
        ctx.fillStyle = C.light ? '#e9ecf5' : '#f2f3f8';  // body
        ctx.beginPath(); ctx.moveTo(0, -11); ctx.quadraticCurveTo(5, -4, 3.5, 7);
        ctx.lineTo(-3.5, 7); ctx.quadraticCurveTo(-5, -4, 0, -11); ctx.fill();
        ctx.strokeStyle = C['text-faint']; ctx.lineWidth = .8; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -2.5, 1.8, 0, TAU); ctx.fillStyle = C['accent-2']; ctx.fill();  // window
        if (lift > 0 || Math.floor(t * 8) % 2) {           // flame
          ctx.fillStyle = '#ffb347';
          ctx.beginPath(); ctx.moveTo(-2.5, 7.5); ctx.lineTo(0, 12 + Math.random() * 5); ctx.lineTo(2.5, 7.5); ctx.fill();
        }
        ctx.restore();

        if (ry < -30) { t = 0; trail = []; }
      };
    },

    /* ⚙️ Precision background: a CNC tool engraves the glyph row by row */
    cnc: function () {
      var glyphs = ['</>', '{ }', 'CNC'], gi = 0;
      var mask = document.createElement('canvas'), mctx = mask.getContext('2d');
      var ink = null, mw = 0, mh = 0, mv = -1, row = 0, col = 0, dir = 1, hold = 0, sparks = [];
      var STEP = 3, SPEED = 520;

      function prepare(w, h) {
        mw = Math.round(w); mh = Math.round(h);
        mask.width = mw; mask.height = mh;
        mctx.clearRect(0, 0, mw, mh);
        mctx.fillStyle = '#000'; mctx.textAlign = 'center'; mctx.textBaseline = 'middle';
        mctx.font = '700 ' + Math.round(h * .72) + 'px ' + FONT;
        mctx.fillText(glyphs[gi], mw / 2, mh / 2 + 2);
        ink = mctx.getImageData(0, 0, mw, mh).data;
        paint();
        row = 8; col = 12; dir = 1; hold = 0;
      }
      function paint() {              // colour the glyph in the current theme's accents
        mv = colorVersion;
        mctx.globalCompositeOperation = 'source-in';
        var g = mctx.createLinearGradient(0, 0, mw, mh);
        g.addColorStop(0, C['accent-1']); g.addColorStop(1, C['accent-2']);
        mctx.fillStyle = g; mctx.fillRect(0, 0, mw, mh);
        mctx.globalCompositeOperation = 'source-over';
      }
      function solid(x, y) {
        x = Math.round(x); y = Math.round(y);
        if (x < 0 || y < 0 || x >= mw || y >= mh) return false;
        return ink[(y * mw + x) * 4 + 3] > 80;
      }

      return function (ctx, w, h, dt) {
        if (Math.round(w) !== mw || Math.round(h) !== mh) prepare(w, h);
        else if (mv !== colorVersion) paint();

        // the workpiece: a faint grid like a machine bed
        ctx.strokeStyle = alpha(C['text-faint'], .18); ctx.lineWidth = 1;
        ctx.beginPath();
        for (var gx = 12; gx < w; gx += 16) { ctx.moveTo(gx, 0); ctx.lineTo(gx, h); }
        ctx.stroke();

        // everything already cut: rows above, and this row up to the tool
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, row);
        if (dir > 0) ctx.rect(0, row, col, STEP); else ctx.rect(col, row, w - col, STEP);
        ctx.clip();
        ctx.drawImage(mask, 0, 0, w, h);
        ctx.restore();

        if (hold > 0) {
          hold -= dt;
          if (hold <= 0) { gi = (gi + 1) % glyphs.length; mw = 0; }
        } else {
          col += dir * SPEED * dt;
          if (col > w - 12 || col < 12) { col = Math.max(12, Math.min(w - 12, col)); dir = -dir; row += STEP; }
          if (row > h - 6) hold = 1.6;
          if (solid(col, row + 1) && Math.random() < .7) {
            sparks.push({ x: col, y: row, vx: rand(-80, 80), vy: rand(-90, -20), life: 0 });
          }
        }

        sparks = sparks.filter(function (s) {
          s.life += dt; s.vy += 260 * dt; s.x += s.vx * dt; s.y += s.vy * dt;
          ctx.globalAlpha = Math.max(0, 1 - s.life * 2.5);
          ctx.fillStyle = '#ffc56b'; ctx.fillRect(s.x, s.y, 1.6, 1.6);
          ctx.globalAlpha = 1;
          return s.life < .4;
        });

        if (hold <= 0) {                       // the tool itself
          ctx.fillStyle = C.text;
          ctx.fillRect(col - 1, 0, 2, row);
          ctx.beginPath(); ctx.arc(col, row + 1, 3, 0, TAU);
          ctx.fillStyle = '#ffc56b'; ctx.fill();
        }
      };
    },

    /* 🌲 Off the keyboard: letters fall like leaves into a pond, a float bobs */
    pond: function () {
      var leaves = [], rings = [], clock = 0, t = 0;
      var KEYS = 'asdfjklqwertyuiop';
      return function (ctx, w, h, dt) {
        t += dt; clock += dt;
        var water = h - 22;

        // two little pines on the shore
        [[16, 1], [34, .75]].forEach(function (p) {
          var s = p[1], bx = p[0], by = water;
          ctx.fillStyle = alpha(C['accent-2'], C.light ? .55 : .4);
          for (var k = 0; k < 3; k++) {
            ctx.beginPath();
            ctx.moveTo(bx, by - (34 - k * 9) * s);
            ctx.lineTo(bx - (11 - k * 1.5) * s, by - (14 - k * 9) * s + 6 * s);
            ctx.lineTo(bx + (11 - k * 1.5) * s, by - (14 - k * 9) * s + 6 * s);
            ctx.fill();
          }
        });

        // water
        ctx.fillStyle = alpha(C['accent-1'], .2);
        ctx.beginPath(); ctx.moveTo(0, h);
        for (var x = 0; x <= w; x += 6) ctx.lineTo(x, water + Math.sin(x / 18 + t * 1.6) * 1.2);
        ctx.lineTo(w, h); ctx.fill();

        // fishing line and float
        var fx = w * .78, fy = water - 1 + Math.sin(t * 2.2) * 1.8;
        ctx.strokeStyle = alpha(C['text-muted'], .6); ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(w - 4, 2); ctx.quadraticCurveTo(w * .9, fy - 40, fx, fy - 4); ctx.stroke();
        ctx.beginPath(); ctx.arc(fx, fy - 2, 3.4, Math.PI, 0); ctx.fillStyle = '#f25f5c'; ctx.fill();
        ctx.beginPath(); ctx.arc(fx, fy - 2, 3.4, 0, Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
        if (Math.random() < dt * .6) rings.push({ x: fx, y: water + 1, r: 3, life: 0 });

        // falling letters
        if (clock > .8 && leaves.length < 7) {
          clock = 0;
          leaves.push({ x: rand(60, w - 30), y: -8, sway: rand(0, TAU), rot: rand(-.5, .5),
                        ch: pick(KEYS), vy: rand(12, 20), landed: 0 });
        }
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        leaves = leaves.filter(function (l) {
          if (!l.landed) {
            l.y += l.vy * dt;
            l.x += Math.sin(t * 1.6 + l.sway) * 16 * dt;
            l.rot += Math.sin(t + l.sway) * dt;
            if (l.y >= water - 4) { l.landed = .001; rings.push({ x: l.x, y: water + 1, r: 2, life: 0 }); }
          } else {
            l.landed += dt; l.x += 6 * dt;
          }
          var a = l.landed ? Math.max(0, 1 - l.landed / 1.6) : Math.min(1, (l.y + 8) / 20);
          ctx.globalAlpha = a;
          ctx.save(); ctx.translate(l.x, l.y + (l.landed ? l.landed * 3 : 0)); ctx.rotate(l.rot);
          ctx.font = '600 13px ' + MONO; ctx.fillStyle = C.text; ctx.fillText(l.ch, 0, 0);
          ctx.restore(); ctx.globalAlpha = 1;
          return a > 0;
        });

        rings = rings.filter(function (r) {
          r.life += dt; r.r += 14 * dt;
          ctx.strokeStyle = alpha(C.text, Math.max(0, .5 - r.life * .35)); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * .3, 0, 0, TAU); ctx.stroke();
          return r.life < 1.4;
        });
      };
    }
  };

  /* ── one loop for all of them ──────────────────────────── */
  var items = [];
  Array.prototype.forEach.call(canvases, function (cv) {
    var make = scenes[cv.getAttribute('data-viz')];
    if (!make) return;
    items.push({ cv: cv, ctx: cv.getContext('2d'), draw: make(), w: 0, h: 0, on: false });
  });

  function size(it) {
    var r = it.cv.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    it.w = r.width; it.h = r.height;
    it.cv.width = Math.round(r.width * dpr);
    it.cv.height = Math.round(r.height * dpr);
    it.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(it, dt) {
    if (!it.w) size(it);
    if (!it.w) return;
    it.ctx.clearRect(0, 0, it.w, it.h);
    it.draw(it.ctx, it.w, it.h, dt);
  }

  // small scenes don't need 60 fps: drawing at ~30 halves the work
  var raf = 0, last = 0, acc = 0;
  function loop(now) {
    acc += Math.min(.1, (now - last) / 1000 || 0);
    last = now;
    var any = false, draw = acc >= 1 / 32;
    items.forEach(function (it) { if (it.on) { any = true; if (draw) frame(it, Math.min(.06, acc)); } });
    if (draw) acc = 0;
    raf = any && !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function start() {
    if (reduceMotion || raf || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', function () {
    items.forEach(function (it) { it.w = 0; if (reduceMotion) frame(it, 0); });
  });
  document.addEventListener('visibilitychange', start);

  if (reduceMotion) {
    // a single still picture of each scene, a moment into its story
    items.forEach(function (it) { for (var k = 0; k < 90; k++) frame(it, 1 / 30); });
    new MutationObserver(function () { items.forEach(function (it) { frame(it, 0); }); })
      .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return;
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        items.forEach(function (it) { if (it.cv === e.target) it.on = e.isIntersecting; });
      });
      start();
    });
    items.forEach(function (it) { io.observe(it.cv); });
  } else {
    items.forEach(function (it) { it.on = true; });
    start();
  }
})();
