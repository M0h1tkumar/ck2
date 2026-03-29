import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const embedded=new URLSearchParams(window.location.search).get('embedded')==='1';
const forcedDistrictView=new URLSearchParams(window.location.search).get('districtView');
if(embedded)document.documentElement.classList.add('embedded');
const root=document.documentElement;
const deviceMemory=navigator.deviceMemory||4;
function getViewport(){
  const vv=window.visualViewport;
  return {width:vv?.width||window.innerWidth,height:vv?.height||window.innerHeight};
}
function syncViewport(){
  const {width,height}=getViewport();
  root.style.setProperty('--app-width',width+'px');
  root.style.setProperty('--app-height',height+'px');
}
syncViewport();

const isLow=navigator.hardwareConcurrency<=4||/Android|iPhone|iPad/i.test(navigator.userAgent);
const isMid=!isLow&&(navigator.hardwareConcurrency<=8||deviceMemory<=8);
const Q=isLow
  ?{pxr:1,shd:512,seg:48,par:180,tSeg:34,wM:.45,decorEvery:3,particleEvery:4}
  :isMid
    ?{pxr:Math.min(devicePixelRatio,1.25),shd:1024,seg:64,par:300,tSeg:48,wM:.8,decorEvery:2,particleEvery:3}
    :{pxr:Math.min(devicePixelRatio,1.5),shd:1024,seg:72,par:400,tSeg:56,wM:1,decorEvery:2,particleEvery:2};

const ST={OV:'ov',ZM:'zm',CTR:'ctr',FLY:'fly',PNL:'pnl',INTRO:'intro'};
let state=ST.INTRO;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x000000);
scene.fog=new THREE.FogExp2(0x000000,.012);
const initialViewport=getViewport();
const camera=new THREE.PerspectiveCamera(50,initialViewport.width/initialViewport.height,.1,200);
camera.position.set(0,28,0.01);
const renderer=new THREE.WebGLRenderer({antialias:!isLow,powerPreference:'high-performance'});
renderer.setSize(initialViewport.width,initialViewport.height);renderer.setPixelRatio(Q.pxr);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
document.body.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.06;controls.maxPolarAngle=Math.PI*.48;controls.minDistance=5;controls.maxDistance=40;
controls.enableZoom=false;
controls.enabled=false;

