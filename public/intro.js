/** Numeric motion sampled from the supplied reference, redrawn as sharp live type. */
export function decodeNumericMotion(buffer){
 const view=new DataView(buffer);
 if(view.byteLength<10||view.getUint32(0)!==0x414e4d31)throw new Error('Invalid numeric animation');
 const width=view.getUint16(4,true),height=view.getUint16(6,true),count=view.getUint16(8,true),frames=[];let offset=10;
 if(!width||!height||count<2||count>200)throw new Error('Invalid animation dimensions');
 for(let i=0;i<count;i++){
  if(offset+2>view.byteLength)throw new Error('Truncated animation');
  const glyphs=view.getUint16(offset,true);offset+=2;
  if(glyphs>5000||offset+glyphs*11>view.byteLength)throw new Error('Truncated glyphs');
  frames.push({offset,count:glyphs});offset+=glyphs*11;
 }
 return {view,width,height,frames};
}
export function numericIntroPhase(elapsed){return Math.max(0,Math.min(1,(elapsed-2850)/650));}
export function mountIntro({win,doc}){
 const root=doc.documentElement,loader=doc.querySelector('.site-intro');
 let timer=0,frame=0,disposed=false,finished=false,width=0,height=0;
 const controller=win.AbortController?new win.AbortController():null;
 const stop=()=>{if(frame)win.cancelAnimationFrame(frame);frame=0;};
 const finish=()=>{
  if(disposed||finished)return;finished=true;stop();win.clearTimeout(timer);controller?.abort();
  loader?.classList.add('intro-leaving');root.classList.remove('intro-active');
  doc.dispatchEvent(new win.CustomEvent('portfolio:intro-ready'));
 };
 if(!loader||!root.classList.contains('intro-active')){finish();return ()=>{};}
 timer=win.setTimeout(finish,4500);
 const canvas=loader.querySelector('canvas'),ctx=canvas?.getContext('2d');
 if(!ctx||!win.fetch){finish();return ()=>{};}
 const resize=()=>{width=win.innerWidth;height=win.innerHeight;const dpr=Math.min(win.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};resize();win.addEventListener('resize',resize);
 win.fetch('/assets/numeric-motion-v1.bin',{signal:controller?.signal}).then(response=>{if(!response.ok)throw new Error('Animation unavailable');return response.arrayBuffer();}).then(buffer=>{
  if(disposed||finished)return;const data=decodeNumericMotion(buffer);let start=null;
  const paint=time=>{
   frame=0;if(disposed||finished)return;if(start===null)start=time;
   const elapsed=time-start,reveal=numericIntroPhase(elapsed),position=Math.min(data.frames.length-1.001,elapsed/3350*(data.frames.length-1)),index=Math.floor(position),mix=position-index,shape=data.frames[index];
   const fit=Math.min(width*.94/data.width,height*.78/data.height),zoom=1+reveal**3*4,scale=fit*zoom;
   ctx.clearRect(0,0,width,height);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${Math.max(6,7*scale)}px ui-monospace,Consolas,monospace`;
   const stride=width<500?2:1;
   for(let i=0;i<shape.count;i+=stride){
    const o=shape.offset+i*11,v=data.view,x=v.getUint16(o,true)/16,y=v.getUint16(o+2,true)/16,tx=v.getUint16(o+4,true)/16,ty=v.getUint16(o+6,true)/16;
    const alpha=(v.getUint8(o+8)*(1-mix)+v.getUint8(o+9)*mix)/255;
    if(alpha<.06)continue;ctx.globalAlpha=(.3+.7*alpha)*(1-reveal*.65);
    ctx.fillText((v.getUint8(o+10)||i%3===0)?'1':'0',width/2+(x+(tx-x)*mix-data.width/2)*scale,height/2+(y+(ty-y)*mix-data.height/2)*scale);
   }
   ctx.globalAlpha=1;loader.style.opacity=String(1-reveal);loader.style.setProperty('--intro-label-opacity',String(1-reveal));
   if(elapsed>=3500){finish();return;}frame=win.requestAnimationFrame(paint);
  };
  frame=win.requestAnimationFrame(paint);
 }).catch(()=>finish());
 return ()=>{disposed=true;stop();win.clearTimeout(timer);controller?.abort();win.removeEventListener('resize',resize);root.classList.remove('intro-active');};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 const dispose=mountIntro({win:window,doc:document});window.addEventListener('pagehide',dispose);
 window.addEventListener('pageshow',event=>{if(event.persisted)document.documentElement.classList.remove('intro-active');});
}
