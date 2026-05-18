// ===== Hole data Toxandria (Baanboekje 2026) =====
// Lengtes in meter. Tees: white, yellow, blue, red, orange
const HOLES = [
  { n: 1,  par: 4, si: 15, w: 340, y: 320, b: 302, r: 275, o: 240,
    tip: "Korte par 4 met dogleg rechts. Houd je drive iets links van het midden om vrij zicht op de green te houden. Bunker links op ca. 100m." },
  { n: 2,  par: 5, si: 13, w: 453, y: 453, b: 383, r: 372, o: 356,
    tip: "Rechte par 5. Smal door bos aan beide kanten. Speel veilig naar de fairway, dan twee gecontroleerde slagen naar de green." },
  { n: 3,  par: 4, si: 7,  w: 330, y: 318, b: 318, r: 300, o: 256,
    tip: "Dogleg licht rechts. OB-palen rechts &mdash; mik op de linker fairwayhelft. Bunker kort links voor de green." },
  { n: 4,  par: 3, si: 17, w: 129, y: 115, b: 115, r: 107, o: 90,
    tip: "Korte par 3. Drie bunkers voor de green &mdash; club genoeg pakken! Green loopt licht naar achter." },
  { n: 5,  par: 4, si: 1,  w: 368, y: 359, b: 359, r: 318, o: 293,
    tip: "Stroke Index 1 &mdash; de zwaarste hole. Lange par 4, smal en lang. Drive zo ver mogelijk en hopen op een goede tweede slag. WC bij de tee." },
  { n: 6,  par: 4, si: 11, w: 341, y: 316, b: 316, r: 289, o: 271,
    tip: "Korte, brede par 4. Bunker rechts op landingzone. Green is klein (27&times;19m) en valt af aan achterzijde." },
  { n: 7,  par: 4, si: 3,  w: 356, y: 335, b: 322, r: 307, o: 256,
    tip: "Lastige dogleg links. De bell laat horen wanneer de groep voor je weg is. Mik op de hoek, niet over de bomen. Schuilhut aanwezig." },
  { n: 8,  par: 5, si: 5,  w: 503, y: 468, b: 438, r: 423, o: 398,
    tip: "Lange par 5. Brede fairway met bunkers op 50m. Tweede slag layup voor de waste area, dan wedge naar de green." },
  { n: 9,  par: 3, si: 9,  w: 177, y: 165, b: 153, r: 105, o: 91,
    tip: "Verraderlijke par 3. Vier bunkers rond de green. Club kort kiezen &mdash; lang is dood. Schuilhut achter de tee." },
  { n: 10, par: 4, si: 6,  w: 402, y: 386, b: 350, r: 311, o: 258,
    tip: "Dogleg links over hoek. Water rechts kort van de fairway (zie WC-symbool op map). Speel naar het midden." },
  { n: 11, par: 4, si: 2,  w: 422, y: 404, b: 359, r: 340, o: 332,
    tip: "Tweede zwaarste hole. Lang en recht, waste area rechts over hele lengte. Hou de bal links. WC achter de green." },
  { n: 12, par: 4, si: 4,  w: 380, y: 341, b: 330, r: 291, o: 273,
    tip: "Verspringende fairway, OB-palen links over hele hole. Mik veilig naar het midden, dan iron naar de green. WC bij de tee." },
  { n: 13, par: 3, si: 16, w: 149, y: 133, b: 133, r: 116, o: 112,
    tip: "Korte par 3. Diepe bunkers links en rechts van de green. Club voor het midden van de green. Schuilhut." },
  { n: 14, par: 5, si: 8,  w: 465, y: 457, b: 430, r: 387, o: 315,
    tip: "Lange par 5. OB links, smal door bos. Drive in fairway is goud waard. Layup voor de waste area op ca. 100m." },
  { n: 15, par: 4, si: 14, w: 294, y: 273, b: 258, r: 238, o: 207,
    tip: "Korte par 4, drivable voor lange hitters. Bunkers links en rechts van de green. Speel veilig met een hybride of iron." },
  { n: 16, par: 3, si: 18, w: 180, y: 168, b: 150, r: 140, o: 124,
    tip: "Makkelijkste hole (SI 18) maar wel lang voor een par 3. Veel ruimte rond de green, weinig hazards. WC links van de green." },
  { n: 17, par: 5, si: 12, w: 473, y: 453, b: 424, r: 424, o: 385,
    tip: "Brede par 5, drie bunkers strategisch geplaatst. Tweede slag agressief is mogelijk &mdash; lange hitters kunnen in tw&eacute;&eacute; op de green." },
  { n: 18, par: 4, si: 10, w: 315, y: 315, b: 293, r: 281, o: 253,
    tip: "Afsluiter richting clubhuis. Korte par 4 maar twee bunkers links voor de green. Mik op de rechter helft van de green &mdash; grootste green van de baan (33&times;33m)." }
];

