/** Progressive GSAP/ScrollTrigger + Lenis enhancement. Content is visible without it. */
export function mountMotion({win,doc,gsap,ScrollTrigger,Lenis}) {
  const noop=()=>{};
  if(!gsap || !ScrollTrigger || !Lenis || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  let disposed=false;
  media.add({desktop:'(min-width: 901px) and (pointer: fine)',staged:'(min-width: 768px) and (min-height: 700px)',motion:'(prefers-reduced-motion: no-preference)'}, context=>{
    if(!context.conditions.motion) return noop;
    const desktop=context.conditions.desktop;
    let lenis, tick, projectTweens=[];
    const restoreContent=[];
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
    const projectShape=()=>[win.innerWidth,win.innerHeight,...[...doc.querySelectorAll('.project-stage:not([hidden])')].map(stage=>{
      const scene=stage.querySelector('.project-scene'),available=win.innerHeight-(doc.querySelector('.site-header')?.offsetHeight||0);
      return !!scene && scene.scrollHeight>available+2;
    })].join('|');
    let lastShape;
    const refreshProjects=()=>{
      const previousY=win.scrollY;
      projectTweens.slice().reverse().forEach(tween=>tween.revert());projectTweens=[];
      const stages=[...doc.querySelectorAll('.project-stage:not([hidden])')];
      if(context.conditions.staged)for(const [index,stage] of stages.entries()){
        const screen=stage.querySelector('.project-screen'), visual=stage.querySelector('.stage-visual'), scene=stage.querySelector('.project-scene');
        const header=()=>doc.querySelector('.site-header')?.offsetHeight||0;
        const available=win.innerHeight-header();
        if(!screen || !scene || scene.scrollHeight>available+2)continue;
        // The screen stays fixed; its child travels through actual perspective space.
        projectTweens.push(gsap.fromTo(scene,{x:0,y:0,rotationX:18,rotationY:-6,z:-650,yPercent:14,scale:0.88,opacity:0.45},{x:0,y:0,rotationX:0,rotationY:0,z:0,yPercent:0,scale:1,opacity:1,ease:'none',scrollTrigger:{trigger:screen,start:'top bottom',end:()=>`top top+=${header()}`,scrub:0.65,invalidateOnRefresh:true}}));
        projectTweens.push(gsap.fromTo(scene,{x:0,y:0,rotationX:0,rotationY:0,z:0,yPercent:0,scale:1,opacity:1},{x:0,y:0,rotationX:-18,rotationY:6,z:-650,yPercent:-8,scale:0.88,opacity:0.3,immediateRender:false,ease:p=>Math.max(0,(p-0.55)/0.45),scrollTrigger:{trigger:screen,start:()=>`top top+=${header()}`,end:()=>`+=${Math.round(available*1.4)}`,pin:screen,pinSpacing:!!stage.querySelector('.project-tool-detail') || index===stages.length-1,scrub:0.65,invalidateOnRefresh:true}}));
        if(visual)projectTweens.push(gsap.fromTo(visual,{z:0,yPercent:2},{z:70,yPercent:-3,ease:'none',scrollTrigger:{trigger:screen,start:()=>`top top+=${header()}`,end:()=>`+=${Math.round(available*.75)}`,scrub:0.65,invalidateOnRefresh:true}}));
      }
      for(const frame of doc.querySelectorAll('.case-cover > img')){
        projectTweens.push(gsap.fromTo(frame,{y:desktop?22:10,scale:0.98},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:frame.parentElement,start:'clamp(top 96%)',end:'clamp(center 67%)',scrub:0.7,invalidateOnRefresh:true}}));
      }
      ScrollTrigger.refresh();lenis?.resize?.();
      if(Number.isFinite(previousY)){if(lenis)lenis.scrollTo(previousY,{immediate:true,force:true});else win.scrollTo({top:previousY,behavior:'instant'});}
      lastShape=projectShape();
    };
    // Recorded values stay in HTML; only their presentation is animated.
    for(const number of doc.querySelectorAll('[data-count-to]')){
      const final=number.textContent, state={value:0}, target=Number(number.getAttribute('data-count-to')), catalog=number.closest?.('.catalog-ruler');
      restoreContent.push(()=>{number.textContent=final;});
      number.textContent='0';
      gsap.to(state,{value:target,duration:catalog?2.1:1.8,ease:catalog?'power2.inOut':'power2.out',onUpdate:()=>{number.textContent=String(Math.round(state.value));},scrollTrigger:{trigger:catalog||number,start:'top 82%',once:true}});
    }
    for(const chart of doc.querySelectorAll('.quality-lines')){
      const trigger={trigger:chart,start:'top 82%',once:true};
      gsap.fromTo(chart.querySelectorAll('.quality-line'),{strokeDasharray:'1 1',strokeDashoffset:1},{strokeDasharray:'1 1',strokeDashoffset:0,autoRound:false,duration:2.2,stagger:0.3,ease:'power1.inOut',scrollTrigger:trigger});
      for(const selector of ['.quality-node','.quality-value'])gsap.fromTo(chart.querySelectorAll(selector),{opacity:0},{opacity:1,duration:0.35,stagger:0.16,delay:0.2,ease:'power1.out',scrollTrigger:trigger});
      gsap.fromTo(chart.querySelectorAll('tbody tr'),{opacity:0,y:12},{opacity:1,y:0,duration:0.6,stagger:0.35,delay:0.4,scrollTrigger:trigger});
    }
    for(const chart of doc.querySelectorAll('.catalog-ruler')){
      const trigger={trigger:chart,start:'top 82%',once:true};
      gsap.fromTo(chart.querySelector('.catalog-progress'),{strokeDasharray:'1 1',strokeDashoffset:1},{strokeDasharray:'1 1',strokeDashoffset:0,autoRound:false,duration:2.1,ease:'power2.inOut',scrollTrigger:trigger});
      gsap.fromTo(chart.querySelector('.catalog-marker'),{attr:{cx:30}},{attr:{cx:560},duration:2.1,ease:'power2.inOut',scrollTrigger:trigger});
      gsap.fromTo(chart.querySelectorAll('.catalog-tick, svg text'),{opacity:0},{opacity:1,duration:0.4,stagger:0.15,scrollTrigger:trigger});
    }
    const history=[...doc.querySelectorAll('.freelance, .earlier-history')];
    if(history.length && win.IntersectionObserver){
      // Use the actual visible area, independent of the upstream pin spacing.
      const observer=new win.IntersectionObserver(entries=>{
        for(const entry of entries){
          const available=entry.rootBounds?.height || win.innerHeight-(doc.querySelector('.site-header')?.offsetHeight||0);
          const height=entry.boundingClientRect?.height || available;
          const maxRatio=height>0 && available>0?Math.min(1,available/height):1;
          entry.target.style.opacity=String(Math.min(1,entry.intersectionRatio/(maxRatio*0.65)));
        }
      },{threshold:Array.from({length:21},(_,i)=>i/20),rootMargin:`-${doc.querySelector('.site-header')?.offsetHeight||0}px 0px 0px 0px`});
      history.forEach(element=>observer.observe(element));
      restoreContent.push(()=>{observer.disconnect();history.forEach(element=>element.style.removeProperty('opacity'));});
    }
    const thread=doc.querySelector('.thread-progress'), tip=doc.querySelector('.thread-tip');
    if(thread){
      const state={progress:0},length=thread.getTotalLength();
      gsap.to(state,{progress:1,ease:'none',scrollTrigger:{trigger:doc.documentElement,start:'top top',end:'max',scrub:0.35,invalidateOnRefresh:true},onUpdate:()=>{
        thread.style.strokeDashoffset=String(1-state.progress);
        if(tip){const point=thread.getPointAtLength(length*state.progress);tip.setAttribute('cx',point.x);tip.setAttribute('cy',point.y);}
      }});
      restoreContent.push(()=>{thread.style.strokeDashoffset='0';if(tip){tip.setAttribute('cx','12');tip.setAttribute('cy','0');}});
    }
    // Event-created tweens must belong to this media context for safe cleanup.
    let layoutHandler;
    if(context.add){
      context.add('refreshProjects',refreshProjects);
      layoutHandler=context.refreshProjects || refreshProjects;
    }else layoutHandler=refreshProjects;
    layoutHandler();
    doc.addEventListener('portfolio:layout',layoutHandler);
    const refresh=()=>{if(projectShape()!==lastShape)layoutHandler();else{ScrollTrigger.refresh();lenis?.resize?.();}};
    let resizeTimer;
    const resize=()=>{win.clearTimeout(resizeTimer);resizeTimer=win.setTimeout(refresh,120);};
    win.addEventListener('resize',resize);
    const details=[...doc.querySelectorAll('details')];
    details.forEach(el=>el.addEventListener('toggle',refresh));
    const assets=[...doc.querySelectorAll('img')].filter(img=>!img.complete);
    assets.forEach(img=>img.addEventListener('load',refresh,{once:true}));
    let active=true;
    doc.fonts?.ready.then(()=>{if(active)refresh();});
    return ()=>{
      active=false;
      restoreContent.forEach(restore=>restore());
      win.removeEventListener('resize',resize);
      win.clearTimeout(resizeTimer);
      doc.removeEventListener('portfolio:layout',layoutHandler);
      doc.removeEventListener('click',resetNativeAnchor,true);
      doc.removeEventListener('portfolio:dialog',dialogState);
      details.forEach(el=>el.removeEventListener('toggle',refresh));
      assets.forEach(img=>img.removeEventListener('load',refresh));
      projectTweens.slice().reverse().forEach(tween=>tween.revert());projectTweens=[];
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
