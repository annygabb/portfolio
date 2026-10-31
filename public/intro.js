/** Real 3D point projection, then an expanding aperture into the hero. */
export function introPhase(elapsed){
 const t=Math.max(0,Math.min(1,(elapsed-1050)/1250));
 return t*t*(3-2*t);
}
export function projectIntroPoint(point,angle,radius,width,height){
 const ca=Math.cos(angle),sa=Math.sin(angle),tilt=.32;
 const x=point.x*ca+point.z*sa,z=-point.x*sa+point.z*ca;
 const y=point.y*Math.cos(tilt)-z*Math.sin(tilt),depth=point.y*Math.sin(tilt)+z*Math.cos(tilt);
 const perspective=2.8/(2.8-depth*.5);
 return {x:width/2+x*radius*perspective,y:height/2+y*radius*perspective,depth,scale:perspective};
}
export function mountIntro({win,doc}){
 const root=doc.documentElement,loader=doc.querySelector('.site-intro');let deadline=0,frame=0,disposed=false,finished=false;
 const finish=()=>{if(disposed||finished)return;finished=true;win.clearTimeout(deadline);if(frame)win.cancelAnimationFrame(frame);root.classList.remove('intro-active');doc.dispatchEvent(new win.CustomEvent('portfolio:intro-ready'));};
 if(!loader||!root.classList.contains('intro-active')){finish();return ()=>{};}
 deadline=win.setTimeout(finish,3000);
 const canvas=loader.querySelector?.('canvas'),ctx=canvas?.getContext('2d');
 if(!ctx){finish();return ()=>{};}
 let width=0,height=0,start=null;
 const resize=()=>{width=win.innerWidth;height=win.innerHeight;const dpr=Math.min(win.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};resize();
 const count=width<700?1500:2800,points=Array.from({length:count},(_,i)=>{const y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y),theta=i*Math.PI*(3-Math.sqrt(5));return {x:Math.cos(theta)*r,y,z:Math.sin(theta)*r,seed:(i*73%997)/997};});
 const paint=time=>{
  if(disposed||finished)return;if(start===null)start=time;
  const elapsed=time-start,phase=introPhase(elapsed),base=Math.min(width,height)*.19,cover=Math.hypot(width,height)*.8,radius=base+(cover-base)*phase;
  ctx.clearRect(0,0,width,height);
  const angle=elapsed*.00055;
  for(const point of points){
   const p=projectIntroPoint(point,angle,radius,width,height);
   if(p.x<-4||p.y<-4||p.x>width+4||p.y>height+4)continue;
   ctx.globalAlpha=(.3+(p.depth+1)*.35)*(1-phase*.25);ctx.fillStyle=point.seed>.98?'#d6bf8c':'#b9c9e2';
   const size=(.9+point.seed*1.0)*p.scale*(1+phase*.5);ctx.fillRect(p.x,p.y,size,size);
  }
  ctx.globalAlpha=1;
  if(phase>.16){const reveal=(phase-.16)/.84*Math.hypot(width,height)*.62;const mask=`radial-gradient(circle at center, transparent ${reveal}px, #000 ${reveal+38}px)`;loader.style.maskImage=mask;loader.style.webkitMaskImage=mask;}
  loader.style.setProperty('--intro-label-opacity',String(Math.max(0,1-phase*3)));
  if(elapsed>=2400){finish();return;}frame=win.requestAnimationFrame(paint);
 };
 frame=win.requestAnimationFrame(paint);win.addEventListener('resize',resize);
 return ()=>{disposed=true;win.clearTimeout(deadline);if(frame)win.cancelAnimationFrame(frame);win.removeEventListener('resize',resize);root.classList.remove('intro-active');};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 const dispose=mountIntro({win:window,doc:document});window.addEventListener('pagehide',dispose);window.addEventListener('pageshow',event=>{if(event.persisted)document.documentElement.classList.remove('intro-active');});
}
