/* ============================================================
   GerritGames — main.js
   Download Bridge + uTorrent Modal | Live Search | Tabs | Slider
   ============================================================ */

'use strict';

// ── Download Bridge ───────────────────────────────────────
//
// When user clicks any .download-btn:
// 1. POST to /games/:slug/download  (increments counter)
// 2. Trigger the magnet: URI via a hidden anchor
// 3. Show the uTorrent modal after a short delay
// ─────────────────────────────────────────────────────────
const modal       = document.getElementById('downloadModal');
const modalClose  = document.getElementById('modalClose');
const modalTitle  = document.getElementById('modalGameTitle');

function openDownloadModal(gameTitle) {
  if (!modal) return;
  if (modalTitle) modalTitle.textContent = gameTitle;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDownloadModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close on backdrop click
modal?.addEventListener('click', e => {
  if (e.target === modal) closeDownloadModal();
});
modalClose?.addEventListener('click', closeDownloadModal);
// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDownloadModal();
});

// Delegate click on all .download-btn elements
document.addEventListener('click', async e => {
  const btn = e.target.closest('.download-btn');
  if (!btn) return;

  const slug     = btn.dataset.slug;
  const magnet   = btn.dataset.magnet;
  const title    = btn.dataset.title || 'Game';

  if (!magnet || !slug) return;

  // Disable button briefly to prevent double-click
  btn.disabled = true;
  btn.textContent = 'Starting...';

  try {
    // 1. Track download server-side (fire and forget)
    fetch(`/games/${slug}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {}); // non-blocking

    // 2. Trigger the magnet: protocol link
    const anchor = document.createElement('a');
    anchor.href = magnet;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // 3. Show uTorrent modal after 800ms
    setTimeout(() => openDownloadModal(title), 800);

  } finally {
    // Re-enable button after 3s
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '⬇ Download';
    }, 3000);
  }
});


// ── Live Search Autocomplete ──────────────────────────────
const searchInput       = document.getElementById('searchInput');
const suggestionsBox    = document.getElementById('searchSuggestions');

let searchTimeout;

function renderSuggestions(items) {
  if (!suggestionsBox) return;
  if (!items.length) {
    suggestionsBox.classList.add('hidden');
    return;
  }
  suggestionsBox.innerHTML = items.map(g => `
    <a href="/games/${g.slug}" class="suggestion-item">
      <img src="${g.thumbnailUrl || '/images/placeholder.jpg'}"
           alt="${escHtml(g.title)}"
           onerror="this.src='/images/placeholder.jpg'">
      <div>
        <div class="s-title">${escHtml(g.title)}</div>
        <div class="s-size">${g.fileSize || ''}</div>
      </div>
    </a>
  `).join('');
  suggestionsBox.classList.remove('hidden');
}

searchInput?.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  const q = searchInput.value.trim();
  if (q.length < 2) {
    suggestionsBox?.classList.add('hidden');
    return;
  }
  searchTimeout = setTimeout(async () => {
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      renderSuggestions(data);
    } catch { /* silent fail */ }
  }, 250);
});

// Hide suggestions on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.header-search')) {
    suggestionsBox?.classList.add('hidden');
  }
});


// ── Tab Switcher (game detail page) ──────────────────────
const tabBtns     = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${target}`)?.classList.add('active');
  });
});


// ── Featured Banner Auto-Slider ───────────────────────────
(function initSlider() {
  const slides = document.querySelectorAll('.featured-slide');
  const dots   = document.querySelectorAll('.dot');
  if (slides.length <= 1) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function advance() {
    goTo(current + 1);
  }

  function startTimer() { timer = setInterval(advance, 4500); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
  });

  startTimer();
})();


// ── Utility ───────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
