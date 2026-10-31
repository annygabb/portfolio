// Small blocking bootstrap prevents a stored dark theme from flashing light.
document.documentElement.classList.add('js');
try { document.documentElement.dataset.theme = localStorage.getItem('anny-theme') === 'dark' ? 'dark' : 'light'; } catch { /* Storage is optional. */ }
// A homepage arrival receives the 3D entry; anchors and reduced motion stay direct.
try { if(!location.pathname.includes('/cases/')&&(!location.hash||['#top','#sobre'].includes(location.hash))&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro-active');setTimeout(()=>document.documentElement.classList.remove('intro-active'),5000);} } catch { /* Native content always remains available. */ }