// TEXTURES
const txSz=isLow?256:512;
function mkTex(fn){const c=document.createElement('canvas');c.width=c.height=txSz;const ctx=c.getContext('2d'),img=ctx.createImageData(txSz,txSz);fn(img.data,txSz);ctx.putImageData(img,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const diffTex=mkTex((d,sz)=>{for(let i=0;i<d.length;i+=4){const px=(i/4)%sz,py=((i/4)/sz)|0;const n=(Math.sin(px*.05)*Math.cos(py*.05)*.5+.5)*.4+(Math.sin(px*.13+py*.07)*.3+.5)*.35+(Math.sin((px+py)*.02)*.2+.5)*.25;const cr=Math.abs(Math.sin(px*.3+py*.1)*Math.cos(px*.1-py*.2))>.92?-40:0;const v=n*60+cr;d[i]=Math.max(0,Math.min(255,180+v));d[i+1]=Math.max(0,Math.min(255,150+v));d[i+2]=Math.max(0,Math.min(255,65+v));d[i+3]=255}});
const normTex=mkTex((d,sz)=>{for(let i=0;i<d.length;i+=4){const px=(i/4)%sz,py=((i/4)/sz)|0;d[i]=Math.sin(px*.08+py*.03)*127+128;d[i+1]=Math.cos(px*.03+py*.08)*127+128;d[i+2]=255;d[i+3]=255}});

// DISTRICT COLORS
const BASE=new THREE.Color(0xC2A14A);
const TINT={north:new THREE.Color(0xA8C070),east:new THREE.Color(0xD08030),south:new THREE.Color(0x987040),west:new THREE.Color(0x5898A0)};

function whichDist(a){let n=((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);if(n>Math.PI)n-=Math.PI*2;if(n>=-Math.PI/4&&n<Math.PI/4)return'east';if(n>=Math.PI/4&&n<Math.PI*3/4)return'south';if(n>=-Math.PI*3/4&&n<-Math.PI/4)return'north';return'west'}
function distMat(angle,shift){const t=TINT[whichDist(angle)];const c=BASE.clone().lerp(t,.3);if(shift)c.offsetHSL(0,0,shift);return new THREE.MeshStandardMaterial({color:c,map:diffTex,normalMap:normTex,roughness:.75,metalness:.15,normalScale:new THREE.Vector2(.8,.8),side:THREE.DoubleSide})}

// FORMATION
const formation=new THREE.Group();
formation.scale.setScalar(0.15);
scene.add(formation);
const LC=7,SP=1.8,rings=[];

function buildRing(radius,tubeR,idx){
  const grp=new THREE.Group();
  const arcs=[{start:-Math.PI/4,name:'east'},{start:Math.PI/4,name:'south'},{start:Math.PI*3/4,name:'west'},{start:-Math.PI*3/4,name:'north'}];
  const span=Math.PI/2,gap=.08;
  arcs.forEach(arc=>{const pts=[],segs=Math.floor(Q.seg/4);for(let i=0;i<=segs;i++){const t=i/segs;const a=arc.start+(gap+t*(1-2*gap))*span;const s=Math.sin(a*1.2+idx)*.15;pts.push(new THREE.Vector3(Math.cos(a)*(radius+s),idx*.22+Math.sin(a*2+idx)*.08,Math.sin(a)*(radius+s)))}if(pts.length<4)return;const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,false),Math.floor(Q.tSeg/4),tubeR,8,false);const m=new THREE.Mesh(geo,distMat(arc.start+span/2,(idx/LC)*.06-.03));m.castShadow=m.receiveShadow=true;grp.add(m)});
  return grp;
}
function buildWalls(radius,idx){const g=new THREE.Group(),cnt=Math.floor((8+idx*2)*Q.wM);for(let w=0;w<cnt;w++){const a=(w/cnt)*Math.PI*2+idx*.3;const h=.3+Math.random()*.25,ww=.08+Math.random()*.04;const m=new THREE.Mesh(new THREE.BoxGeometry(ww,h,.6),distMat(a,(Math.random()-.5)*.04));m.position.set(Math.cos(a)*radius,idx*.22+h*.5,Math.sin(a)*radius);m.rotation.y=a+Math.PI*.5;m.castShadow=true;g.add(m)}return g}

for(let i=0;i<LC;i++){const r=(i+1)*SP,g=new THREE.Group();g.add(buildRing(r,.12+i*.02,i));g.add(buildWalls(r,i));formation.add(g);rings.push(g)}

// District markers
const markers=new THREE.Group();
[{name:'north',angle:-Math.PI/2,tint:TINT.north},{name:'east',angle:0,tint:TINT.east},{name:'south',angle:Math.PI/2,tint:TINT.south},{name:'west',angle:Math.PI,tint:TINT.west}].forEach(d=>{
  const outerR=LC*SP;
  [-1,1].forEach(side=>{const a=d.angle+side*.14;const pH=1.8;const m=new THREE.Mesh(new THREE.CylinderGeometry(.09,.13,pH,8),new THREE.MeshStandardMaterial({color:BASE.clone().lerp(d.tint,.5),roughness:.55,metalness:.3,map:diffTex,normalMap:normTex}));m.position.set(Math.cos(a)*outerR,(LC-1)*.22+pH*.5,Math.sin(a)*outerR);m.castShadow=true;markers.add(m);const cap=new THREE.Mesh(new THREE.SphereGeometry(.1,8,8),new THREE.MeshStandardMaterial({color:d.tint,emissive:d.tint,emissiveIntensity:.4,roughness:.3}));cap.position.set(Math.cos(a)*outerR,(LC-1)*.22+pH+.05,Math.sin(a)*outerR);markers.add(cap)});
  const midR=Math.floor(LC*.55)*SP;const orb=new THREE.Mesh(new THREE.SphereGeometry(.2,12,12),new THREE.MeshStandardMaterial({color:d.tint,emissive:d.tint,emissiveIntensity:.5,roughness:.3,metalness:.4}));orb.position.set(Math.cos(d.angle)*midR,Math.floor(LC*.55)*.22+.5,Math.sin(d.angle)*midR);orb.name='orb_'+d.name;markers.add(orb);const pl=new THREE.PointLight(d.tint.getHex(),.4,6);pl.position.copy(orb.position);markers.add(pl);
});
formation.add(markers);

// CORE
const core=new THREE.Group();
core.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.08,Q.seg),new THREE.MeshStandardMaterial({color:0xD4AF37,roughness:.4,metalness:.6,map:diffTex,normalMap:normTex})),{castShadow:true}));
const hub=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.2,24),new THREE.MeshStandardMaterial({color:0xB8860B,roughness:.5,metalness:.5,map:diffTex,normalMap:normTex}));hub.castShadow=true;hub.position.y=.06;core.add(hub);
for(let i=0;i<24;i++){const a=(i/24)*Math.PI*2,isL=i%3===0,len=isL?.9:.55,w=isL?.08:.05;const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(w,0);sh.lineTo(w*.15,len);sh.lineTo(-w*.15,len);sh.lineTo(-w,0);sh.closePath();const geo=new THREE.ExtrudeGeometry(sh,{depth:.04,bevelEnabled:true,bevelThickness:.01,bevelSize:.01,bevelSegments:1});const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:isL?0xDAA520:0xC2A14A,roughness:.45,metalness:.55}));m.position.set(Math.cos(a)*1.15,-.02,Math.sin(a)*1.15);m.rotation.set(-Math.PI/2,0,-a+Math.PI/2);m.castShadow=true;core.add(m)}
const rPts=[];for(let i=0;i<=Q.seg;i++){const a=(i/Q.seg)*Math.PI*2,s=1+Math.sin(i*12)*.06+Math.sin(i*6)*.03;rPts.push(new THREE.Vector3(Math.cos(a)*1.9*s,0,Math.sin(a)*1.9*s))}
core.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rPts,true),Q.seg,.04,6,true),new THREE.MeshStandardMaterial({color:0xC2A14A,roughness:.35,metalness:.65,emissive:0xC2A14A,emissiveIntensity:.2})));
const gl1=new THREE.Mesh(new THREE.TorusGeometry(2,.15,12,Q.seg),new THREE.MeshBasicMaterial({color:0xC2A14A,transparent:true,opacity:.12}));gl1.rotation.x=Math.PI/2;gl1.name='gl1';core.add(gl1);
const gl2=new THREE.Mesh(new THREE.TorusGeometry(2.2,.3,12,Q.seg),new THREE.MeshBasicMaterial({color:0xD4A030,transparent:true,opacity:.06}));gl2.rotation.x=Math.PI/2;gl2.name='gl2';core.add(gl2);
for(let r=0;r<3;r++){const m=new THREE.Mesh(new THREE.TorusGeometry(.5+r*.3,.012,6,48),new THREE.MeshStandardMaterial({color:0xAA8830,roughness:.6,metalness:.4}));m.rotation.x=Math.PI/2;m.position.y=.05;core.add(m)}
core.position.y=.5;formation.add(core);

