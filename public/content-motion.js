/** Replay from actual visibility, rather than from scroll positions altered by pins. */
export function observeVisibility(win, elements, enter, leave) {
  if (!win.IntersectionObserver || !elements.length) return () => {};
  const visible = new Set();
  const observer = new win.IntersectionObserver(entries => {
    for (const entry of entries) {
      const onScreen = entry.isIntersecting ?? entry.intersectionRatio > 0;
      if (onScreen && entry.intersectionRatio > 0.005 && !visible.has(entry.target)) {
        visible.add(entry.target); enter(entry.target);
      } else if (!onScreen && visible.delete(entry.target)) leave(entry.target);
    }
  }, {threshold:[0,0.005,0.12,0.5,1], rootMargin:'0px 0px -4% 0px'});
  elements.forEach(element => observer.observe(element));
  return () => observer.disconnect();
}

export function risingPoints(points, progress, baseline = 210) {
  return points.trim().split(/\s+/).map(point => {
    const [x,y] = point.split(',').map(Number);
    return `${x},${baseline+(y-baseline)*progress}`;
  }).join(' ');
}

function rememberStyle(element) {
  const original = element.getAttribute('style');
  return () => original === null ? element.removeAttribute('style') : element.setAttribute('style',original);
}

function prepareWriting({win,doc,gsap}, heading) {
  const html = heading.innerHTML, label = heading.getAttribute('aria-label');
  const name = (heading.innerText || heading.textContent).replace(/\s+/g,' ').trim();
  const walker = doc.createTreeWalker(heading,win.NodeFilter?.SHOW_TEXT || 4), nodes = [];
  while(walker.nextNode()) if(!walker.currentNode.parentElement.closest('small,.sr-only,[aria-hidden="true"]')) nodes.push(walker.currentNode);
  const words = [];
  for(const node of nodes) {
    const fragment = doc.createDocumentFragment();
    for(const part of node.textContent.split(/(\s+)/)) {
      if(!/[\p{L}\p{N}]/u.test(part)) {fragment.append(doc.createTextNode(part));continue;}
      const word = doc.createElement('span'), ink = doc.createElement('span');
      word.className = 'type-word'; ink.className = 'type-ink'; ink.textContent = part;
      ink.setAttribute('aria-hidden','true'); word.append(ink); fragment.append(word); words.push(ink);
    }
    node.replaceWith(fragment);
  }
  heading.setAttribute('aria-label',name); heading.classList.add('writing-ready');
  const marker = heading.querySelector('em') || words.at(-1)?.parentElement;
  marker?.classList.add('marker-word');
  const timeline = gsap.timeline({paused:true});
  for(const word of words) {
    const letters = [...word.textContent].length;
    timeline.fromTo(word,{clipPath:'inset(-35% 100% -35% 0%)'},{clipPath:'inset(-35% -8% -35% -3%)',duration:Math.min(.42,Math.max(.12,letters*.027)),ease:`steps(${letters})`});
  }
  if(marker) timeline.fromTo(marker,{'--marker-scale':0},{'--marker-scale':1,duration:.45,ease:'power2.out'});
  return {enter:()=>timeline.play(0), leave:()=>timeline.pause(0), dispose:()=>{
    timeline.kill(); heading.innerHTML=html; heading.classList.remove('writing-ready');
    if(label===null) heading.removeAttribute('aria-label'); else heading.setAttribute('aria-label',label);
  }};
}

