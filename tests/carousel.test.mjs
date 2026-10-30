import test from 'node:test';
import assert from 'node:assert/strict';
import {mountWebsiteCarousel} from '../public/carousel.js';
function fixture(){
 const element=()=>({events:{},attributes:{},addEventListener(k,v){this.events[k]=v},removeEventListener(k){delete this.events[k]},setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]}});
 const prev=element(),next=element(),status={textContent:''},dots=[element(),element(),element()],slides=[{offsetLeft:0},{offsetLeft:1000},{offsetLeft:2000}],track=element();track.scrollLeft=0;track.scrollTo=({left})=>{track.scrollLeft=left;track.events.scroll?.()};
 const ownerDocument=element();
 const root={ownerDocument,querySelector:q=>({'.website-track':track,'[data-carousel-prev]':prev,'[data-carousel-next]':next,'[data-carousel-status]':status}[q]),querySelectorAll:q=>q==='.website-slide'?slides:dots};
 const win={matchMedia:()=>({matches:true}),requestAnimationFrame:fn=>{fn();return 0},cancelAnimationFrame(){},addEventListener(){},removeEventListener(){}};
 const dispose=mountWebsiteCarousel({win,root});return {prev,next,status,dots,track,root,slides,ownerDocument,dispose};
}
test('carousel buttons and indicators visit the three sites without moving past the ends',()=>{
 const f=fixture();assert.equal(f.prev.disabled,true);f.next.events.click();assert.equal(f.track.scrollLeft,1000);assert.equal(f.status.textContent,'2 / 3');assert.equal(f.dots[1].attributes['aria-current'],'true');f.next.events.click();assert.equal(f.next.disabled,true);f.dots[0].events.click();assert.equal(f.status.textContent,'1 / 3');f.dispose();assert.equal(f.track.events.scroll,undefined);
});
test('arrow keys work on the track and preserve nested links keyboard behavior',()=>{
 const f=fixture();let prevented=false;f.track.events.keydown({target:f.track,key:'ArrowRight',preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(f.status.textContent,'2 / 3');f.track.events.keydown({target:{},key:'ArrowRight'});assert.equal(f.status.textContent,'2 / 3');f.dispose();
});

test('hidden carousel keeps its index and resynchronizes when filters show it again',()=>{
 const f=fixture();f.dots[2].events.click();assert.equal(f.status.textContent,'3 / 3');f.root.hidden=true;f.track.clientWidth=0;f.slides.forEach(s=>{s.offsetLeft=0});f.track.events.scroll();assert.equal(f.status.textContent,'3 / 3');
 f.root.hidden=false;f.track.clientWidth=1000;f.slides.forEach((s,i)=>{s.offsetLeft=i*1000});f.ownerDocument.events['portfolio:layout']();assert.equal(f.status.textContent,'3 / 3');f.dispose();
});