// PARTICLES
const pN=Q.par,pGeo=new THREE.BufferGeometry(),pP=new Float32Array(pN*3),pSp=new Float32Array(pN);
for(let i=0;i<pN;i++){const a=Math.random()*Math.PI*2,r=1+Math.random()*(LC*SP+2);pP[i*3]=Math.cos(a)*r;pP[i*3+1]=Math.random()*3-.5;pP[i*3+2]=Math.sin(a)*r;pSp[i]=.2+Math.random()*.8}
pGeo.setAttribute('position',new THREE.BufferAttribute(pP,3));pGeo.setAttribute('aSpd',new THREE.BufferAttribute(pSp,1));
const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xC2A14A,size:.06,transparent:true,opacity:.4,sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(particles);

// GROUND + LIGHTS
scene.add(new THREE.AmbientLight(0x8B7355,.5));
const sun=new THREE.DirectionalLight(0xFFF5E0,1.5);sun.position.set(10,15,8);sun.castShadow=true;sun.shadow.mapSize.set(Q.shd,Q.shd);sun.shadow.camera.near=1;sun.shadow.camera.far=50;sun.shadow.camera.left=sun.shadow.camera.bottom=-20;sun.shadow.camera.right=sun.shadow.camera.top=20;sun.shadow.bias=-.001;scene.add(sun);
scene.add(new THREE.DirectionalLight(0xD4A060,.4).translateX(-8).translateY(5).translateZ(-6));
const rimLt=new THREE.PointLight(0xC2A14A,.8,30);rimLt.position.set(0,8,0);scene.add(rimLt);
const coreLt=new THREE.PointLight(0xD4AF37,.6,8);coreLt.position.set(0,1.5,0);scene.add(coreLt);

