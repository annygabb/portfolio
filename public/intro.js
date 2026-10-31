/** The supplied numerical motion study, recoloured to the portfolio palette. */
export function mountIntro({win,doc}){
 const root=doc.documentElement,loader=doc.querySelector('.site-intro');
 let deadline=0,disposed=false,finished=false;
 const video=loader?.querySelector('video');
 const finish=()=>{
  if(disposed||finished)return;finished=true;win.clearTimeout(deadline);video?.pause();
  loader?.classList.add('intro-leaving');root.classList.remove('intro-active');
  doc.dispatchEvent(new win.CustomEvent('portfolio:intro-ready'));
 };
 if(!loader||!root.classList.contains('intro-active')||!video){finish();return ()=>{};}
 // Playback errors, blocked autoplay and stalled networks always release the page.
 deadline=win.setTimeout(finish,6500);
 video.addEventListener('ended',finish);video.addEventListener('error',finish);
 video.play()?.catch(finish);
 return ()=>{disposed=true;win.clearTimeout(deadline);video.pause();video.removeEventListener('ended',finish);video.removeEventListener('error',finish);root.classList.remove('intro-active');};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 const dispose=mountIntro({win:window,doc:document});window.addEventListener('pagehide',dispose);
 window.addEventListener('pageshow',event=>{if(event.persisted)document.documentElement.classList.remove('intro-active');});
}
