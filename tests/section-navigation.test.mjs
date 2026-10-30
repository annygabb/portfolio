import test from 'node:test';
import assert from 'node:assert/strict';
import {mountSectionNavigation} from '../public/section-navigation.js';
function fixture(){
 const listeners=new Map(),frames=new Map();let next=0,scroll=0;
 const ids=['sobre','perfil','formacao','projetos','impacto','experiencia','skills','metodo','curriculo','contato'];
 const sections=ids.map((id,i)=>({id,dataset:{navSection:({perfil:'sobre',experiencia:'impacto',metodo:'skills'})[id]},getBoundingClientRect:()=>({top:i*500-scroll})}));
 const links=['sobre','formacao','projetos','impacto','skills','curriculo','contato'].map(id=>({dataset:{nav:id},attrs:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]}}));
 const win={innerHeight:800,requestAnimationFrame(fn){frames.set(++next,fn);return next},cancelAnimationFrame(id){frames.delete(id)},addEventListener(k,fn){listeners.set(k,fn)},removeEventListener(k){listeners.delete(k)}};
 const doc={querySelectorAll:q=>q==='[data-nav]'?links:sections,getElementById:id=>sections.find(x=>x.id===id),querySelector:()=>({offsetHeight:82}),addEventListener(k,fn){listeners.set(k,fn)},removeEventListener(k){listeners.delete(k)}};
 const flush=()=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn());};
 return {win,doc,links,listeners,frames,flush,setScroll(value){scroll=value},active(){return links.filter(x=>x.attrs['aria-current']==='location').map(x=>x.dataset.nav)}};
}
test('navigation tracks education, projects and their grouped impact/tool sections',()=>{
 const f=fixture(),dispose=mountSectionNavigation(f);assert.deepEqual(f.active(),['sobre']);
 for(const [scroll,expected] of [[1000,'formacao'],[1500,'projetos'],[2500,'impacto'],[3500,'skills'],[4500,'contato']]){
  f.setScroll(scroll);f.listeners.get('scroll')();f.flush();assert.deepEqual(f.active(),[expected]);
 }
 dispose();assert.equal(f.listeners.size,0);
});
test('navigation coalesces scroll work and cancels queued work on disposal',()=>{
 const f=fixture(),dispose=mountSectionNavigation(f);
 f.listeners.get('scroll')();f.listeners.get('scroll')();assert.equal(f.frames.size,1);
 dispose();assert.equal(f.frames.size,0);assert.equal(f.listeners.size,0);
});
test('case pages keep their static project marker without home observers',()=>{
 const f=fixture();f.doc.getElementById=()=>undefined;
 assert.doesNotThrow(()=>mountSectionNavigation(f)());assert.equal(f.listeners.size,0);
});

test('Contact becomes current at the clamped end of a page with a short footer',()=>{
 const f=fixture();f.doc.documentElement={scrollHeight:4700};f.win.scrollY=3900;f.setScroll(3900);
 const dispose=mountSectionNavigation(f);assert.deepEqual(f.active(),['contato']);dispose();
});