// CAMERA ANIM
let camAnim=null;
function easeIO(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function flyCamera(to,tgt,dur,done){camAnim={fp:camera.position.clone(),tp:new THREE.Vector3(...to),ft:controls.target.clone(),tt:new THREE.Vector3(...tgt),s:performance.now(),d:dur*1000,cb:done};controls.enabled=false}
function flyMulti(steps,done){let i=0;(function nx(){if(i>=steps.length){if(done)done();return}const s=steps[i++];flyCamera(s.pos,s.tgt,s.dur,nx)})()}
function updateCam(){if(!camAnim)return;const t=Math.min(1,(performance.now()-camAnim.s)/camAnim.d),e=easeIO(t);camera.position.lerpVectors(camAnim.fp,camAnim.tp,e);controls.target.lerpVectors(camAnim.ft,camAnim.tt,e);if(t>=1){const cb=camAnim.cb;camAnim=null;if(cb)cb()}}

// POSITIONS
const OV_POS=[14,11,16],OV_TGT=[0,.5,0];
const CTR_POS=[0,3.2,.01],CTR_TGT=[0,.5,0];
const dR=LC*SP*.6,dCamR=LC*SP+2.5,dH=3;
const DIR_VEC={north:[0,0,-1],east:[1,0,0],south:[0,0,1],west:[-1,0,0]};
const DCAM={
  north:{pos:[0,dH,-dCamR],tgt:[0,1,-dR]},
  east:{pos:[dCamR,dH,0],tgt:[dR,1,0]},
  south:{pos:[0,dH,dCamR],tgt:[0,1,dR]},
  west:{pos:[-dCamR,dH,0],tgt:[-dR,1,0]},
};
const DISTRICT_PAGE_VERSION='20260329-fire-mobile-bottom-left-1';

function districtPageUrl(name){
  const mobileView=forcedDistrictView==='mobile'
    ? true
    : forcedDistrictView==='desktop'
      ? false
      : window.innerWidth<=900;
  return `/${name}/${mobileView?'mobile.html':'index.html'}?v=${DISTRICT_PAGE_VERSION}`;
}

const DISTRICT_ASSETS={
  fire:['/fire/character.webp'],
  water:['/water/character.webp'],
  earth:['/earth/character.webp','/earth/clubs.json']
};
let districtAssetsPrefetched=false;
function preloadDistrictAssets(){
  if(districtAssetsPrefetched)return;
  districtAssetsPrefetched=true;
  ['fire','water','earth'].forEach(name=>{
    fetch(districtPageUrl(name),{priority:'low'}).catch(()=>{});
    DISTRICT_ASSETS[name].forEach(asset=>{
      if(asset.endsWith('.webp')||asset.endsWith('.png')||asset.endsWith('.jpg')||asset.endsWith('.jpeg')||asset.endsWith('.gif')){
        const img=new Image();
        img.decoding='async';
        img.src=asset;
      }else{
        fetch(asset,{priority:'low'}).catch(()=>{});
      }
    });
  });
}

function clearDistrictButtonState(){
  document.querySelectorAll('.d-btn').forEach(btn=>btn.classList.remove('is-activating','is-dimmed'));
}

function ensureFrameSource(frameId,name){
  const frame=document.getElementById(frameId);
  if(!frame)return;
  const targetUrl=districtPageUrl(name);
  if(frame.src!==new URL(targetUrl,window.location.href).href){
    frame.src=targetUrl;
  }
}

function closeToOverview(){
  document.querySelectorAll('.cpanel.show').forEach(p=>p.classList.remove('show'));
  const fireFrame=document.getElementById('fire-frame');if(fireFrame)fireFrame.src='';
  const waterFrame=document.getElementById('water-frame');if(waterFrame)waterFrame.src='';
  const earthFrame=document.getElementById('earth-frame');if(earthFrame)earthFrame.src='';
  clearDistrictButtonState();
  $dirNav.classList.remove('show');$back.classList.remove('show');$choicePrompt.classList.remove('show');$enter.classList.remove('show');$enter.classList.add('hide');state=ST.ZM;
  flyCamera(OV_POS,OV_TGT,2,()=>{state=ST.OV;controls.enabled=true;$enter.classList.remove('hide');$enter.classList.add('show');sizeButton()});
}

// DYNAMIC BUTTON SIZING
const $enterBtn=document.getElementById('enter-btn');
function sizeButton(){
  const viewport=getViewport();
  const coreWorldR=2.4;
  const v=new THREE.Vector3(coreWorldR,0.5,0);
  v.project(camera);
  const cx=new THREE.Vector3(0,0.5,0);
  cx.project(camera);
  const screenR=Math.abs(v.x-cx.x)*viewport.width/2;
  const isTouchViewport=viewport.width<=768;
  const minSize=isTouchViewport?56:36;
  const maxSize=isTouchViewport?88:100;
  const scale=isTouchViewport?0.62:0.7;
  const sz=Math.max(minSize,Math.min(screenR*scale,maxSize));
  $enterBtn.style.width=sz+'px';
  $enterBtn.style.height=sz+'px';
}

// NAV
const $enter=document.getElementById('center-btn');
const $dirNav=document.getElementById('dir-nav');
const $back=document.getElementById('back-btn');
const $hdr=document.getElementById('hdr');
const $choicePrompt=document.getElementById('choice-prompt');

document.getElementById('enter-btn').addEventListener('click',()=>{
  if(state!==ST.OV)return;state=ST.ZM;$enter.classList.add('hide');
  flyCamera(CTR_POS,CTR_TGT,2,()=>{state=ST.CTR;$dirNav.classList.add('show');$back.classList.add('show');$choicePrompt.classList.add('show')});
});

document.querySelectorAll('.d-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(state!==ST.CTR)return;
    const dir=btn.dataset.dir,sec=btn.dataset.section,dc=DCAM[dir];
    clearDistrictButtonState();
    btn.classList.add('is-activating');
    document.querySelectorAll('.d-btn').forEach(other=>{if(other!==btn)other.classList.add('is-dimmed')});
    if(!dc)return;state=ST.FLY;$dirNav.classList.remove('show');$choicePrompt.classList.remove('show');
    const dv=DIR_VEC[dir];
    const pullPos=[dv[0]*3, 7, dv[2]*3];
    const pullTgt=[dv[0]*2, .5, dv[2]*2];
    flyMulti([
      {pos:pullPos,tgt:pullTgt,dur:.8},
      {pos:dc.pos,tgt:dc.tgt,dur:1.2},
    ],()=>{state=ST.PNL;const p=document.getElementById('panel-'+sec);if(p){p.classList.add('show');if(sec==='events')ensureFrameSource('fire-frame','fire');if(sec==='register')ensureFrameSource('water-frame','water');if(sec==='clubs')ensureFrameSource('earth-frame','earth');}});
  });
});

