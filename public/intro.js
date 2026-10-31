/** Resolution-independent brand entrance. Never waits for decorative media. */
export function mountIntro({win,doc}){
 const root=doc.documentElement,loader=doc.querySelector('.site-intro');
 let timer=0,disposed=false,finished=false;
 const finish=()=>{
  if(disposed||finished)return;finished=true;win.clearTimeout(timer);
  loader?.classList.add('intro-leaving');root.classList.remove('intro-active');
  doc.dispatchEvent(new win.CustomEvent('portfolio:intro-ready'));
 };
 if(!loader||!root.classList.contains('intro-active')){finish();return ()=>{};}
 timer=win.setTimeout(finish,1650);
 // Do not expose a fallback typeface while the local brand fonts arrive.
 Promise.resolve(doc.fonts?.ready).then(()=>{if(!disposed&&!finished)loader.classList.add('intro-type-ready');},()=>finish());
 return ()=>{disposed=true;win.clearTimeout(timer);root.classList.remove('intro-active');};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 const dispose=mountIntro({win:window,doc:document});window.addEventListener('pagehide',dispose);
 window.addEventListener('pageshow',event=>{if(event.persisted)document.documentElement.classList.remove('intro-active');});
}
