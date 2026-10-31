// Small blocking bootstrap prevents a stored dark theme from flashing light.
document.documentElement.classList.add('js');
try { document.documentElement.dataset.theme = localStorage.getItem('anny-theme') === 'dark' ? 'dark' : 'light'; } catch { /* Storage is optional. */ }
// The decorative loader is home-only, once per session, with a fail-open deadline.
try { if(!location.pathname.includes('/cases/')&&!sessionStorage.getItem('anny-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro-active');setTimeout(()=>document.documentElement.classList.remove('intro-active'),1400);} } catch { /* Never block a page when storage is unavailable. */ }