$back.addEventListener('click',()=>{
  if(state===ST.CTR){
    clearDistrictButtonState();
    $dirNav.classList.remove('show');$back.classList.remove('show');$choicePrompt.classList.remove('show');$enter.classList.remove('show');$enter.classList.add('hide');state=ST.ZM;
    flyCamera(OV_POS,OV_TGT,1.6,()=>{state=ST.OV;controls.enabled=true;$enter.classList.remove('hide');$enter.classList.add('show');sizeButton()});
    return;
  }
  if(state!==ST.PNL)return;
  const panel=document.querySelector('.cpanel.show');
  if(panel){
    panel.classList.remove('show');
    if(panel.id==='panel-events'){const fr=document.getElementById('fire-frame');if(fr)fr.src='';}
    if(panel.id==='panel-register'){const fr=document.getElementById('water-frame');if(fr)fr.src='';}
    if(panel.id==='panel-clubs'){const fr=document.getElementById('earth-frame');if(fr)fr.src='';}
  }
  state=ST.FLY;
  flyCamera(CTR_POS,CTR_TGT,1.4,()=>{state=ST.CTR;clearDistrictButtonState();$dirNav.classList.add('show');$back.classList.add('show');$choicePrompt.classList.add('show')});
});

document.querySelectorAll('.cp-close').forEach(btn=>{
  btn.addEventListener('click',()=>{
    closeToOverview();
  });
});

