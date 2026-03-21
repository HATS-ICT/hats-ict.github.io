// ===== SIDE NAV SCROLL SPY =====
function initSideNav() {
  const nav = document.getElementById('side-nav');
  if (!nav) return;

  const items = nav.querySelectorAll('.side-nav-item');
  const sectionIds = Array.from(items).map(el => el.dataset.section);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Show nav after scrolling past hero
  const heroHeight = document.querySelector('main section')?.offsetHeight || 400;

  function update() {
    const scrollY = window.scrollY;

    // Show/hide nav
    nav.classList.toggle('visible', scrollY > heroHeight * 0.6);

    // Find active section: the one whose top is closest above viewport center
    const viewportMid = scrollY + window.innerHeight * 0.4;
    let activeId = null;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].offsetTop <= viewportMid) {
        activeId = sections[i].id;
        break;
      }
    }

    items.forEach(item => {
      item.classList.toggle('active', item.dataset.section === activeId);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Smooth scroll on click
  items.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(item.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// QA Slider
let qaIndex = 0;

function initSlider() {
  const slides = document.querySelectorAll('.qa-slide');
  const dotsContainer = document.getElementById('qa-dots');
  if (!slides.length || !dotsContainer) return;

  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'qa-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.qa-slide');
  const wrapper = document.getElementById('qa-slides');
  if (!slides.length) return;

  qaIndex = ((index % slides.length) + slides.length) % slides.length;
  wrapper.style.transform = 'translateX(-' + (qaIndex * 100) + '%)';

  document.querySelectorAll('.qa-dot').forEach((d, i) => {
    d.classList.toggle('active', i === qaIndex);
  });

  slides.forEach((slide, i) => {
    const video = slide.querySelector('video');
    if (!video) return;
    if (i === qaIndex) { video.currentTime = 0; video.play().catch(() => {}); }
    else { video.pause(); }
  });
}

function slideQA(dir) {
  const total = document.querySelectorAll('.qa-slide').length;
  goToSlide(qaIndex + dir);
}

// Copy BibTeX
function copyBibtex() {
  const text = document.getElementById('bibtex-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const label = document.getElementById('copy-label');
    label.textContent = 'Copied!';
    setTimeout(() => { label.textContent = 'Copy'; }, 2000);
  });
}

// ===== LEADERBOARD =====
const COLS = ['all','actrec','starec','objrec','evtrec','soc','xent','tsref','timloc','absrec','occcnt','order','intent','syncref','xvord','povid'];

const LB_DATA = [
  { model: 'Human', type: 'human', all:80.5, actrec:80.0, starec:80.0, objrec:100.0, evtrec:75.0, soc:100.0, xent:84.2, tsref:100.0, timloc:76.9, absrec:83.3, occcnt:62.5, order:77.8, intent:57.1, syncref:88.9, xvord:77.8, povid:100.0 },
  { model: 'GPT-5', type: 'proprietary', all:67.0, actrec:79.0, starec:70.7, objrec:70.0, evtrec:68.9, soc:48.3, xent:71.6, tsref:70.4, timloc:45.9, absrec:86.2, occcnt:62.7, order:78.3, intent:54.1, syncref:72.0, xvord:60.7, povid:54.0 },
  { model: 'GPT-5 Mini', type: 'proprietary', all:62.7, actrec:70.4, starec:67.3, objrec:68.6, evtrec:72.1, soc:34.5, xent:67.6, tsref:66.7, timloc:47.0, absrec:79.0, occcnt:33.3, order:72.8, intent:50.0, syncref:72.0, xvord:43.6, povid:58.7 },
  { model: 'GPT-5 Nano', type: 'proprietary', all:49.3, actrec:61.7, starec:60.5, objrec:70.0, evtrec:72.1, soc:37.9, xent:57.7, tsref:65.4, timloc:33.5, absrec:64.6, occcnt:17.3, order:35.0, intent:41.9, syncref:49.8, xvord:29.1, povid:42.9 },
  { model: 'Gemini 2.5 Pro', type: 'proprietary', all:71.3, actrec:69.1, starec:68.0, objrec:70.0, evtrec:80.3, soc:34.5, xent:74.5, tsref:77.8, timloc:65.1, absrec:82.1, occcnt:38.7, order:82.8, intent:59.5, syncref:81.0, xvord:65.0, povid:85.7 },
  { model: 'Gemini 3 Flash', type: 'proprietary', all:68.2, actrec:71.6, starec:65.3, objrec:75.7, evtrec:68.9, soc:24.1, xent:70.7, tsref:80.2, timloc:64.4, absrec:83.6, occcnt:32.0, order:78.9, intent:62.8, syncref:76.3, xvord:52.1, povid:60.3 },
  { model: 'Gemini 2.5 Flash', type: 'proprietary', all:63.7, actrec:69.8, starec:59.2, objrec:71.4, evtrec:72.1, soc:31.0, xent:65.0, tsref:69.1, timloc:60.5, absrec:76.9, occcnt:34.7, order:72.2, intent:60.8, syncref:72.9, xvord:50.4, povid:51.3 },
  { model: 'Claude 4.5 Sonnet', type: 'proprietary', all:51.3, actrec:62.3, starec:49.7, objrec:70.0, evtrec:65.6, soc:48.3, xent:57.9, tsref:50.6, timloc:34.9, absrec:68.2, occcnt:41.3, order:42.2, intent:61.5, syncref:47.8, xvord:30.8, povid:46.0 },
  { model: 'Claude 4.5 Haiku', type: 'proprietary', all:41.8, actrec:46.9, starec:52.4, objrec:60.0, evtrec:60.7, soc:51.7, xent:41.8, tsref:53.1, timloc:26.0, absrec:53.3, occcnt:24.0, order:36.1, intent:46.6, syncref:41.1, xvord:29.9, povid:38.6 },
  { model: 'Seed 1.6', type: 'proprietary', all:61.8, actrec:75.9, starec:63.3, objrec:77.1, evtrec:73.8, soc:51.7, xent:70.4, tsref:65.4, timloc:44.1, absrec:78.5, occcnt:42.7, order:69.4, intent:60.1, syncref:57.0, xvord:41.9, povid:47.6 },
  { model: 'Seed 1.6 Flash', type: 'proprietary', all:56.5, actrec:66.9, starec:56.1, objrec:72.1, evtrec:74.6, soc:50.0, xent:65.5, tsref:67.9, timloc:30.9, absrec:68.8, occcnt:38.4, order:41.5, intent:63.1, syncref:61.7, xvord:48.2, povid:44.2 },
  { model: 'Qwen3 VL 235B', type: 'opensource', all:63.8, actrec:71.0, starec:59.9, objrec:70.0, evtrec:80.3, soc:55.2, xent:68.6, tsref:76.5, timloc:54.4, absrec:80.0, occcnt:50.7, order:72.8, intent:63.5, syncref:66.7, xvord:31.6, povid:49.2 },
  { model: 'Qwen3 VL 30B', type: 'opensource', all:60.8, actrec:68.5, starec:60.5, objrec:74.3, evtrec:82.0, soc:58.6, xent:65.2, tsref:77.8, timloc:47.7, absrec:79.5, occcnt:65.3, order:66.7, intent:56.8, syncref:55.1, xvord:30.8, povid:47.1 },
  { model: 'Qwen3 VL 8B', type: 'opensource', all:57.8, actrec:68.5, starec:56.5, objrec:74.3, evtrec:72.1, soc:62.1, xent:63.6, tsref:75.3, timloc:46.3, absrec:73.3, occcnt:52.0, order:57.2, intent:64.9, syncref:48.3, xvord:27.4, povid:45.5 },
  { model: 'Gemma 3 27B', type: 'opensource', all:48.0, actrec:55.6, starec:54.4, objrec:58.6, evtrec:60.7, soc:44.8, xent:57.4, tsref:64.2, timloc:29.2, absrec:66.2, occcnt:32.0, order:28.3, intent:50.7, syncref:46.4, xvord:29.9, povid:46.0 },
  { model: 'Gemma 3 12B', type: 'opensource', all:43.7, actrec:53.1, starec:48.3, objrec:65.7, evtrec:59.0, soc:31.0, xent:52.5, tsref:54.3, timloc:26.7, absrec:54.9, occcnt:9.3, order:27.2, intent:50.0, syncref:50.2, xvord:24.8, povid:39.7 },
  { model: 'Gemma 3 4B', type: 'opensource', all:42.9, actrec:46.9, starec:42.9, objrec:64.3, evtrec:63.9, soc:24.1, xent:49.6, tsref:54.3, timloc:26.0, absrec:57.4, occcnt:9.3, order:27.2, intent:46.6, syncref:58.5, xvord:23.9, povid:37.6 },
];

let lbSortCol = 'all';
let lbSortAsc = false;

function findTopTwo(col) {
  const models = LB_DATA.filter(d => d.type !== 'human');
  const vals = models.map(d => d[col]).sort((a, b) => b - a);
  return { best: vals[0], second: vals[1] };
}

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;

  const sorted = [...LB_DATA];
  const humanRow = sorted.find(d => d.type === 'human');
  const modelRows = sorted.filter(d => d.type !== 'human');

  modelRows.sort((a, b) => {
    const va = a[lbSortCol], vb = b[lbSortCol];
    if (typeof va === 'string') return lbSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    return lbSortAsc ? va - vb : vb - va;
  });

  const proprietary = modelRows.filter(d => d.type === 'proprietary');
  const opensource = modelRows.filter(d => d.type === 'opensource');

  const topTwo = {};
  COLS.forEach(c => { topTwo[c] = findTopTwo(c); });

  let html = '';

  function rowHtml(d, extraClass) {
    const cls = extraClass || '';
    html += `<tr class="border-b border-gray-50 transition-colors ${cls}" onmouseover="this.style.background='rgba(124,58,237,0.03)'" onmouseout="this.style.background=''">`;
    html += `<td class="lb-td-model sticky left-0 bg-white z-10">${d.model}</td>`;
    COLS.forEach(c => {
      const v = d[c];
      let cellCls = 'lb-td';
      if (d.type !== 'human') {
        if (v === topTwo[c].best) cellCls += ' best';
        else if (v === topTwo[c].second) cellCls += ' second';
      }
      html += `<td class="${cellCls}">${typeof v === 'number' ? v.toFixed(1) : v}</td>`;
    });
    html += '</tr>';
  }

  // Human row
  if (humanRow) {
    html += `<tr class="lb-row-human border-b border-green-100">`;
    html += `<td class="lb-td-model sticky left-0 z-10" style="background:#f0fdf4">${humanRow.model}</td>`;
    COLS.forEach(c => {
      html += `<td class="lb-td">${humanRow[c].toFixed(1)}</td>`;
    });
    html += '</tr>';
  }

  html += '<tr class="lb-section-header"><td colspan="17" class="sticky left-0 z-10" style="background:#fafafa">Proprietary Models</td></tr>';
  proprietary.forEach(d => rowHtml(d));

  html += '<tr class="lb-section-header"><td colspan="17" class="sticky left-0 z-10" style="background:#fafafa">Open-Source Models</td></tr>';
  opensource.forEach(d => rowHtml(d));

  tbody.innerHTML = html;

  document.querySelectorAll('.lb-th').forEach(th => {
    const col = th.dataset.col;
    th.classList.remove('sort-asc', 'sort-desc');
    if (col === lbSortCol) {
      th.classList.add(lbSortAsc ? 'sort-asc' : 'sort-desc');
    }
  });
}

