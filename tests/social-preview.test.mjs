import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderPage} from '../src/render.mjs';
import {owner,projects} from '../src/content.mjs';
const file='public/assets/og-preview-anny-gabrielly-v1.jpg';
test('the social preview is a real JPEG, 1200×630 and at most 200000 bytes',()=>{
 const data=readFileSync(file);assert.ok(data.length<=200000);assert.equal(data.readUInt16BE(0),0xffd8);
 let offset=2,dimensions=null;
 while(offset<data.length){assert.equal(data[offset],0xff);const marker=data[offset+1],length=data.readUInt16BE(offset+2);if(marker===0xc0||marker===0xc2){dimensions=[data.readUInt16BE(offset+7),data.readUInt16BE(offset+5)];break;}offset+=length+2;}
 assert.deepEqual(dimensions,[1200,630]);
});
test('all PT/EN routes expose one absolute JPEG in Open Graph and Twitter Card',()=>{
 const url=owner.site+'/assets/og-preview-anny-gabrielly-v1.jpg';
 for(const lang of ['pt','en'])for(const project of [null,...projects]){
  const html=renderPage({lang,project});
  assert.ok(html.includes(`<meta property="og:image" content="${url}">`));assert.ok(html.includes(`<meta name="twitter:image" content="${url}">`));
  assert.ok(html.includes('<meta property="og:image:type" content="image/jpeg">'));assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.indexOf('property="og:image"')<html.indexOf('property="og:image:width"'));
  assert.ok(!html.includes('/assets/social.png'));
 }
});