// ===== GPS afstandsmeter =====
const COURSE_CENTER = [51.5822, 4.8876]; // Toxandria, Veenstraat 89 Molenschot
let gpsMap = null;
let gpsWatchId = null;
let gpsUserMarker = null;
let gpsUserPos = null;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function updateGpsDistance() {
  const el = document.getElementById('gps-distance');
  if (!el) return;
  if (!gpsMap || !gpsUserPos) {
    el.textContent = '--';
    return;
  }
  const c = gpsMap.getCenter();
  const d = haversineDistance(gpsUserPos[0], gpsUserPos[1], c.lat, c.lng);
  el.textContent = Math.round(d);
}

function cleanupGps() {
  if (gpsWatchId !== null) {
    navigator.geolocation.clearWatch(gpsWatchId);
    gpsWatchId = null;
  }
  if (gpsMap) {
    gpsMap.remove();
    gpsMap = null;
  }
  gpsUserMarker = null;
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#4285f4;border:3px solid #fff;box-shadow:0 0 10px rgba(66,133,244,0.7);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function initGpsMap() {
  cleanupGps();
  const mapEl = document.getElementById('gps-map');
  if (!mapEl || typeof L === 'undefined') return;

  const initCenter = gpsUserPos || COURSE_CENTER;
  gpsMap = L.map('gps-map', {
    center: initCenter,
    zoom: 18,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20
  }).addTo(gpsMap);

  gpsMap.on('move', updateGpsDistance);

  if (gpsUserPos) {
    gpsUserMarker = L.marker(gpsUserPos, {
      icon: makeUserIcon(),
      interactive: false,
      zIndexOffset: 1000
    }).addTo(gpsMap);
    gpsMap.setView(gpsUserPos, 18);
  }

  if ('geolocation' in navigator) {
    gpsWatchId = navigator.geolocation.watchPosition(
      pos => {
        gpsUserPos = [pos.coords.latitude, pos.coords.longitude];
        if (!gpsUserMarker) {
          gpsUserMarker = L.marker(gpsUserPos, {
            icon: makeUserIcon(),
            interactive: false,
            zIndexOffset: 1000
          }).addTo(gpsMap);
          gpsMap.setView(gpsUserPos, 18);
        } else {
          gpsUserMarker.setLatLng(gpsUserPos);
        }
        updateGpsDistance();
      },
      err => { console.log('GPS error:', err.message); },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
  }
}

// ===== Persistente state =====
const STORAGE_KEY = 'toxandria-state-v2';

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      players: Array.isArray(raw.players) ? raw.players : null,
      scores: raw.scores && typeof raw.scores === 'object' ? raw.scores : {},
      drives: raw.drives && typeof raw.drives === 'object' ? raw.drives : {}
    };
  } catch (e) {
    return { players: null, scores: {}, drives: {} };
  }
}

let state = loadState();
let scores = state.scores;
let drives = state.drives;  // {hole: playerIndex}
let players = state.players; // null als nog niet geconfigureerd

function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, drives }));
}

function diffLabel(score, par) {
  const d = score - par;
  if (d === 0) return { txt: 'Par', cls: 'even' };
  if (d < 0) return { txt: d.toString(), cls: 'under' };
  return { txt: '+' + d, cls: 'over' };
}

