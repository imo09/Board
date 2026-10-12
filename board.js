/* [board] 1.2 - come si comporta la pagina.
   I contenuti (app, skill, descrizioni) stanno in index.html: per aggiungerne non serve toccare questo file. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var EN = !/^it\b/i.test(navigator.language || 'it');
  var T = EN ? {
    apri: 'Open', notaTocco: 'Or tap the icon again.', notaRapido: 'Press and hold an icon to see these details again.',
    ios: 'On iPhone it opens in the browser, with separate data: the installed app opens from the Home Screen.',
    come: 'How it works', contiene: 'Contents', leggi: 'Read all', sintesi: 'Summary', copia: 'Copy text', copiato: 'Copied',
    nonCopiato: 'Copy failed', scarica: 'Download .md', carico: 'Loading', errore: 'File not reachable: try again when online.',
    esempio: 'example', tipoSkill: 'Markdown skill', chiudi: 'Close', minuti: function (n) { return 'About ' + n + ' min read.'; }
  } : {
    apri: 'Apri', notaTocco: "Oppure tocca di nuovo l'icona.", notaRapido: "Tieni premuta un'icona per rivedere questi dettagli.",
    ios: "Su iPhone si apre nel browser, con dati separati: l'app installata si apre dalla schermata Home.",
    come: 'Come funziona', contiene: 'Contiene', leggi: 'Leggi tutto', sintesi: 'Sintesi', copia: 'Copia testo', copiato: 'Copiato',
    nonCopiato: 'Copia non riuscita', scarica: 'Scarica .md', carico: 'Caricamento', errore: 'File non raggiungibile: riprova con la rete attiva.',
    esempio: 'esempio', tipoSkill: 'skill in Markdown', chiudi: 'Chiudi', minuti: function (n) { return 'Circa ' + n + ' min di lettura.'; }
  };
  var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Scorciatoie dalla pressione lunga sull'icona di [board] (Android): ?apri=folio porta subito a folio
  var chiesta = new URLSearchParams(location.search).get('apri');
  var meta = /^[a-z]+$/.test(chiesta || '') && $('.app[data-id="' + chiesta + '"]');
  if (meta) { scrivi('board.ultima', chiesta); location.replace(meta.href); return; }

  // Funziona anche senza rete; le skill vengono salvate appena il service worker è attivo
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
    var riscalda = function () { $$('.skill').forEach(function (s) { fetch(s.dataset.md).catch(function () {}); }); };
    if (navigator.serviceWorker.controller) setTimeout(riscalda, 1200);
    else navigator.serviceWorker.addEventListener('controllerchange', function () { setTimeout(riscalda, 300); }, { once: true });
  }

  function traduci(radice) {
    if (EN) $$('[data-en]', radice).forEach(function (n) { n.textContent = n.getAttribute('data-en'); });
  }
  if (EN) { document.documentElement.lang = 'en'; traduci(document); }

  // Interruttore "Apri al primo tocco", ricordato sul dispositivo
  var rapido = $('#rapido');
  rapido.checked = leggi('board.rapido') === '1';
  rapido.addEventListener('change', function () { scrivi('board.rapido', rapido.checked ? '1' : '0'); nota(); });

  // Ultima app aperta: un punto sotto il nome
  function segna(id) { $$('.app').forEach(function (a) { a.classList.toggle('ultima', a.dataset.id === id); }); }
  function aperta(id) { scrivi('board.ultima', id); segna(id); }
  segna(leggi('board.ultima'));

  // ---------- riquadro dei dettagli ----------
  var P = $('#pannello'), pIco = $('.p-ico', P), pNome = $('#pNome'), pSotto = $('.p-sotto', P),
      pCorpo = $('.p-corpo', P), pAzioni = $('.p-azioni', P);
  var corrente = null, lettura = false, testi = {}, pronti = {};
  $('.p-chiudi', P).setAttribute('aria-label', T.chiudi);
  if (history.state && history.state.pannello) history.replaceState(null, '');

  function mostra(v) {
    if (!P.classList.contains('aperto')) { try { history.pushState({ pannello: 1 }, ''); } catch (e) {} }
    if (corrente) corrente.setAttribute('aria-expanded', 'false');
    corrente = v;
    v.setAttribute('aria-expanded', 'true');
    pIco.innerHTML = $('.ico', v).innerHTML;
    pIco.classList.toggle('skill-ico', v.classList.contains('skill'));
    pNome.textContent = $('.nm', v).textContent;
    if (v.classList.contains('app')) dettagliApp(v); else dettagliSkill(v);
    P.classList.add('aperto');
    document.body.classList.add('aperto');
  }

  function chiudi(dallaStoria) {
    if (!P.classList.contains('aperto')) return;
    P.classList.remove('aperto', 'lettura');
    document.body.classList.remove('aperto', 'lettura');
    if (corrente) corrente.setAttribute('aria-expanded', 'false');
    corrente = null;
    lettura = false;
    if (!dallaStoria && history.state && history.state.pannello) history.back();
  }
  addEventListener('popstate', function () { chiudi(true); });

  function dettagliApp(v) {
    lettura = false;
    P.classList.remove('lettura');
    document.body.classList.remove('lettura');
    pSotto.textContent = new URL(v.href).hostname;
    pCorpo.innerHTML = '';
    pCorpo.appendChild(v.parentNode.querySelector('template.info').content.cloneNode(true));
    traduci(pCorpo);
    var ul = $('ul', pCorpo);
    if (ul) ul.insertAdjacentHTML('beforebegin', '<h3 class="p-etichetta">' + T.come + '</h3>');
    pAzioni.innerHTML = '<a class="btn primario" id="pApri" href="' + esc(v.href) + '">' + esc(T.apri + ' ' + pNome.textContent) + '</a>' +
      '<p class="p-nota" id="pNota"></p>' + (IOS ? '<p class="p-nota">' + T.ios + '</p>' : '');
    nota();
    pCorpo.scrollTop = 0;
  }
  function nota() { var n = $('#pNota'); if (n) n.textContent = rapido.checked ? T.notaRapido : T.notaTocco; }

  function dettagliSkill(v) {
    var url = v.dataset.md;
    pSotto.innerHTML = '<span>' + T.tipoSkill + '</span>' + (v.hasAttribute('data-esempio') ? '<span class="tag">' + T.esempio + '</span>' : '');
    pAzioni.innerHTML = '<button class="btn primario" id="pLeggi" type="button"></button>' +
      '<button class="btn" id="pCopia" type="button">' + T.copia + '</button>' +
      '<a class="btn" id="pScarica" href="' + esc(url) + '" download="' + esc(url.split('/').pop()) + '">' + T.scarica + '</a>';
    sintesi(v);
  }

  function sintesi(v) {
    lettura = false;
    P.classList.remove('lettura');
    document.body.classList.remove('lettura');
    $('#pLeggi').textContent = T.leggi;
    pCorpo.innerHTML = '<p class="p-desc">' + esc($('.sintesi', v).textContent) + '</p>' +
      '<h3 class="p-etichetta">' + T.contiene + '</h3><div id="pIndice" class="p-nota">' + T.carico + '</div>';
    pCorpo.scrollTop = 0;
    carica(v.dataset.md).then(function (md) {
      var posto = $('#pIndice');
      if (corrente !== v || lettura || !posto) return;
      var testo = corpo(md);
      var titoli = (testo.match(/^##\s+.+$/gm) || []).map(function (t) { return t.replace(/^##\s+/, '').replace(/[*`]/g, ''); });
      var parole = testo.split(/\s+/).filter(Boolean).length;
      posto.outerHTML = (titoli.length ? '<ul>' + titoli.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '<p class="p-nota">' + T.minuti(Math.max(1, Math.round(parole / 200))) + '</p>';
    }, function () { var posto = $('#pIndice'); if (corrente === v && posto) posto.textContent = T.errore; });
  }

  function leggiTutto(v) {
    lettura = true;
    P.classList.add('lettura');
    document.body.classList.add('lettura');
    $('#pLeggi').textContent = T.sintesi;
    pCorpo.innerHTML = '<div class="md p-nota">' + T.carico + '</div>';
    pCorpo.scrollTop = 0;
    carica(v.dataset.md).then(function (md) {
      if (corrente === v && lettura) { pCorpo.firstChild.className = 'md'; pCorpo.firstChild.innerHTML = rendi(md); }
    }, function () { if (corrente === v && lettura) pCorpo.firstChild.textContent = T.errore; });
  }

  function carica(url) {
    if (!testi[url]) {
      testi[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
      testi[url].then(function (t) { pronti[url] = t; }, function () { delete testi[url]; });
    }
    return testi[url];
  }

  function copia(btn) {
    var url = corrente.dataset.md;
    var fatto = function () { esito(btn, T.copiato); }, fallito = function () { esito(btn, T.nonCopiato); };
    // il testo è già scaricato all'apertura del riquadro: la copia parte subito, dentro il tocco
    if (pronti[url] != null) appunti(pronti[url]).then(fatto, fallito);
    else carica(url).then(appunti).then(fatto, fallito);
  }
  function appunti(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    var a = document.createElement('textarea');
    a.value = t; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(a); a.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    a.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error('copia'));
  }
  function esito(btn, testo) {
    btn.textContent = testo;
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.textContent = T.copia; }, 1600);
  }

  P.addEventListener('click', function (e) {
    if (e.target.closest('.p-chiudi')) chiudi();
    else if (e.target.closest('#pLeggi')) { if (lettura) sintesi(corrente); else leggiTutto(corrente); }
    else if (e.target.closest('#pCopia')) copia(e.target.closest('#pCopia'));
    else if (e.target.closest('#pApri')) aperta(corrente.dataset.id);
  });

  // ---------- tocchi ----------
  // Tocco: dettagli (oppure apre subito, se l'interruttore è acceso). Secondo tocco sulla stessa voce: apre l'app o legge tutta la skill.
  // Pressione lunga o clic destro: sempre i dettagli.
  var lungo = false, timer = null, x0 = 0, y0 = 0;
  document.addEventListener('pointerdown', function (e) {
    lungo = false;
    clearTimeout(timer);
    var v = e.target.closest('.voce');
    if (!v || e.pointerType === 'mouse') return;
    x0 = e.clientX; y0 = e.clientY;
    timer = setTimeout(function () { lungo = true; mostra(v); if (navigator.vibrate) navigator.vibrate(8); }, 450);
  });
  document.addEventListener('pointermove', function (e) { if (Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 12) clearTimeout(timer); });
  ['pointerup', 'pointercancel'].forEach(function (t) { document.addEventListener(t, function () { clearTimeout(timer); }); });
  document.addEventListener('contextmenu', function (e) {
    var v = e.target.closest('.voce');
    if (!v) return;
    e.preventDefault();
    if (!lungo) mostra(v);
  });

  document.addEventListener('click', function (e) {
    var v = e.target.closest('.voce');
    if (v) {
      if (lungo) { e.preventDefault(); lungo = false; return; }
      if (v.classList.contains('app')) {
        if (rapido.checked || corrente === v || e.ctrlKey || e.metaKey || e.shiftKey) { aperta(v.dataset.id); return; }
        e.preventDefault();
        mostra(v);
      } else if (corrente === v) {
        if (!lettura) leggiTutto(v);
      } else {
        mostra(v);
      }
      return;
    }
    if (!e.target.closest('.pannello, .interruttore')) chiudi();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudi(); });

  // ---------- Markdown essenziale: titoli, paragrafi, elenchi, tabelle, codice, citazioni ----------
  function corpo(md) { return md.replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n*/, ''); }
  function inl(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  function celle(r) { return r.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return inl(c.trim()); }); }
  var VOCE = /^\s*([-*+]|\d+[.)])\s+(.*)$/;
  function rendi(md) {
    var r = corpo(md).split('\n'), h = '', i = 0, m;
    while (i < r.length) {
      var l = r[i];
      if (!l.trim()) { i++; continue; }
      if (/^```/.test(l)) {
        var c = []; i++;
        while (i < r.length && !/^```/.test(r[i])) c.push(r[i++]);
        i++; h += '<pre><code>' + esc(c.join('\n')) + '</code></pre>'; continue;
      }
      if ((m = l.match(/^(#{1,3})\s+(.*)$/))) { var n = m[1].length + 2; h += '<h' + n + '>' + inl(m[2]) + '</h' + n + '>'; i++; continue; }
      if (/^\s*(-{3,}|\*{3,})\s*$/.test(l)) { h += '<hr>'; i++; continue; }
      if (/^\s*\|/.test(l) && /^\s*\|?\s*:?-{2,}/.test(r[i + 1] || '')) {
        var t = '<div class="tabella"><table><thead><tr>' + celle(l).map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>';
        i += 2;
        while (i < r.length && /^\s*\|/.test(r[i])) t += '<tr>' + celle(r[i++]).map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>';
        h += t + '</tbody></table></div>'; continue;
      }
      if ((m = l.match(VOCE))) {
        var ord = /\d/.test(m[1]), voci = [];
        while (i < r.length && (m = r[i].match(VOCE)) && /\d/.test(m[1]) === ord) { voci.push('<li>' + inl(m[2]) + '</li>'); i++; }
        h += (ord ? '<ol>' : '<ul>') + voci.join('') + (ord ? '</ol>' : '</ul>'); continue;
      }
      if (/^>/.test(l)) {
        var q = [];
        while (i < r.length && /^>/.test(r[i])) q.push(r[i++].replace(/^>\s?/, ''));
        h += '<blockquote>' + inl(q.join(' ')) + '</blockquote>'; continue;
      }
      var p = [r[i++]];
      while (i < r.length && r[i].trim() && !/^(#{1,3}\s|```|>|\s*\|)/.test(r[i]) && !VOCE.test(r[i])) p.push(r[i++]);
      h += '<p>' + inl(p.join(' ')) + '</p>';
    }
    return h;
  }
})();
