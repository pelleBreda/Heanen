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

// ===== Score state =====
const STORAGE_KEY = 'toxandria-scores-v1';
let scores = {};
try {
  scores = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
} catch (e) { scores = {}; }

function saveScores() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
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
const screens = {
  start: $('#screen-start'),
  hole: $('#screen-hole'),
  map: $('#screen-map'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
  screens[name].classList.add('active');
  $('#btn-back').classList.toggle('hidden', name === 'start');
  window.scrollTo({ top: 0, behavior: 'instant' });
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
  $('#total-played').textContent = `${played} / 18`;
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
    cur = delta > 0 ? h.par : h.par;
  } else {
    cur += delta;
  }
  if (cur < 1) cur = 1;
  if (cur > 15) cur = 15;
  scores[h.n] = cur;
  saveScores();
  renderScoreCounter();
}

function resetAllScores() {
  if (!confirm('Alle scores wissen?')) return;
  scores = {};
  saveScores();
  renderHoleGrid();
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
  showScreen('hole');
  setTimeout(initGpsMap, 60);
}

// ===== Event handlers =====
$('#btn-back').addEventListener('click', () => {
  cleanupGps();
  renderHoleGrid();
  showScreen('start');
});

$('#score-plus').addEventListener('click', () => adjustScore(1));
$('#score-minus').addEventListener('click', () => adjustScore(-1));
$('#btn-reset').addEventListener('click', resetAllScores);

$('#prev-hole').addEventListener('click', () => {
  const next = currentHole === 1 ? 18 : currentHole - 1;
  openHole(next);
});

$('#next-hole').addEventListener('click', () => {
  const next = currentHole === 18 ? 1 : currentHole + 1;
  openHole(next);
});

$('#course-map').addEventListener('click', () => showScreen('map'));

// Swipe op hole detail
let touchStartX = 0;
screens.hole.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
screens.hole.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 50) return;
  if (dx < 0) $('#next-hole').click();
  else $('#prev-hole').click();
}, { passive: true });

// ===== Init =====
renderHoleGrid();
showScreen('start');