export function mountContentMotion({win,doc,gsap}) {
  if(!win.IntersectionObserver) return () => {};
  const cleanup = [], watch=(items,enter,leave)=>cleanup.push(observeVisibility(win,items,enter,leave));
  const counters = [...doc.querySelectorAll('[data-count-to]')].filter(el=>!el.closest?.('.catalog-ruler'));
  const counts = new Map();
  for(const element of counters) {
    const final=element.textContent, state={value:0}; let tween;
    const reset=()=>{tween?.kill();state.value=0;element.textContent='0';}; reset();
    counts.set(element,{enter:()=>{reset();tween=gsap.to(state,{value:Number(element.getAttribute('data-count-to')),duration:2.4,ease:'power1.out',onUpdate:()=>{element.textContent=String(Math.round(state.value));}});},leave:reset});
    cleanup.push(()=>{tween?.kill();element.textContent=final;});
  }
  watch(counters,el=>counts.get(el).enter(),el=>counts.get(el).leave());

  const charts = new Map();
  for(const chart of doc.querySelectorAll('.quality-metric')) {
    const svg=chart.querySelector('svg'),line=chart.querySelector('.quality-line'),area=chart.querySelector('.quality-area'),nodes=[...chart.querySelectorAll('.quality-node')];
    const original=line.getAttribute('points'),originalArea=area.getAttribute('d'),cy=nodes.map(n=>n.getAttribute('cy')),baseline=Number(chart.dataset.baseline)||130;
    const state={progress:0},timeline=gsap.timeline({paused:true});
    const render=()=>{
      const points=risingPoints(original,state.progress,baseline);
      line.setAttribute('points',points);area.setAttribute('d',`M32 ${baseline} L${points.replaceAll(' ',' L')} L288 ${baseline} Z`);
      nodes.forEach((node,j)=>node.setAttribute('cy',String(baseline+(Number(cy[j])-baseline)*state.progress)));
    };
    render();timeline.to(state,{progress:1,duration:2,ease:'power2.out',onUpdate:render});
    charts.set(svg,{enter:()=>timeline.play(0),leave:()=>{timeline.pause(0);state.progress=0;render();}});
    cleanup.push(()=>{timeline.kill();line.setAttribute('points',original);area.setAttribute('d',originalArea);nodes.forEach((n,j)=>n.setAttribute('cy',cy[j]));});
  }
  watch([...charts.keys()],el=>charts.get(el).enter(),el=>charts.get(el).leave());

  const catalogs=new Map();
  for(const chart of doc.querySelectorAll('.catalog-ruler')) {
    const svg=chart.querySelector('svg'), path=chart.querySelector('.catalog-progress'), marker=chart.querySelector('.catalog-marker'), count=chart.querySelector('[data-count-to]'), state={value:0};
    const final=count.textContent, restorePath=rememberStyle(path), cx=marker.getAttribute('cx');
    const timeline=gsap.timeline({paused:true});
    timeline.fromTo(path,{strokeDasharray:'1 1',strokeDashoffset:1},{strokeDashoffset:0,autoRound:false,duration:2.1,ease:'power2.inOut'},0)
      .fromTo(marker,{attr:{cx:30}},{attr:{cx:560},duration:2.1,ease:'power2.inOut'},0)
      .to(state,{value:48,duration:2.1,ease:'power2.inOut',onUpdate:()=>{count.textContent=String(Math.round(state.value));}},0);
    count.textContent='0';
    catalogs.set(svg,{enter:()=>timeline.play(0),leave:()=>{timeline.pause(0);state.value=0;count.textContent='0';}});
    cleanup.push(()=>{timeline.kill();restorePath();marker.setAttribute('cx',cx);count.textContent=final;});
  }
  watch([...catalogs.keys()],el=>catalogs.get(el).enter(),el=>catalogs.get(el).leave());

  const blocks=[...doc.querySelectorAll('.portrait-frame, .hero-greeting, .hero-role, .hero-actions, .profile-section > div:first-child, .profile-story > p, .profile-social-links, .section-heading, .carousel-heading, .degree-block, .education-list li, .education-experiences, .experience-row, .automation, .earlier-history > h3, .earlier-history > div > article, .tech-group, .tech-logo, .resume-section > div, .resume-section > a, .closing-top > div, .closing-nav > div, .case-story > section, .tool-detail > summary, .tool-introduction > figure, .tool-introduction > div, .tool-decisions > article, .tool-evidence, .website-slide .stage-copy, .website-slide .stage-visual')];
  const reveals=new Map();
  blocks.forEach((element,index)=>{
    const restore=rememberStyle(element);let tween;
    const reset=()=>{tween?.kill();gsap.set(element,{opacity:0,y:24});};reset();
    reveals.set(element,{enter:()=>{tween?.kill();tween=gsap.to(element,{opacity:1,y:0,duration:.65,delay:index%3*.045,ease:'power2.out'});},leave:reset});
    cleanup.push(()=>{tween?.kill();restore();});
  });
  watch(blocks,el=>reveals.get(el).enter(),el=>reveals.get(el).leave());
  const writing=new Map();
  for(const heading of doc.querySelectorAll('h1,h2,.stage-copy h3,.tool-name')) {
    const effect=prepareWriting({win,doc,gsap},heading);writing.set(heading,effect);cleanup.push(effect.dispose);
  }
  watch([...writing.keys()],el=>writing.get(el).enter(),el=>writing.get(el).leave());
  return ()=>{for(const dispose of cleanup.slice().reverse())dispose();};
}
