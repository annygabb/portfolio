/** Scroll tracking independent of motion, including reduced-motion/native scrolling. */
export function mountSectionNavigation({win,doc}){
 const links=[...doc.querySelectorAll('[data-nav]')];
 if(!links.length || !doc.getElementById('sobre'))return ()=>{};
 const sections=[...doc.querySelectorAll('#sobre,#perfil,#formacao,#projetos,#impacto,#experiencia,#skills,#metodo,#curriculo,#contato')];
 const header=doc.querySelector('.site-header');let pending=0,disposed=false;
 function update(){
  pending=0;if(disposed)return;
  const threshold=(header?.offsetHeight||82)+Math.min(120,win.innerHeight*.18);
  let current='sobre';
  for(const section of sections){if(section.getBoundingClientRect().top<=threshold)current=section.dataset.navSection||section.id;}
  const height=doc.documentElement?.scrollHeight;
  if(height>0&&(win.scrollY||0)+win.innerHeight>=height-2&&sections.some(section=>section.id==='contato'))current='contato';
  for(const link of links){if(link.dataset.nav===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
 }
 const schedule=()=>{if(!pending&&!disposed)pending=win.requestAnimationFrame(update);};
 win.addEventListener('scroll',schedule,{passive:true});win.addEventListener('resize',schedule);win.addEventListener('hashchange',schedule);
 doc.addEventListener('portfolio:layout',schedule);doc.addEventListener('load',schedule,true);doc.addEventListener('toggle',schedule,true);
 doc.fonts?.ready.then(schedule);update();
 return ()=>{disposed=true;if(pending)win.cancelAnimationFrame(pending);win.removeEventListener('scroll',schedule);win.removeEventListener('resize',schedule);win.removeEventListener('hashchange',schedule);doc.removeEventListener('portfolio:layout',schedule);doc.removeEventListener('load',schedule,true);doc.removeEventListener('toggle',schedule,true);};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 let dispose=mountSectionNavigation({win:window,doc:document});
 window.addEventListener('pagehide',()=>dispose());
 window.addEventListener('pageshow',event=>{if(event.persisted)dispose=mountSectionNavigation({win:window,doc:document});});
}
