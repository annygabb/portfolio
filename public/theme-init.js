// Small blocking bootstrap prevents a stored dark theme from flashing light.
document.documentElement.classList.add('js');
try { document.documentElement.dataset.theme = localStorage.getItem('anny-theme') === 'dark' ? 'dark' : 'light'; } catch { /* Storage is optional. */ }