function initLeaderboard() {
  document.querySelectorAll('.lb-th').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (col === lbSortCol) lbSortAsc = !lbSortAsc;
      else { lbSortCol = col; lbSortAsc = col === 'model'; }
      renderLeaderboard();
    });
  });
  renderLeaderboard();
}

// ===== BAR CHARTS =====
function interpolateColor(c1, c2, t) {
  const parse = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  const [r1,g1,b1] = parse(c1), [r2,g2,b2] = parse(c2);
  const r = Math.round(r1 + (r2-r1)*t), g = Math.round(g1 + (g2-g1)*t), b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

function renderBarChart(containerId, data, colorStart, colorEnd) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const maxVal = Math.max(...data.map(d => d.value));
  const n = data.length;
  container.innerHTML = '';

  data.forEach((d, i) => {
    const pct = (d.value / maxVal) * 100;
    const t = n > 1 ? i / (n - 1) : 0;
    const barColor = interpolateColor(colorStart, colorEnd, t);
    const row = document.createElement('div');
    row.className = 'bar-chart-row';
    row.innerHTML =
      `<span class="bar-label">${d.label}</span>` +
      `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${barColor}"></div></div>` +
      `<span class="bar-value">${d.value.toFixed(1)}%</span>`;
    container.appendChild(row);
  });
}

