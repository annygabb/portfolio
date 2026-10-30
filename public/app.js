const lang = document.body.dataset.lang === 'en' ? 'en' : 'pt';
const labels = lang === 'pt'
  ? { copied: 'E-mail copiado', failed: 'Não foi possível copiar. Use o link de e-mail.', count: n => `${n} projetos exibidos.` }
  : { copied: 'Email copied', failed: 'Could not copy. Please use the email link.', count: n => `${n} projects displayed.` };
document.querySelectorAll('.js-control').forEach(el => { el.hidden = false; });
const theme = document.querySelector('.theme-toggle');
const syncTheme = () => theme?.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
syncTheme();
theme?.addEventListener('click', () => {
  const value = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = value;
  try { localStorage.setItem('anny-theme', value); } catch { /* No storage permission needed. */ }
  syncTheme();
});
const menu = document.querySelector('.menu-toggle');
const closeMenu = () => { menu?.setAttribute('aria-expanded','false'); document.documentElement.classList.remove('menu-open'); };
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('menu-open', open);
  if(open) document.querySelector('.main-nav a')?.focus();
});
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key==='Escape' && document.documentElement.classList.contains('menu-open')) { closeMenu(); menu?.focus(); } });
document.addEventListener('click', e => { if(!e.target.closest('.site-header')) closeMenu(); });
const cards = [...document.querySelectorAll('.project-card')];
for(const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click', () => {
  const value = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  for(const card of cards) card.hidden = value !== 'all' && card.dataset.kind !== value;
  const status = document.querySelector('.filter-status');
  if(status) status.textContent = labels.count(cards.filter(el => !el.hidden).length);
  document.dispatchEvent(new CustomEvent('portfolio:layout'));
});
document.querySelector('.copy-email')?.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText('annygabbyoficial@gmail.com'); status.textContent = labels.copied; }
  catch { status.textContent = labels.failed; }
});
const dialog = document.querySelector('.lightbox');
let previousFocus;
for(const a of document.querySelectorAll('[data-lightbox]')) a.addEventListener('click', e => {
  if(!dialog?.showModal || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); previousFocus = a;
  const img = dialog.querySelector('img'); img.src = a.href; img.alt = a.querySelector('img').alt;
  dialog.showModal();
  document.documentElement.classList.add('dialog-open');
  document.dispatchEvent(new CustomEvent('portfolio:dialog',{detail:{open:true}}));
});
dialog?.querySelector('button')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
dialog?.addEventListener('close', () => {
  document.documentElement.classList.remove('dialog-open');
  document.dispatchEvent(new CustomEvent('portfolio:dialog',{detail:{open:false}}));
  previousFocus?.focus();
});
