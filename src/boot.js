// src/boot.js
const params = new URLSearchParams(window.location.search);
const hash   = (window.location.hash || '').replace('#', '');
const mode   = (params.get('mode') || hash || 'game').toLowerCase();

// Build URLs relative to THIS file, not the page location
const mainURL    = new URL('./main.js', import.meta.url);
const pickerURL  = new URL('./idpicker.js', import.meta.url);

const target = (mode === 'idpicker' || mode === 'picker') ? pickerURL : mainURL;
import(target.href);

window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'p') {
    const here = new URL(window.location.href);
    here.searchParams.set('mode', 'idpicker');
    window.location = here; // reload in picker mode
  }
  if (e.key.toLowerCase() === 'g') {
    const here = new URL(window.location.href);
    here.searchParams.set('mode', 'game');
    window.location = here;
  }
});