// ===== Navigatie =====
let currentHole = 1;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const screens = {
  setup: $('#screen-setup'),
  start: $('#screen-start'),
  hole: $('#screen-hole'),
  result: $('#screen-result'),
  map: $('#screen-map'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
  screens[name].classList.remove('hidden');
  screens[name].classList.add('active');
  $('#btn-back').classList.toggle('hidden', name === 'start' || name === 'setup');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ===== Setup scherm =====
let setupCount = 4;
let setupNames = ['', '', '', ''];

function renderSetup() {
  if (players) {
    setupCount = players.length;
    setupNames = players.slice();
    while (setupNames.length < 4) setupNames.push('');
  } else {
    setupNames = ['Pelle', '', '', ''];
  }
  $$('.count-btn').forEach(b => {
    const c = parseInt(b.dataset.count, 10);
    b.classList.toggle('active', c === setupCount);
  });
  renderPlayerInputs();
}

function renderPlayerInputs() {
  const box = $('#player-inputs');
  box.innerHTML = '';
  for (let i = 0; i < setupCount; i++) {
    const row = document.createElement('div');
    row.className = 'player-input';
    row.innerHTML = `
      <div class="badge">${i + 1}</div>
      <input type="text" placeholder="Naam speler ${i + 1}" value="${setupNames[i] || ''}" maxlength="20" autocomplete="off">
    `;
    row.querySelector('input').addEventListener('input', e => {
      setupNames[i] = e.target.value;
    });
    box.appendChild(row);
  }
}

function startRoundFromSetup() {
  const validNames = [];
  for (let i = 0; i < setupCount; i++) {
    const n = (setupNames[i] || '').trim();
    if (!n) {
      alert(`Vul naam voor speler ${i + 1} in.`);
      return;
    }
    validNames.push(n);
  }
  players = validNames;
  saveAll();
  renderTeamCard();
  renderHoleGrid();
  showScreen('start');
}

// ===== Team card =====
function renderTeamCard() {
  if (!players) {
    $('#team-names').textContent = '—';
    return;
  }
  $('#team-names').textContent = players.join(' · ');
}

function renderHoleGrid() {
  const grid = $('#hole-grid');
  grid.innerHTML = '';
  HOLES.forEach(h => {
    const div = document.createElement('div');
    let cls = 'hole-card';
    if (h.si <= 6) cls += ' hard';
    else if (h.si <= 12) cls += ' mid';
    else cls += ' easy';
    div.className = cls;
    let pillHtml = '';
    if (scores[h.n] != null) {
      const d = diffLabel(scores[h.n], h.par);
      pillHtml = `<div class="score-pill ${d.cls}">${scores[h.n]} (${d.txt})</div>`;
    }
    div.innerHTML = `
      <div class="num">${h.n}</div>
      <div class="par">Par ${h.par}</div>
      <div class="len">${h.y} m</div>
      <div class="si">SI ${h.si}</div>
      ${pillHtml}
    `;
    div.addEventListener('click', () => openHole(h.n));
    grid.appendChild(div);
  });
  renderTotals();
}

function renderTotals() {
  let played = 0, strokes = 0, parSum = 0;
  HOLES.forEach(h => {
    if (scores[h.n] != null) {
      played++;
      strokes += scores[h.n];
      parSum += h.par;
    }
  });
  $('#total-played').textContent = `${played} / 9`;
  $('#total-strokes').textContent = strokes;
  const totalEl = $('#total-vs-par');
  totalEl.classList.remove('under', 'over');
  if (played === 0) {
    totalEl.textContent = 'E';
  } else {
    const d = strokes - parSum;
    if (d === 0) totalEl.textContent = 'E';
    else if (d < 0) { totalEl.textContent = d.toString(); totalEl.classList.add('under'); }
    else { totalEl.textContent = '+' + d; totalEl.classList.add('over'); }
  }
  $('#btn-result').style.display = played > 0 ? 'block' : 'none';
}

function renderScoreCounter() {
  const h = HOLES.find(x => x.n === currentHole);
  $('#score-par').textContent = h.par;
  const valEl = $('#score-value');
  const diffEl = $('#score-diff');
  diffEl.classList.remove('under', 'over', 'even');
  if (scores[h.n] == null) {
    valEl.textContent = '—';
    diffEl.textContent = 'tik op + om te beginnen';
  } else {
    valEl.textContent = scores[h.n];
    const d = diffLabel(scores[h.n], h.par);
    diffEl.textContent = d.txt;
    diffEl.classList.add(d.cls);
  }
}

function adjustScore(delta) {
  const h = HOLES.find(x => x.n === currentHole);
  let cur = scores[h.n];
  if (cur == null) {
    cur = h.par;
  } else {
    cur += delta;
  }
  if (cur < 1) cur = 1;
  if (cur > 15) cur = 15;
  scores[h.n] = cur;
  saveAll();
  renderScoreCounter();
}

function resetAllScores() {
  if (!confirm('Alle scores én drives wissen?')) return;
  scores = {};
  drives = {};
  saveAll();
  renderHoleGrid();
}

// ===== Drives picker =====
function renderDrivesChips() {
  const box = $('#drives-chips');
  const hint = $('#drives-hint');
  box.innerHTML = '';
  if (!players || players.length === 0) {
    hint.textContent = 'Stel eerst je flight in via "Aanpassen".';
    return;
  }
  const counts = players.map((_, i) => Object.values(drives).filter(d => d === i).length);
  players.forEach((name, idx) => {
    const chip = document.createElement('button');
    chip.className = 'drive-chip';
    if (drives[currentHole] === idx) chip.classList.add('selected');
    chip.innerHTML = `${name} <span class="count">${counts[idx]}</span>`;
    chip.addEventListener('click', () => {
      if (drives[currentHole] === idx) {
        delete drives[currentHole];
      } else {
        drives[currentHole] = idx;
      }
      saveAll();
      renderDrivesChips();
    });
    box.appendChild(chip);
  });
  if (drives[currentHole] != null) {
    hint.textContent = `Drive van ${players[drives[currentHole]]} gekozen.`;
  } else {
    hint.textContent = 'Tik op een speler.';
  }
}

function openHole(n) {
  currentHole = n;
  const h = HOLES.find(x => x.n === n);
  if (!h) return;
  $('#hole-title').textContent = `Hole ${h.n}`;
  $('#hole-stats').textContent = `Par ${h.par} · SI ${h.si}`;

  const tees = [
    { cls: 'white',  name: 'Wit',    val: h.w },
    { cls: 'yellow', name: 'Geel',   val: h.y },
    { cls: 'blue',   name: 'Blauw',  val: h.b },
    { cls: 'red',    name: 'Rood',   val: h.r },
    { cls: 'orange', name: 'Oranje', val: h.o },
  ];
  const teeHtml = tees.map(t => `
    <div class="tee ${t.cls}">
      <div class="tee-len">${t.val}</div>
      <div class="tee-name">${t.name}</div>
    </div>
  `).join('');
  $('#tee-grid').innerHTML = teeHtml;

  const num = String(h.n).padStart(2, '0');
  $('#hole-image').src = `holes/hole${num}.jpg`;
  $('#hole-image').alt = `Hole ${h.n}`;

  $('#hole-tip').innerHTML = `<strong>Tip:</strong> ${h.tip}`;

  renderScoreCounter();
  renderDrivesChips();
  showScreen('hole');
  setTimeout(initGpsMap, 60);
}

// ===== Resultaat =====
function renderResult() {
  const playedHoles = HOLES.filter(h => scores[h.n] != null);
  const strokes = playedHoles.reduce((s, h) => s + scores[h.n], 0);
  const parSum = playedHoles.reduce((s, h) => s + h.par, 0);
  const d = strokes - parSum;

  $('#result-sub').textContent = playedHoles.length === 0
    ? 'Nog geen holes gespeeld'
    : `${playedHoles.length} ${playedHoles.length === 1 ? 'hole' : 'holes'} gespeeld`;
  $('#result-strokes').textContent = strokes;
  const vp = $('#result-vs-par');
  vp.classList.remove('under', 'over');
  if (playedHoles.length === 0) vp.textContent = '—';
  else if (d === 0) vp.textContent = 'Par';
  else if (d < 0) { vp.textContent = d.toString(); vp.classList.add('under'); }
  else { vp.textContent = '+' + d; vp.classList.add('over'); }
  $('#result-par-line').textContent = `Par van gespeelde holes: ${parSum}`;

  // Drives per speler (alleen gespeelde holes)
  const drivesBox = $('#result-drives');
  drivesBox.innerHTML = '';
  if (!players) {
    drivesBox.innerHTML = '<p class="result-drives-note">Geen flight ingesteld.</p>';
  } else {
    const minDrives = playedHoles.length >= 9 ? 2 : 1;
    players.forEach((name, idx) => {
      const count = playedHoles.filter(h => drives[h.n] === idx).length;
      const row = document.createElement('div');
      row.className = 'result-drive-row';
      if (count < minDrives) row.classList.add('warn');
      row.innerHTML = `<span class="name">${name}</span><span class="drive-count">${count} drive${count === 1 ? '' : 's'}</span>`;
      drivesBox.appendChild(row);
    });
    const unassigned = playedHoles.filter(h => drives[h.n] == null).length;
    if (unassigned > 0) {
      const note = document.createElement('p');
      note.className = 'result-drives-note';
      note.style.marginTop = '12px';
      note.textContent = `${unassigned} ${unassigned === 1 ? 'hole heeft' : 'holes hebben'} nog geen drive toegewezen.`;
      drivesBox.appendChild(note);
    }
  }

  // Tabel per hole
  const table = $('#result-table');
  if (playedHoles.length === 0) {
    table.innerHTML = '<tr><td>Speel eerst een hole.</td></tr>';
  } else {
    let html = '<thead><tr><th>Hole</th><th>Par</th><th>Slagen</th><th>+/-</th><th>Drive</th></tr></thead><tbody>';
    playedHoles.forEach(h => {
      const s = scores[h.n];
      const diff = s - h.par;
      let diffCell = 'E';
      let cls = '';
      if (diff < 0) { diffCell = diff.toString(); cls = 'under-cell'; }
      else if (diff > 0) { diffCell = '+' + diff; cls = 'over-cell'; }
      const driveName = (drives[h.n] != null && players) ? players[drives[h.n]] : '—';
      html += `<tr><td>${h.n}</td><td>${h.par}</td><td>${s}</td><td class="${cls}">${diffCell}</td><td>${driveName}</td></tr>`;
    });
    html += `<tr class="total-row"><td>Totaal</td><td>${parSum}</td><td>${strokes}</td><td colspan="2">${d === 0 ? 'Par' : (d > 0 ? '+' + d : d)}</td></tr>`;
    html += '</tbody>';
    table.innerHTML = html;
  }

  showScreen('result');
}

// ===== Event handlers =====
function gotoStart() {
  cleanupGps();
  renderTeamCard();
  renderHoleGrid();
  showScreen('start');
}

$('#btn-back').addEventListener('click', gotoStart);
$('#btn-overview').addEventListener('click', gotoStart);
$('#btn-back-from-result').addEventListener('click', gotoStart);
$('#btn-result').addEventListener('click', renderResult);

$('#score-plus').addEventListener('click', () => adjustScore(1));
$('#score-minus').addEventListener('click', () => adjustScore(-1));
$('#btn-reset').addEventListener('click', resetAllScores);

$('#prev-hole').addEventListener('click', () => {
  const next = currentHole === 1 ? 18 : currentHole - 1;
  openHole(next);
});

function gotoNextHole() {
  const next = currentHole === 18 ? 1 : currentHole + 1;
  openHole(next);
}
$('#next-hole').addEventListener('click', gotoNextHole);
$('#btn-next-hole-bottom').addEventListener('click', gotoNextHole);

$('#course-map').addEventListener('click', () => showScreen('map'));

// Setup
$$('.count-btn').forEach(b => {
  b.addEventListener('click', () => {
    setupCount = parseInt(b.dataset.count, 10);
    renderSetup();
  });
});
$('#btn-start-round').addEventListener('click', startRoundFromSetup);
$('#btn-edit-team').addEventListener('click', () => {
  renderSetup();
  showScreen('setup');
});

// Swipe op hole detail (alleen horizontaal, en niet op de GPS-kaart)
let touchStartX = 0;
let touchStartY = 0;
let touchOnMap = false;
screens.hole.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchOnMap = !!e.target.closest('#gps-map');
}, { passive: true });
screens.hole.addEventListener('touchend', e => {
  if (touchOnMap) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
  if (dx < 0) $('#next-hole').click();
  else $('#prev-hole').click();
}, { passive: true });

// ===== Init =====
if (!players) {
  renderSetup();
  showScreen('setup');
} else {
  renderTeamCard();
  renderHoleGrid();
  showScreen('start');
}
