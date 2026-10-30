import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function fixture({withTool=false}={}){
 let active=null;
 const element=(attrs={})=>({hidden:false,attributes:{...attrs},events:{},setAttribute(k,v){this.attributes[k]=v},getAttribute(k){return this.attributes[k]},addEventListener(k,fn){this.events[k]=fn},focus(){active=this}});
 const menu=element({'aria-expanded':'false'}),firstLink=element(),theme=element();
 const tool=element();tool.tagName='DETAILS';tool.open=false;const toolLink=element();toolLink.dataset={openTool:'tool-pagespeed-seo-optimizer'};
 const classes=new Set();
 const root={dataset:{theme:'light'},classList:{toggle(k,on){if(on)classes.add(k);else classes.delete(k)},remove(k){classes.delete(k)},contains(k){return classes.has(k)}}};
 const doc={body:{dataset:{lang:'pt'}},documentElement:root,querySelector(q){return ({'.menu-toggle':menu,'.main-nav a':firstLink,'.theme-toggle':theme})[q]??null},querySelectorAll(q){return q==='.main-nav a'?[firstLink]:q==='[data-open-tool]'&&withTool?[toolLink]:[]},getElementById(id){return id==='tool-pagespeed-seo-optimizer'?tool:null},dispatchEvent(event){this.lastEvent=event},events:{},addEventListener(k,fn){this.events[k]=fn}};
 runInNewContext(readFileSync('public/app.js','utf8'),{document:doc,window:{},CustomEvent:class{constructor(type){this.type=type}},navigator:{},localStorage:{setItem(){throw Error('denied')}},matchMedia:()=>({matches:true})});
 return {menu,firstLink,theme,root,doc,tool,toolLink,get active(){return active}};
}
test('opening mobile navigation focuses its first link for forward keyboard navigation',()=>{
 const f=fixture();f.menu.focus();f.menu.events.click();
 assert.equal(f.menu.getAttribute('aria-expanded'),'true');
 assert.equal(f.active,f.firstLink);
});
test('Escape closes the menu and returns focus to its toggle',()=>{
 const f=fixture();f.menu.events.click();f.firstLink.focus();f.doc.events.keydown({key:'Escape'});
 assert.equal(f.menu.getAttribute('aria-expanded'),'false');assert.equal(f.active,f.menu);
});
test('theme works when storage permission is denied',()=>{
 const f=fixture();assert.doesNotThrow(()=>f.theme.events.click());
 assert.equal(f.root.dataset.theme,'dark');assert.equal(f.theme.getAttribute('aria-pressed'),'true');
});

test('tool links expand the intended inline details panel',()=>{
 const f=fixture({withTool:true});f.toolLink.events.click({});
 assert.equal(f.tool.open,true);assert.equal(f.doc.lastEvent.type,'portfolio:layout');
});
test('modified tool navigation preserves the browser new-tab action',()=>{
 const f=fixture({withTool:true});f.toolLink.events.click({ctrlKey:true});assert.equal(f.tool.open,false);
});