// INTRO ANIMATION
let introStartTime=null;
const INTRO_DUR=1.8;
const INTRO_CAM_FROM=[0,28,0.01];
const INTRO_CAM_TO=OV_POS;
function startIntro(){
  state=ST.INTRO;
  introStartTime=performance.now();
  controls.target.set(0,.5,0);
  $enter.classList.remove('show');
  $enter.classList.remove('hide');
}

function updateIntro(){
  if(state!==ST.INTRO||!introStartTime)return;
  const elapsed=(performance.now()-introStartTime)/1000;
  const t=Math.min(1,elapsed/INTRO_DUR);
  const e=easeIO(t);
  const s=0.15+(1-0.15)*e;
  formation.scale.setScalar(s*(1+Math.sin(elapsed*1.5)*.02));
  camera.position.set(
    INTRO_CAM_FROM[0]+(INTRO_CAM_TO[0]-INTRO_CAM_FROM[0])*e,
    INTRO_CAM_FROM[1]+(INTRO_CAM_TO[1]-INTRO_CAM_FROM[1])*e,
    INTRO_CAM_FROM[2]+(INTRO_CAM_TO[2]-INTRO_CAM_FROM[2])*e
  );
  controls.target.set(0,.5,0);
  if(t>=1){
    state=ST.OV;
    controls.enabled=true;
    formation.scale.setScalar(1);
    $enter.classList.remove('hide');
    $enter.classList.add('show');
    sizeButton();
    if('requestIdleCallback' in window){
      window.requestIdleCallback(()=>preloadDistrictAssets(),{timeout:1800});
    }else{
      setTimeout(preloadDistrictAssets,1200);
    }
  }
}

