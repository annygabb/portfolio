/** Progressive GSAP/ScrollTrigger + Lenis enhancement. Content is visible without it. */
export function mountMotion({win,doc,gsap,ScrollTrigger,Lenis}) {
  const noop=()=>{};
  if(!gsap || !ScrollTrigger || !Lenis || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  let disposed=false;
  media.add({desktop:'(min-width: 901px) and (pointer: fine)',staged:'(min-width: 901px) and (min-height: 700px) and (pointer: fine)',motion:'(prefers-reduced-motion: no-preference)'}, context=>{
    if(!context.conditions.motion) return noop;
    const desktop=context.conditions.desktop;
    let lenis, tick, projectTweens=[];
    if(desktop){
      lenis=new Lenis({autoRaf:false,lerp:0.09,smoothWheel:true,syncTouch:false,anchors:false,stopInertiaOnNavigate:true,prevent:node=>node.tagName==='DIALOG' || node.closest?.('dialog')});
      lenis.on('scroll',ScrollTrigger.update);
      tick=time=>lenis.raf(time*1000);
      gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
      doc.documentElement.classList.add('smooth-motion');
    }
    // Reset inertia before native fragment navigation; preserve browser hash/focus.
    const resetNativeAnchor=event=>{
      if(!lenis || event.defaultPrevented || event.button>0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      const link=event.target.closest?.('a[href]');
      if(!link || (link.target && link.target!=='_self') || link.hasAttribute('download'))return;
      const current=new URL(win.location.href), target=new URL(link.href,current);
      if(target.origin===current.origin && target.pathname===current.pathname && target.search===current.search && target.hash)lenis.reset();
    };
    const dialogState=event=>{if(lenis){if(event.detail?.open)lenis.stop();else lenis.start();}};
    doc.addEventListener('click',resetNativeAnchor,true);
    doc.addEventListener('portfolio:dialog',dialogState);
    const animate=(selector,vars)=>{
      const targets=doc.querySelectorAll(selector);
      if(targets.length)gsap.from(targets,vars);
    };
    animate('.hero-copy > *',{y:22,opacity:0,duration:0.75,stagger:0.075,ease:'power2.out',clearProps:'all'});
    const portrait=doc.querySelector('.portrait-depth');
    if(portrait){
      const frame=doc.querySelector('.portrait-frame');
      if(frame)gsap.from(frame,{y:30,opacity:0,duration:1,ease:'power2.out',clearProps:'all'});
      if(desktop)gsap.to(portrait,{y:-34,rotationY:-7,rotationX:4,z:28,ease:'none',scrollTrigger:{trigger:'.identity-hero',start:'top top',end:'bottom top',scrub:0.8}});
    }
    if(desktop){
      const layers=doc.querySelector('[data-parallax-layers]');
      if(layers)for(const [layer,speed] of [[1,70],[2,55],[3,40],[4,10]]){
        const elements=layers.querySelectorAll(`[data-parallax-layer="${layer}"]`);
        if(elements.length)gsap.to(elements,{yPercent:speed,ease:'none',scrollTrigger:{trigger:layers,start:'top top',end:'bottom top',scrub:0.5}});
      }
    }
    for(const bar of doc.querySelectorAll('.score-fill')){
      gsap.from(bar,{scaleX:0,duration:1.1,ease:'power2.out',scrollTrigger:{trigger:bar,start:'top 94%',once:true},clearProps:'transform'});
    }
    for(const element of doc.querySelectorAll('.section-heading, .capability-column, .automation-capability, .resume-section')){
      gsap.from(element,{y:desktop?26:14,opacity:0.35,duration:0.75,ease:'power2.out',clearProps:'all',scrollTrigger:{trigger:element,start:'top 94%',once:true}});
    }
    const refreshProjects=()=>{
      projectTweens.forEach(tween=>tween.revert());projectTweens=[];
      const stages=[...doc.querySelectorAll('.project-stage:not([hidden])')];
      if(context.conditions.staged)stages.slice(0,-1).forEach((stage,index)=>{
        const screen=stage.querySelector('.project-screen');
        if(screen)projectTweens.push(gsap.to(screen,{scale:0.94,opacity:0.35,rotationX:-3,ease:'none',transformOrigin:'50% 0%',scrollTrigger:{trigger:stages[index+1],start:'top bottom',end:()=>`top top+=${doc.querySelector('.site-header')?.offsetHeight||0}`,scrub:0.6,invalidateOnRefresh:true}}));
      });
      for(const frame of doc.querySelectorAll('.case-cover > img')){
        projectTweens.push(gsap.fromTo(frame,{y:desktop?22:10,scale:0.98},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:frame.parentElement,start:'clamp(top 96%)',end:'clamp(center 67%)',scrub:0.7,invalidateOnRefresh:true}}));
      }
      lenis?.resize?.();ScrollTrigger.refresh();
    };
    // Event-created tweens must belong to this media context for safe cleanup.
    let layoutHandler;
    if(context.add){
      context.add('refreshProjects',refreshProjects);
      layoutHandler=context.refreshProjects || refreshProjects;
    }else layoutHandler=refreshProjects;
    layoutHandler();
    doc.addEventListener('portfolio:layout',layoutHandler);
    const refresh=()=>{lenis?.resize?.();ScrollTrigger.refresh();};
    const details=[...doc.querySelectorAll('details')];
    details.forEach(el=>el.addEventListener('toggle',refresh));
    const assets=[...doc.querySelectorAll('img')].filter(img=>!img.complete);
    assets.forEach(img=>img.addEventListener('load',refresh,{once:true}));
    let active=true;
    doc.fonts?.ready.then(()=>{if(active)refresh();});
    return ()=>{
      active=false;
      doc.removeEventListener('portfolio:layout',layoutHandler);
      doc.removeEventListener('click',resetNativeAnchor,true);
      doc.removeEventListener('portfolio:dialog',dialogState);
      details.forEach(el=>el.removeEventListener('toggle',refresh));
      assets.forEach(img=>img.removeEventListener('load',refresh));
      projectTweens.forEach(tween=>tween.revert());projectTweens=[];
      if(tick)gsap.ticker.remove(tick);
      if(lenis){lenis.off('scroll',ScrollTrigger.update);lenis.destroy();}
      doc.documentElement.classList.remove('smooth-motion');
    };
  });
  return ()=>{if(!disposed){disposed=true;media.revert();}};
}

