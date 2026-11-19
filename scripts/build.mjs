import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync, spawnSync} from 'node:child_process';
import {inflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ids=['puci','kuci','putri_paramita'];
const originals=[...ids,'lineup_tinggi'].flatMap(id=>['svg','png'].map(ext=>`karakter/${id}.${ext}`));
const hashes=async()=>Object.fromEntries(await Promise.all(originals.map(async f=>[f,createHash('sha256').update(await fs.readFile(path.join(root,f))).digest('hex')])));
const before=await hashes();
for(const d of ['karakter/svg','karakter/png']) await fs.mkdir(path.join(root,d),{recursive:true});
const jobs=[];
const wrap=(body,w,h,defs='')=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
const text=(x,y,t,size=24)=>`<text x="${x}" y="${y}" font-family="Arial" font-size="${size}" fill="#3B2A20">${t}</text>`;
async function save(name,svg,w,h,transparent=false){await fs.writeFile(path.join(root,'karakter/svg',name+'.svg'),svg);jobs.push({name,svg,w,h,transparent});}
const sources={};
for(const id of ids){
 const raw=await fs.readFile(path.join(root,'karakter',id+'.svg'),'utf8');
 const defs=raw.match(/<defs>([\s\S]*?)<\/defs>/)[1].replace(/<linearGradient[\s\S]*?<\/linearGradient>/g,'');
 const start=raw.indexOf('<g stroke="#3B2A20"');
 const end=raw.lastIndexOf('\n  <rect x=');
 const body=raw.slice(start,end).trim();
 if(!body.endsWith('</g>')) throw Error('Source layout changed: '+id);
 sources[id]={body,defs};
 await save(id+'_transparent',wrap(`<g transform="scale(1.5)">${body}</g>`,1080,1920,defs),1080,1920,true);
}
// Hand-drawn orthographic profiles/back silhouettes. No mirrored fronts.
const g=b=>`<g stroke="#3B2A20" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${b}</g>`;
const ellipse=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c}"/>`;
const p=(d,c)=>`<path d="${d}" fill="${c}"/>`;
function dwarf(id,back){
 const k=id==='kuci',skin='#FFD3B0',hair=k?'#5A3820':'#A0673A',hat=k?'#FFD84D':'#A8DDF7',tunic=k?'#FFE066':hat,band=k?'#F5B921':'#6EC1EC',short=k?'#C8742E':'#2F6FB5';
 let b=rect(back?300:325,950,40,110,skin)+rect(back?380:345,950,40,110,skin);
 b+=back?p('M292 1045 H348 V1112 H282 V1070 Z','#8B5A2B')+p('M372 1045 H428 V1112 H362 V1070 Z','#8B5A2B'):p('M320 1045 H380 V1070 Q438 1080 438 1112 H320 Z','#8B5A2B');
 b+=back?p('M275 890 H445 V985 H372 L360 950 L348 985 H275 Z',short):rect(310,890,k?120:92,95,short);
 b+=back?p(k?'M290 650 Q360 630 430 650 Q500 790 490 925 H230 Q220 790 290 650 Z':'M300 650 Q360 635 420 650 L468 925 H252 Z',tunic):p(k?'M320 650 H380 Q470 780 438 925 H290 Q278 760 320 650 Z':'M330 650 H380 Q410 780 405 925 H300 Z',tunic);
 b+=rect(back?(k?230:255):300,835,back?(k?260:210):(k?138:105),35,'#8B5A2B');
 b+=back?rect(250,675,36,145,tunic)+ellipse(268,828,22,24,skin)+rect(435,675,36,145,tunic)+ellipse(453,828,22,24,skin):p('M340 670 Q310 730 322 810 L360 812 Q344 750 372 690 Z',tunic)+ellipse(344,824,22,24,skin);
 if(back){b+=ellipse(360,525,k?138:125,125,hair)+ellipse(225,545,20,24,skin)+ellipse(495,545,20,24,skin);b+=p('M240 490 Q260 600 300 622 M480 490 Q460 600 420 622','none');}
 else {b+=p('M300 430 Q400 405 420 495 L448 550 Q469 565 440 578 L428 583 Q425 635 378 649 Q300 657 278 570 Q260 470 300 430 Z',skin);b+=p('M282 470 Q265 540 305 565 L326 490 Z',hair)+ellipse(318,544,20,26,skin)+ellipse(401,534,13,23,'#FFFFFF')+ellipse(406,537,7,12,'#2B1D14')+p('M388 497 Q402 484 417 494','none')+p('M410 607 Q425 615 435 602','none');if(k)b+=ellipse(402,584,3,3,'#C98A5A')+ellipse(412,594,3,3,'#C98A5A')+ellipse(420,582,3,3,'#C98A5A');}
 // Back view reverses viewer-relative hat bend because the character has rotated.
 const tipLeft=back?!k:k;
 b+=p(tipLeft?'M235 455 Q280 260 325 140 Q300 110 270 150 Q275 95 320 110 Q415 205 490 455 Z':'M235 455 Q300 230 380 110 Q435 95 455 150 Q425 130 405 155 Q455 320 490 455 Z',hat)+ellipse(tipLeft?270:455,150,20,20,'#FFFFFF')+rect(back?215:272,435,back?290:165,50,band);
 return g(b);
}
const star=(x,y)=>`<polygon transform="translate(${x} ${y})" points="0,-30 8,-10 29,-9 12,4 18,24 0,13 -18,24 -12,4 -29,-9 -8,-10" fill="#FFD84D"/>`;
function paramita(back){
 let b=ellipse(back?330:365,1088,26,13,'#E0528F');if(back)b+=ellipse(390,1088,26,13,'#E0528F');
 const skirt=back?'M308 560 H412 Q470 820 490 1072 H230 Q250 820 308 560 Z':'M330 560 H390 Q420 820 430 1072 H295 Q302 820 330 560 Z';
 b+=p(skirt,'#FF8FB8')+p(skirt,'url(#kawung)')+rect(back?234:297,1022,back?252:132,50,'#E0528F');
 for(let x=back?240:300;x<(back?475:420);x+=30)b+=`<polygon points="${x},1066 ${x+15},1030 ${x+30},1066" fill="#F6C343"/>`;
 b+=p(back?'M300 412 H420 L415 565 H305 Z':'M325 412 H380 Q400 470 393 565 H316 Z','#FFB3CF')+rect(back?304:316,550,back?112:77,35,'#F6C343');
 b+=p(back?'M280 420 Q260 500 252 600 H284 L305 430 Z':'M339 420 Q315 490 330 600 H358 L370 432 Z','#FFB3CF')+rect(back?250:330,592,back?36:28,20,'#F6C343')+rect(back?253:333,612,22,58,'#FFE9DA')+ellipse(back?264:344,681,13,17,'#FFE9DA');
 if(back)b+=p('M420 420 Q448 450 470 510 L445 535 L400 450 Z','#FFB3CF')+p('M458 520 L490 435','none')+ellipse(490,428,15,17,'#FFE9DA');
 else b+=p('M380 426 Q405 470 405 520 L380 526 L363 440 Z','#FFB3CF')+rect(381,515,26,16,'#F6C343')+p('M389 530 L410 498 L424 506 L402 545 Z','#FFE9DA')+ellipse(417,503,12,15,'#FFE9DA');
 b+=p(back?'M490 470 L530 300':'M395 670 L425 450','none')+`<path d="${back?'M490 470 L530 300':'M395 670 L425 450'}" stroke="#C9893A" stroke-width="5"/>`+star(back?536:430,back?278:420)+ellipse(back?580:470,back?280:420,4,4,'#FFD84D');
 if(back){b+=p('M290 280 Q266 450 282 600 Q360 630 438 600 Q454 450 430 280 Q360 190 290 280 Z','#1F1A24')+p('M325 285 Q310 460 320 590 M395 285 Q410 460 400 590','none');b+=p('M318 240 L325 214 L360 205 L395 214 L402 240 Z','#F6C343');}
 else {b+=p('M300 250 Q275 450 295 600 H350 L362 290 Z','#1F1A24')+p('M320 245 Q387 220 397 285 L409 317 L425 330 Q430 339 409 344 L403 358 Q391 395 350 388 L329 350 Z','#FFE9DA')+p('M302 300 Q287 221 350 224 Q393 225 398 275 Q367 245 344 282 L325 420 L300 455 Z','#1F1A24')+ellipse(390,315,10,7,'#FFFFFF')+ellipse(394,315,5,6,'#4A2A1A')+p('M379 297 Q390 291 399 297 M380 315 L375 310 M388 363 Q397 369 405 360','none')+p('M330 241 L336 213 L350 229 L367 198 L381 239 Z','#F6C343')+ellipse(366,225,6,7,'#E63973')+ellipse(341,232,4,4,'#3CC5B0');}
 for(const [x,y] of (back?[[422,260],[433,262],[428,272]]:[[313,260],[324,256],[320,271]]))b+=ellipse(x,y,6,6,'#FFFFFF');
 return g(b);
}
for(const id of ids){const {body,defs}=sources[id];
 const side=id==='putri_paramita'?paramita(false):dwarf(id,false),back=id==='putri_paramita'?paramita(true):dwarf(id,true);
 await save(id+'_turnaround',wrap(text(40,50,`${id} — REFERENSI USULAN`,28)+text(40,85,'Profil, belakang, sambungan busana dan orientasi aksesori belum kanon.',20)+[body,side,back].map((b,i)=>`<g transform="translate(${i*500} 100) scale(.69)">${b}</g>`).join('')+text(190,925,'DEPAN (sumber)')+text(675,925,'SAMPING (profil)')+text(1180,925,'BELAKANG')+text(40,980,'Pose depan adalah pose asli; tinggi pada sheet ini bukan penggaris antar karakter.',20),1500,1020,defs),1500,1020);
 // Preserve identity geometry, hair, hats, skin, freckles; replace eyes/brows/mouth, not merely labels.
 const expressions=['Netral','Senang','Terkejut','Khawatir'];
 const panels=expressions.map((name,i)=>{
 let b=body;const human=id==='putri_paramita';
 b=b.replace(/<!-- eyebrows -->[\s\S]*?(?=<!-- (?:cheeks|blush))/,'');
 if(human)b=b.replace(/<!-- nose \+ smile -->[\s\S]*?(?=<\/g>\s*$)/,'');
 else b=b.replace(/<!-- (?:mouth|big grin) -->[\s\S]*?(?=<!-- (?:wave lines|wink sparkle))/,'');
 const cx=360,ey=human?319:540,my=human?363:608,dx=human?25:45,r=human?10:22;
 let f='';
 for(const x of [cx-dx,cx+dx]){
 f+=i===1?p(`M${x-r} ${ey} Q${x} ${ey-20} ${x+r} ${ey}`,'none'):ellipse(x,ey,r,i===2?r*1.35:human?r*.65:r,'#FFFFFF')+ellipse(x,ey+2,r*.5,human?r*.45:r*.65,human?'#4A2A1A':'#2B1D14');
 if(human)f+=p(`M${x-r} ${ey} L${x-r-4} ${ey-4}`,'none');
 f+=p(i===3?`M${x-r} ${ey-30} L${x+r} ${ey-43}`:`M${x-r} ${ey-32} Q${x} ${ey-(i===2?55:42)} ${x+r} ${ey-32}`,'none');
 }
 f+=i===2?ellipse(cx,my,human?10:19,human?14:27,'#8C2F39'):p(i===1?`M${cx-dx} ${my} Q${cx} ${my+40} ${cx+dx} ${my} Z`:i===3?`M${cx-dx*.7} ${my+12} Q${cx} ${my-15} ${cx+dx*.7} ${my+12}`:`M${cx-dx*.7} ${my} Q${cx} ${my+9} ${cx+dx*.7} ${my}`,i===1?'#8C2F39':'none');
 if(human)f+=p('M356 345 Q360 350 365 345','none');
 b=b.replace(/<\/g>\s*$/,g(f).replace('stroke-width="6"',`stroke-width="${human?2:4}"`)+'</g>');
 const view=human?'260 180 200 230':'180 90 380 590';
 return `<svg x="${i*380+25}" y="110" width="340" height="440" viewBox="${view}">${b}</svg>`+text(i*380+110,600,name);
 });
 await save(id+'_expressions',wrap(text(30,45,`${id} — EKSPRESI USULAN`,28)+text(30,80,'Variasi wajah untuk produksi; bukan perubahan identitas kanon.',20)+panels.join(''),1540,650,defs),1540,650);
}
// Canonical scale, crown-to-feet landmarks taken from source geometry, hats excluded.
let lineup=text(30,45,'Skala kanon: 4 px/cm; topi dan mahkota tidak dihitung',25);
for(const [id,x,height,crown,foot] of [['puci',150,105,395,1112],['putri_paramita',410,165,224,1101],['kuci',820,100,400,1112]]){
 const s=height*4/(foot-crown),y=1050-foot*s;
 lineup+=`<g transform="translate(${x-360*s} ${y}) scale(${s})">${sources[id].body}</g>`;
 lineup+=`<path d="M${x-65} ${1050-height*4} H${x+65}" stroke="#D0335F" stroke-width="3" stroke-dasharray="7 5"/>`+text(x-60,1110,`${id}: ${height} cm`,20);
}
lineup+='<path d="M0 1050 H1080" stroke="#3B2A20" stroke-width="3"/>';
await save('lineup_canonical',wrap(lineup,1080,1200,sources.putri_paramita.defs),1080,1200);
const edge=process.env.EDGE_PATH||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>{try{return execFileSync('node',['-e',`process.exit(require('fs').existsSync(${JSON.stringify(p)})?0:1)`]),true}catch{return false}});
if(!edge)throw Error('Set EDGE_PATH to an installed Edge/Chrome executable.');
const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'character-kit-'));
try{
 const html=`<!doctype html><meta charset="utf-8"><pre id="result">WAIT</pre><script>const jobs=${JSON.stringify(jobs)};Promise.all(jobs.map(j=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=j.w;c.height=j.h;c.getContext('2d').drawImage(im,0,0,j.w,j.h);resolve({name:j.name,png:c.toDataURL('image/png').split(',')[1]})};im.onerror=()=>reject(Error(j.name));im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(j.svg)}))).then(r=>document.getElementById('result').textContent=JSON.stringify(r)).catch(e=>document.getElementById('result').textContent='ERROR '+e.message)</script>`;
 const input=path.join(tmp,'render.html');await fs.writeFile(input,html);
 const run=spawnSync(edge,['--headless=new','--disable-gpu',`--user-data-dir=${path.join(tmp,'profile')}`,'--no-first-run','--dump-dom','--virtual-time-budget=10000',pathToFileURL(input).href],{maxBuffer:100*1024*1024,timeout:120000});
 const dom=run.stdout?.toString()||'';
 if(!dom)throw Error('Browser returned no DOM: '+run.stderr?.toString()+' '+run.error);
 const match=dom.match(/<pre id="result">([\s\S]*?)<\/pre>/);if(!match)throw Error('No browser rendering result: '+dom.slice(0,1500));
 const rendered=JSON.parse(match[1]);if(rendered.length!==jobs.length)throw Error('Incomplete render');
 const report=[];
 for(const r of rendered){const buf=Buffer.from(r.png,'base64'),job=jobs.find(j=>j.name===r.name);const stats=validatePNG(buf,job);await fs.writeFile(path.join(root,'karakter/png',r.name+'.png'),buf);report.push({file:`karakter/png/${r.name}.png`,...stats});}
 const after=await hashes();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Original changed');
 await fs.writeFile(path.join(root,'karakter/build-validation.json'),JSON.stringify({renderer:path.basename(edge),originalsUnchanged:true,originalSHA256:before,assets:report},null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}finally{await fs.rm(tmp,{recursive:true,force:true});}
function validatePNG(buf,job){
 if(buf.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid PNG');
 const w=buf.readUInt32BE(16),h=buf.readUInt32BE(20),depth=buf[24],type=buf[25];
 if(w!==job.w||h!==job.h||depth!==8||type!==6||buf[28]!==0)throw Error('Unexpected RGBA PNG format '+job.name);
 const chunks=[];for(let o=8;o<buf.length;){const n=buf.readUInt32BE(o),t=buf.toString('ascii',o+4,o+8);if(t==='IDAT')chunks.push(buf.subarray(o+8,o+8+n));o+=n+12;}
 const raw=inflateSync(Buffer.concat(chunks)),stride=w*4;let prev=Buffer.alloc(stride),zero=0,opaque=0,partial=0;const corners=[];
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c};
 for(let y=0;y<h;y++){const o=y*(stride+1),filter=raw[o],row=Buffer.alloc(stride);if(filter>4)throw Error('PNG filter');for(let i=0;i<stride;i++){const a=i>=4?row[i-4]:0,b=prev[i],c=i>=4?prev[i-4]:0;row[i]=(raw[o+1+i]+(filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):paeth(a,b,c)))&255;}for(let x=0;x<w;x++){const a=row[x*4+3];if(!a)zero++;else if(a===255)opaque++;else partial++;if((y===0||y===h-1)&&(x===0||x===w-1))corners.push(a);}prev=row;}
 if(!opaque||!zero||(job.transparent&&corners.some(a=>a!==0)))throw Error('Alpha validation failed '+job.name);
 return {width:w,height:h,colorType:'RGBA8',transparentPixels:zero,opaquePixels:opaque,partialAlphaPixels:partial,cornerAlpha:corners};
}