// ENHANCED GLOBAL SPARKLE SYSTEM (Mouse & Touch)
const SPARK_COLORS=['#FFFFFF','#C2A14A','#FFF9E3','#E2C56A'];
let lastSpark=0;
function createSpark(x,y){
  const now=Date.now();
  if(now-lastSpark<(isLow?40:28))return;
  lastSpark=now;
  for(let i=0;i<(isLow?1:2);i++){
    const s=document.createElement('span');s.className='sparkle';
    const size=Math.random()*3+2.5;s.style.width=s.style.height=size+'px';
    const col=SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)];
    s.style.background=col;s.style.color=col;
    s.style.left=x+'px';s.style.top=y+'px';
    const ang=Math.random()*Math.PI*2, dist=18+Math.random()*28;
    s.style.setProperty('--dx',(Math.cos(ang)*dist*.35)+'px');
    s.style.setProperty('--dy',((Math.sin(ang)*dist*.35)-15)+'px');
    s.style.setProperty('--dx2',(Math.cos(ang)*dist)+'px');
    s.style.setProperty('--dy2',((Math.sin(ang)*dist)-25)+'px');
    document.body.appendChild(s);setTimeout(()=>s.remove(),900);
  }
}
window.addEventListener('mousemove',e=>createSpark(e.clientX,e.clientY));
window.addEventListener('touchmove',e=>{if(e.touches[0])createSpark(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});

// LOOP
const clock=new THREE.Clock();let fc=0;
function animate(){
  requestAnimationFrame(animate);
  const dt=clock.getDelta(),t=clock.getElapsedTime();fc++;
  updateIntro();
  rings.forEach((ring,i)=>{ring.rotation.y+=dt*(1+(LC-i)*.15)*.3*(i%2===0?1:-1)});
  core.rotation.y+=dt*2.5;
  if(state!==ST.INTRO)formation.scale.setScalar(1+Math.sin(t*1.5)*.03);
  if(fc%Q.decorEvery===0){
    core.traverse(c=>{
      if(c.name==='gl1')c.material.opacity=.08+Math.sin(t*3)*.06;
      if(c.name==='gl2')c.material.opacity=.04+Math.sin(t*2+1)*.04;
      if(c.material?.emissiveIntensity!==undefined&&!c.name.startsWith('gl'))c.material.emissiveIntensity=.15+Math.sin(t*4)*.1;
    });
    coreLt.intensity=.5+Math.sin(t*3)*.3;
    markers.traverse(c=>{if(c.name?.startsWith('orb_'))c.material.emissiveIntensity=.35+Math.sin(t*2.5+c.position.x)*.25});
  }
  if(fc%Q.particleEvery===0){
    const pos=particles.geometry.attributes.position,spd=particles.geometry.attributes.aSpd;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),r=Math.sqrt(x*x+z*z),a=Math.atan2(z,x)+dt*spd.getX(i)*.3;pos.setXY(i,Math.cos(a)*r,pos.getY(i)+Math.sin(t+i)*.002);pos.setZ(i,Math.sin(a)*r)}pos.needsUpdate=true;
  }
  if(state===ST.OV&&fc%10===0)sizeButton();
  updateCam();controls.update();renderer.render(scene,camera);
}
animate();

// LOADER
const loader=document.getElementById('loader');
const loaderVideo=document.getElementById('loader-video');
const bar=document.getElementById('ld-fill');
let loaderFinished=false;

function finishLoader(){
  if(loaderFinished||!loader)return;
  loaderFinished=true;
  if(bar)bar.style.width='100%';
  startIntro();
  requestAnimationFrame(()=>loader.classList.add('done'));
  if(!embedded)$hdr.classList.add('show');
  setTimeout(()=>{loader.remove();},1200);
}

if(loaderVideo){
  const syncLoaderProgress=()=>{
    if(loaderFinished)return;
    const duration=loaderVideo.duration;
    if(Number.isFinite(duration)&&duration>0){
      if(duration-loaderVideo.currentTime<=0.6){
        finishLoader();
        return;
      }
    }
    if(bar&&Number.isFinite(duration)&&duration>0){
      const progress=Math.min(100,(loaderVideo.currentTime/duration)*100);
      bar.style.width=progress+'%';
    }
  };

  loaderVideo.addEventListener('loadedmetadata',syncLoaderProgress);
  loaderVideo.addEventListener('timeupdate',syncLoaderProgress);
  loaderVideo.addEventListener('ended',finishLoader,{once:true});
  loaderVideo.addEventListener('error',finishLoader,{once:true});

  const playPromise=loaderVideo.play();
  if(playPromise&&typeof playPromise.catch==='function'){
    playPromise.catch(()=>finishLoader());
  }

  setTimeout(()=>{
    if(!loaderFinished&&loaderVideo.readyState<2)finishLoader();
  },5000);
}else{
  finishLoader();
}

function handleViewportResize(){
  syncViewport();
  const {width,height}=getViewport();
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  renderer.setSize(width,height);
  if(state===ST.OV)sizeButton();
}
window.addEventListener('resize',handleViewportResize);
window.visualViewport?.addEventListener('resize',handleViewportResize);