const loadedScripts=new Map();
function loadScript(src){
  if(loadedScripts.has(src))return loadedScripts.get(src);
  const result=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=src;
    script.onload=resolve;script.onerror=()=>reject(new Error(`Optional motion library failed: ${src}`));
    document.head.append(script);
  });loadedScripts.set(src,result);return result;
}
function boot(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let dispose=()=>{},generation=0,hidden=false;
  async function sync(){
    const current=++generation;dispose();dispose=()=>{};
    if(hidden || reduced.matches)return;
    try{
      await loadScript('/vendor/gsap.min.js');
      await Promise.all([loadScript('/vendor/ScrollTrigger.min.js'),loadScript('/vendor/lenis.min.js')]);
      if(current!==generation || hidden || reduced.matches)return;
      dispose=mountMotion({win:window,doc:document,gsap:window.gsap,ScrollTrigger:window.ScrollTrigger,Lenis:window.Lenis});
    }catch{
      // Optional enhancement: native scrolling, HTML and CSS remain usable.
      dispose();dispose=()=>{};document.documentElement.classList.remove('smooth-motion');
    }
  }
  reduced.addEventListener?.('change',sync);
  window.addEventListener('pagehide',()=>{hidden=true;generation++;dispose();dispose=()=>{};});
  window.addEventListener('pageshow',event=>{if(event.persisted){hidden=false;sync();}});
  sync();
}
if(typeof window!=='undefined' && typeof document!=='undefined')boot();
