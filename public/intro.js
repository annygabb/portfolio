/** Brief decorative entry; never traps focus or waits indefinitely for assets. */
export function mountIntro({win,doc}){
 const root=doc.documentElement,loader=doc.querySelector('.site-intro');let timer=0,disposed=false;
 const finish=()=>{if(disposed)return;root.classList.remove('intro-active');try{win.sessionStorage.setItem('anny-intro','seen');}catch{}doc.dispatchEvent(new win.CustomEvent('portfolio:intro-ready'));};
 if(!loader||!root.classList.contains('intro-active')){finish();return ()=>{};}
 const leave=()=>{if(disposed)return;loader.classList.add('intro-leaving');timer=win.setTimeout(finish,220);};
 const image=doc.querySelector('.portrait-frame img');
 Promise.race([Promise.all([doc.fonts?.ready,image?.decode?.().catch(()=>{})]),new Promise(resolve=>{timer=win.setTimeout(resolve,850);})]).then(leave);
 return ()=>{disposed=true;win.clearTimeout(timer);root.classList.remove('intro-active');};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 let dispose=mountIntro({win:window,doc:document});window.addEventListener('pagehide',()=>dispose());window.addEventListener('pageshow',event=>{if(event.persisted)document.documentElement.classList.remove('intro-active');});
}
