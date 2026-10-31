/** Canvas particle typography inspired by the supplied Vapour Text reference.
 * Original implementation: no React runtime or third-party component code. */
export function vaporAmount(elapsed){
  const cycle=elapsed%3.8;
  return cycle<.6?0:cycle<1.45?(cycle-.6)/.85:cycle<2.3?1-(cycle-1.45)/.85:0;
}
export function vaporPosition(point,amount,time){
  const drift=point.seed;
  return {x:point.x+amount*(Math.sin(drift*17+time)*24+drift*70),y:point.y-amount*(40+drift*85)+Math.sin(time*2+drift*9)*amount*12,alpha:Math.max(0,1-amount*.92)};
}
export function mountVapour({win,doc,root}){
  if(!root||!win.IntersectionObserver||win.matchMedia('(prefers-reduced-motion: reduce)').matches)return ()=>{};
  const canvas=root.querySelector('canvas'),text=root.querySelector('.closing-watermark'),ctx=canvas?.getContext('2d');
  if(!ctx)return ()=>{};
  let frame=0,start=0,active=false,disposed=false,points=[],width=0,height=0,font='',color='',baseline=0,layout=[];
  const build=()=>{
    const style=win.getComputedStyle(text);width=root.clientWidth;height=root.clientHeight;
    if(!width||!height)return;
    const ratio=Math.min(win.devicePixelRatio||1,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
    font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;color=style.color;baseline=height*.76;
    const names=[...text.querySelectorAll('span')];
    layout=names.length?names.map((name,i)=>{
      const row=height/names.length,size=row*.85;ctx.font=`${style.fontWeight} ${size}px ${style.fontFamily}`;
      const fit=Math.min(size,size*(width*.94)/ctx.measureText(name.textContent).width);
      return {text:name.textContent,font:`${style.fontWeight} ${fit}px ${style.fontFamily}`,y:row*i+row*.73};
    }):[{text:text.textContent,font,y:baseline}];
    const sample=doc.createElement('canvas');sample.width=width;sample.height=height;const ink=sample.getContext('2d');
    ink.textAlign='center';for(const line of layout){ink.font=line.font;ink.fillText(line.text,width/2,line.y,width*.96);}
    const pixels=ink.getImageData(0,0,width,height).data;points=[];
    const step=Math.max(3,Math.ceil(Math.sqrt(width*height/18000)));
    for(let y=0;y<height;y+=step)for(let x=0;x<width;x+=step)if(pixels[(y*width+x)*4+3]>100)points.push({x,y,seed:((x*37+y*71)%997)/997});
    root.classList.add('vapour-ready');
  };
  const paint=time=>{
    frame=0;if(disposed||!active||doc.hidden)return;
    if(!start)start=time;const elapsed=(time-start)/1000,amount=vaporAmount(elapsed);
    ctx.clearRect(0,0,width,height);ctx.fillStyle=color;
    if(amount<.002){ctx.globalAlpha=1;ctx.textAlign='center';for(const line of layout){ctx.font=line.font;ctx.fillText(line.text,width/2,line.y,width*.96);}}
    else{
      ctx.globalAlpha=Math.max(0,1-amount*2);ctx.textAlign='center';for(const line of layout){ctx.font=line.font;ctx.fillText(line.text,width/2,line.y,width*.96);}
      for(const point of points){const p=vaporPosition(point,amount,elapsed);ctx.globalAlpha=p.alpha;ctx.fillRect(p.x,p.y,1.6,1.6);}
    }
    ctx.globalAlpha=1;frame=win.requestAnimationFrame(paint);
  };
  const stop=()=>{if(frame)win.cancelAnimationFrame(frame);frame=0;};
  const play=()=>{if(active&&!doc.hidden&&!frame)frame=win.requestAnimationFrame(paint);};
  const observer=new win.IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active){start=0;play();}else stop();},{threshold:.12});
  const resize=()=>{build();start=0;play();};
  const visibility=()=>doc.hidden?stop():play();
  const theme=new win.MutationObserver(()=>{color=win.getComputedStyle(text).color;});theme.observe(doc.documentElement,{attributes:true,attributeFilter:['data-theme']});
  build();observer.observe(root);win.addEventListener('resize',resize);doc.addEventListener('visibilitychange',visibility);
  doc.fonts?.ready.then(()=>{if(!disposed)resize();});
  return ()=>{disposed=true;stop();observer.disconnect();theme.disconnect();win.removeEventListener('resize',resize);doc.removeEventListener('visibilitychange',visibility);root.classList.remove('vapour-ready');ctx.clearRect(0,0,width,height);};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 let dispose=()=>{},hidden=false;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{dispose();dispose=hidden?()=>{}:mountVapour({win:window,doc:document,root:document.querySelector('.vapour-signature')});};
 reduce.addEventListener('change',sync);window.addEventListener('pagehide',()=>{hidden=true;dispose();});window.addEventListener('pageshow',event=>{if(event.persisted){hidden=false;sync();}});sync();
}
