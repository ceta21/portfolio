(function () {
  'use strict';
  var D = window.DATA;
  var $ = function (s) { return document.querySelector(s); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- contenido ---------- */
  $('#n1').textContent = D.nombre[0];
  $('#n2').textContent = D.nombre[1];
  $('#hero-title').textContent = D.titulo;
  $('#hero-intro').textContent = D.intro;
  $('#btn-cv').href = D.cv; $('#btn-cv').setAttribute('download', '');
  $('#btn-li').href = D.linkedin;
  $('#foto').src = D.foto;
  $('#foto-practicas').src = D.fotoPracticas;

  var track = $('#marquee-roles');
  var seq = D.roles.map(function (r) { return '<span>' + esc(r) + '</span><i>●</i>'; }).join('');
  track.innerHTML = seq + seq;

  var stats = $('#stats');
  D.stats.forEach(function (s, i) {
    var d = el('div', 'stat reveal');
    d.style.setProperty('--d', i * 0.08 + 's');
    var isNum = typeof s.n === 'number';
    d.innerHTML = '<div class="stat__n"><span' + (isNum ? ' data-count="' + s.n + '"' : '') + '>' + (isNum ? '0' : esc(s.n)) + '</span>' + (s.suf ? '<sup>' + esc(s.suf) + '</sup>' : '') + '</div><p class="stat__t">' + esc(s.t) + '</p>';
    stats.appendChild(d);
  });

  $('#perfil-lead').textContent = D.intro;
  var facts = [['Ubicación', esc(D.ubicacion)], ['Email', '<a href="mailto:' + esc(D.email) + '">' + esc(D.email) + '</a>'], ['Teléfono', '<a href="tel:' + esc(D.telefonoLink) + '">' + esc(D.telefono) + '</a>'], ['LinkedIn', '<a href="' + esc(D.linkedin) + '" target="_blank" rel="noopener">' + esc(D.linkedinTexto) + '</a>']];
  $('#facts').innerHTML = facts.map(function (f) { return '<div class="reveal"><dt class="mono">' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('');

  function rows(target, items) {
    var ul = $(target);
    items.forEach(function (it, i) {
      var li = el('li', 'row reveal');
      li.style.setProperty('--d', Math.min(i, 5) * 0.06 + 's');
      var link = it[3] ? '<a class="row__a" href="' + esc(it[3]) + '" target="_blank" rel="noopener">Ver certificado</a>' : '';
      li.innerHTML = '<div class="row__in"><span class="row__i mono">' + pad2(i + 1) + '</span><div class="row__t">' + esc(it[0]) + '</div><div class="row__s">' + esc(it[1]) + link + '</div><div class="row__d mono">' + esc(it[2] || '') + '</div></div>';
      ul.appendChild(li);
    });
  }
  rows('#rows-formacion', D.formacion);
  rows('#rows-cursos', D.cursos);
  rows('#rows-exp', D.experiencia);

  var proy = $('#rows-proy');
  D.proyectos.forEach(function (p, i) {
    var li = el('li', 'row reveal');
    li.style.setProperty('--d', i * 0.08 + 's');
    var t = p[3] ? '<a href="' + esc(p[3]) + '" target="_blank" rel="noopener">' + esc(p[0]) + ' ↗</a>' : esc(p[0]);
    li.innerHTML = '<div class="row__in"><span class="row__i mono">' + pad2(i + 1) + '</span><div class="row__t">' + t + '</div><div class="row__s">' + esc(p[1]) + '</div><div class="row__d mono">' + esc(p[2]) + '</div></div>';
    proy.appendChild(li);
  });

  $('#skills').innerHTML = D.competencias.map(function (c, i) { return '<li class="reveal" style="--d:' + Math.min(i, 5) * 0.05 + 's"><span class="n">' + pad2(i + 1) + '</span><strong>' + esc(c) + '</strong></li>'; }).join('');
  $('#aptitudes').innerHTML = D.aptitudes.map(function (a) { return '<li class="reveal">' + esc(a) + '</li>'; }).join('');
  $('#idiomas').innerHTML = D.idiomas.map(function (a) { return '<li class="reveal">' + esc(a[0]) + '<small>' + esc(a[1]) + '</small></li>'; }).join('');
  $('#otros').innerHTML = D.otros.map(function (a) { return '<li class="reveal">' + esc(a) + '</li>'; }).join('');

  $('#mail').href = 'mailto:' + D.email;
  $('#mail-text').textContent = D.email;
  $('#contact').innerHTML =
    '<a class="reveal" href="tel:' + esc(D.telefonoLink) + '"><small class="mono">Teléfono</small><b>' + esc(D.telefono) + '</b></a>' +
    '<a class="reveal" style="--d:.08s" href="' + esc(D.linkedin) + '" target="_blank" rel="noopener"><small class="mono">LinkedIn</small><b>' + esc(D.linkedinTexto) + ' ↗</b></a>' +
    '<div class="reveal" style="--d:.16s"><small class="mono">Ubicación</small><b>' + esc(D.ubicacion) + '</b></div>';

  // títulos de sección: envolver para la máscara
  document.querySelectorAll('.sec__head h2').forEach(function (h) {
    var t = h.textContent, k = 0;
    h.setAttribute('aria-label', t);
    h.innerHTML = '<span aria-hidden="true">' + t.split('').map(function (c) { return '<span class="ch" style="--i:' + (k++) + '">' + (c === ' ' ? '&nbsp;' : c) + '</span>'; }).join('') + '</span>';
  });

  /* ---------- entrada del hero ---------- */
  requestAnimationFrame(function () { setTimeout(function () { document.documentElement.classList.add('is-ready'); }, 120); });

  /* ---------- reveals con IntersectionObserver ---------- */
  var targets = document.querySelectorAll('.reveal,.reveal-clip,.sec__head,.mail');
  function countUp(node) {
    var end = +node.getAttribute('data-count'), t0 = null, dur = 1600;
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1); node.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); t.querySelectorAll('[data-count]').forEach(function (n) { n.textContent = n.getAttribute('data-count'); }); });
  }

  /* ---------- efectos ligados al scroll ---------- */
  var bar = $('#progress'), n1 = $('#n1'), n2 = $('#n2'), hero = $('#hero');
  var parallax = document.querySelectorAll('.profile__photo img,.exp__photo img');
  var navLinks = [].slice.call(document.querySelectorAll('.top__nav a'));
  var secs = navLinks.map(function (a) { return $(a.getAttribute('href')); });
  var ticking = false;
  var skillLis = [].slice.call(document.querySelectorAll('.skills li'));
  var lastY = window.scrollY, vel = 0;

  function frame() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (!reduce && y < hero.offsetHeight * 1.5) hero.style.setProperty('--sy', y);
    if (!reduce) {
      var hh = hero.offsetHeight;
      if (y < hh * 1.2) {
        // los dos apellidos se separan en sentidos opuestos al hacer scroll
        n1.parentNode.style.transform = 'translateX(' + (-y * 0.18) + 'px)';
        n2.parentNode.style.transform = 'translateX(' + (y * 0.18) + 'px)';
      }
      parallax.forEach(function (im) {
        var r = im.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        im.style.transform = 'translateY(' + (-p * 8) + '%)';
      });
    }
    if (!reduce) {
      skillLis.forEach(function (li, i) {
        var r = li.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        li.style.setProperty('--dx', (p * (i % 2 ? -5 : 5)) + 'vw');
      });
    }
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* ---------- marquee: la velocidad sigue al scroll ---------- */
  if (!reduce && track.getAnimations) {
    (function loop() {
      var y = window.scrollY, d = Math.abs(y - lastY); lastY = y;
      vel += (Math.min(d, 60) / 12 - vel) * 0.08;
      var a = track.getAnimations()[0];
      if (a) a.playbackRate = 1 + vel * 2.2;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- botones magnéticos ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.22) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.35) + 'px';
      });
      b.addEventListener('mouseleave', function () { b.style.translate = ''; });
    });
  }

  /* ---------- reloj de Sevilla ---------- */
  var clock = $('#clock');
  function tick() {
    try { clock.textContent = 'Sevilla ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }); } catch (e) { clock.textContent = ''; }
  }
  tick(); setInterval(tick, 20000);
})();
