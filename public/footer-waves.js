/** White cursor ripples behind the footer, independent of the selected theme. */
export function rippleAt(age){const t=Math.max(0,Math.min(1,age/2200));return {radius:12+320*t,alpha:(1-t)**2*.85};}
export function mountFooterWaves({win,doc,root}){
 if(!root||win.matchMedia('(prefers-reduced-motion: reduce)').matches)return ()=>{};
 const canvas=doc.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 canvas.className='footer-wave-canvas';canvas.setAttribute('aria-hidden','true');root.prepend(canvas);
 let width=0,height=0,frame=0,last=-Infinity,waves=[],disposed=false;
 const stop=()=>{if(frame)win.cancelAnimationFrame(frame);frame=0;};
 const resize=()=>{width=root.clientWidth;height=root.clientHeight;const dpr=Math.min(win.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);waves=[];};
 const paint=time=>{
  frame=0;if(disposed||doc.hidden)return;ctx.clearRect(0,0,width,height);
  waves=waves.filter(w=>time-w.born<2200);
  for(const wave of waves){const {radius,alpha}=rippleAt(time-wave.born);ctx.strokeStyle=`rgba(255,255,255,${alpha})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(wave.x,wave.y,radius,radius*.66,0,0,Math.PI*2);ctx.stroke();}
  if(waves.length)frame=win.requestAnimationFrame(paint);
 };
 const move=event=>{
  if(event.pointerType==='touch'||doc.hidden)return;
  const now=win.performance.now();if(now-last<65)return;last=now;
  const rect=root.getBoundingClientRect();waves.push({x:event.clientX-rect.left,y:event.clientY-rect.top,born:now});if(waves.length>18)waves.shift();
  if(!frame)frame=win.requestAnimationFrame(paint);
 };
 const visibility=()=>{if(doc.hidden){stop();waves=[];ctx.clearRect(0,0,width,height);}};
 const observer=win.IntersectionObserver?new win.IntersectionObserver(entries=>{if(!entries[0].isIntersecting){stop();waves=[];ctx.clearRect(0,0,width,height);}}):null;
 resize();root.addEventListener('pointermove',move,{passive:true});win.addEventListener('resize',resize);doc.addEventListener('visibilitychange',visibility);observer?.observe(root);
 return ()=>{disposed=true;stop();observer?.disconnect();root.removeEventListener('pointermove',move);win.removeEventListener('resize',resize);doc.removeEventListener('visibilitychange',visibility);canvas.remove();};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 let dispose=()=>{};const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{dispose();dispose=mountFooterWaves({win:window,doc:document,root:document.querySelector('.minimal-footer')});};
 reduce.addEventListener('change',sync);window.addEventListener('pagehide',()=>dispose());window.addEventListener('pageshow',e=>{if(e.persisted)sync();});sync();
}
