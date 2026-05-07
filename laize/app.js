/* ─────────────────────────────────────────
   laize.ai — app.js
───────────────────────────────────────── */

/**
 * Navigate between screens.
 * @param {string} id - The screen element ID to show.
 */
function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Onboarding step 1 — select a role card.
 * Enables the Next button when a card is picked.
 */
function pick(el, nextBtnId) {
  const parent = el.closest('.ob-inner');
  parent.querySelectorAll('.ob-card').forEach(c => c.classList.remove('picked'));
  el.classList.add('picked');
  const btn = document.getElementById(nextBtnId);
  if (btn) btn.classList.add('ready');
}

/**
 * Advance from onboarding step 1 → step 2.
 * Updates the trail indicator.
 */
function goStep2() {
  document.getElementById('ob-step1').classList.add('hidden');
  document.getElementById('ob-step2').classList.remove('hidden');

  // Update trail
  const tr2 = document.getElementById('tr2');
  tr2.className = 'trail-step done';
  tr2.querySelector('.trail-dot').textContent = '✓';

  const tr3 = document.getElementById('tr3');
  tr3.className = 'trail-step active';

  document.getElementById('tl2').classList.add('done');
}

/**
 * Keyboard shortcut: Escape returns to landing.
 */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') go('sc-b');
});
