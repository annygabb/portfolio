/** A short white ink trace follows the pointer, never the footer lettering. */
export function trailSegments(points,now){
 const segments=[];let remaining=44;
 for(let i=points.length-1;i>0&&remaining>0;i--){
  const end=points[i],start=points[i-1],age=now-end.time;
  if(age>190)break;
  const dx=start.x-end.x,dy=start.y-end.y,distance=Math.hypot(dx,dy);if(!distance)continue;
  const length=Math.min(distance,remaining),ratio=length/distance;
  segments.push({x:end.x,y:end.y,toX:end.x+dx*ratio,toY:end.y+dy*ratio,alpha:Math.max(0,1-age/190)*(.25+.65*remaining/44),width:.5+1.5*remaining/44});
  remaining-=length;
 }
 return segments;
}
export function mountFooterTrail({win,doc,root}){
 if(!root||win.matchMedia('(prefers-reduced-motion: reduce)').matches)return ()=>{};
 const canvas=doc.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 canvas.className='footer-cursor-trail';canvas.setAttribute('aria-hidden','true');root.prepend(canvas);
 let width=0,height=0,frame=0,points=[],disposed=false;
 const stop=()=>{if(frame)win.cancelAnimationFrame(frame);frame=0;};
 const clear=()=>{stop();points=[];ctx.clearRect(0,0,width,height);};
 const resize=()=>{clear();width=root.clientWidth;height=root.clientHeight;const dpr=Math.min(win.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
 const paint=time=>{
  frame=0;if(disposed||doc.hidden)return;ctx.clearRect(0,0,width,height);
  points=points.filter(p=>time-p.time<=190);
  ctx.lineCap='round';ctx.lineJoin='round';
  for(const segment of trailSegments(points,time)){ctx.strokeStyle=`rgba(255,255,255,${segment.alpha})`;ctx.lineWidth=segment.width;ctx.beginPath();ctx.moveTo(segment.x,segment.y);ctx.lineTo(segment.toX,segment.toY);ctx.stroke();}
  if(points.length>1)frame=win.requestAnimationFrame(paint);
 };
 const move=event=>{
  if(event.pointerType==='touch'||doc.hidden)return;
  const rect=root.getBoundingClientRect(),time=win.performance.now();
  points.push({x:event.clientX-rect.left,y:event.clientY-rect.top,time});if(points.length>28)points.shift();
  if(!frame)frame=win.requestAnimationFrame(paint);
 };
 const visibility=()=>{if(doc.hidden)clear();};
 const observer=win.IntersectionObserver?new win.IntersectionObserver(entries=>{if(!entries[0].isIntersecting)clear();}):null;
 resize();root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',clear);win.addEventListener('resize',resize);doc.addEventListener('visibilitychange',visibility);observer?.observe(root);
 return ()=>{disposed=true;clear();observer?.disconnect();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',clear);win.removeEventListener('resize',resize);doc.removeEventListener('visibilitychange',visibility);canvas.remove();};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 let dispose=()=>{};const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{dispose();dispose=mountFooterTrail({win:window,doc:document,root:document.querySelector('.minimal-footer')});};
 reduce.addEventListener('change',sync);window.addEventListener('pagehide',()=>dispose());window.addEventListener('pageshow',e=>{if(e.persisted)sync();});sync();
}
