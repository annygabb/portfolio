export function mountWebsiteCarousel({win,root}) {
  if(!root) return ()=>{};
  const track=root.querySelector('.website-track'), slides=[...root.querySelectorAll('.website-slide')], dots=[...root.querySelectorAll('[data-carousel-index]')];
  const prev=root.querySelector('[data-carousel-prev]'), next=root.querySelector('[data-carousel-next]'), status=root.querySelector('[data-carousel-status]');
  let index=0,pending=0;
  const update=()=>{
    pending=0;if(root.hidden||track.clientWidth===0)return;index=slides.reduce((best,slide,i)=>Math.abs(slide.offsetLeft-track.scrollLeft)<Math.abs(slides[best].offsetLeft-track.scrollLeft)?i:best,0);
    prev.disabled=index===0;next.disabled=index===slides.length-1;status.textContent=`${index+1} / ${slides.length}`;
    dots.forEach((dot,i)=>{if(i===index)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
  };
  const go=i=>{const target=Math.max(0,Math.min(slides.length-1,i));track.scrollTo({left:slides[target].offsetLeft,behavior:win.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  const back=()=>go(index-1),forward=()=>go(index+1),schedule=()=>{if(!pending)pending=win.requestAnimationFrame(update);};
  const keys=event=>{if(event.target!==track)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();go(index+(event.key==='ArrowRight'?1:-1));}};
  prev.addEventListener('click',back);next.addEventListener('click',forward);track.addEventListener('scroll',schedule,{passive:true});track.addEventListener('keydown',keys);win.addEventListener('resize',schedule);root.ownerDocument?.addEventListener('portfolio:layout',schedule);
  const dotHandlers=dots.map((dot,i)=>{const click=()=>go(i);dot.addEventListener('click',click);return click;});update();
  return ()=>{prev.removeEventListener('click',back);next.removeEventListener('click',forward);track.removeEventListener('scroll',schedule);track.removeEventListener('keydown',keys);win.removeEventListener('resize',schedule);root.ownerDocument?.removeEventListener('portfolio:layout',schedule);dots.forEach((dot,i)=>dot.removeEventListener('click',dotHandlers[i]));if(pending)win.cancelAnimationFrame(pending);};
}
if(typeof window!=='undefined'&&typeof document!=='undefined') {
  let dispose=mountWebsiteCarousel({win:window,root:document.querySelector('[data-website-carousel]')});
  window.addEventListener('pagehide',()=>dispose());window.addEventListener('pageshow',event=>{if(event.persisted)dispose=mountWebsiteCarousel({win:window,root:document.querySelector('[data-website-carousel]')});});
}