function initCharts() {
  renderBarChart('chart-distractor', [
    { label: 'cross-video', value: 39.7 },
    { label: 'temporal', value: 35.0 },
    { label: 'lexical', value: 14.0 },
    { label: 'role', value: 12.2 },
    { label: 'scene', value: 6.5 },
  ], '#991b1b', '#fca5a5');

  renderBarChart('chart-game', [
    { label: 'Counter-Strike 2', value: 49.6 },
    { label: 'Battlefield 6', value: 47.0 },
    { label: 'Apex Legends', value: 44.6 },
    { label: 'ARC Raiders', value: 44.1 },
    { label: 'Elden Ring', value: 41.8 },
    { label: 'Valheim', value: 39.3 },
    { label: 'No Man\'s Sky', value: 38.5 },
    { label: 'Minecraft', value: 35.6 },
    { label: 'Cyberpunk 2077', value: 30.5 },
  ], '#1e3a8a', '#93c5fd');

  renderBarChart('chart-duration', [
    { label: '0-5s', value: 35.8 },
    { label: '5-15s', value: 38.3 },
    { label: '15-30s', value: 46.4 },
    { label: '30-60s', value: 44.6 },
  ], '#166534', '#86efac');

  renderBarChart('chart-numvideos', [
    { label: '2 videos', value: 40.2 },
    { label: '3 videos', value: 51.2 },
    { label: '4 videos', value: 56.5 },
    { label: '5 videos', value: 62.4 },
  ], '#4c1d95', '#c4b5fd');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Hero scroll cue
  document.querySelector('.hero-scroll-cue')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('taxonomy')?.scrollIntoView({ behavior: 'smooth' });
  });

  initSideNav();
  initSlider();
  initLeaderboard();
  initCharts();
});
