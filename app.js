const NUMBERS={'kaohsiung-playmore':1,'taichung-wuquan':7,'taoyuan-yaxin':12,'zhongyi-office':16,'linkou-weige':17,'tianmu-ye':22,'muzha-yuanli':24,'jingumae-507':25,'olivia-cafe':26};
const state={projects:[],gallery:null,index:0,opener:null,lastHash:''};
const view=document.querySelector('#view');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const pad=n=>String(n).padStart(2,'0');

async function init(){
  const response=await fetch('projects.json');
  if(!response.ok)throw new Error('作品資料載入失敗');
  state.projects=(await response.json()).sort((a,b)=>a.slug==='tianmu-ye'?-1:b.slug==='tianmu-ye'?1:NUMBERS[b.slug]-NUMBERS[a.slug]);
  document.querySelector('#year').textContent=new Date().getFullYear();
  addEventListener('hashchange',render);
  bindLightbox();bindImageProtection();render();
}

function bindImageProtection(){
  document.addEventListener('contextmenu',e=>{if(e.target.closest('img'))e.preventDefault()});
  document.addEventListener('dragstart',e=>{if(e.target.closest('img'))e.preventDefault()});
}
function route(){const h=decodeURIComponent(location.hash||'#projects');if(h==='#resume')return{page:'resume'};if(h.startsWith('#project/'))return{page:'project',slug:h.slice(9)};return{page:'projects'}}
function setChrome(page){document.body.dataset.page=page;document.querySelector('.site-header').hidden=page==='project';document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function render(){
  closeLightbox();const r=route();setChrome(r.page);view.classList.remove('view-ready');
  if(r.page==='resume')renderResume();else if(r.page==='project')renderProject(r.slug);else renderProjects();
  scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>{view.classList.add('view-ready');view.focus({preventScroll:true})});state.lastHash=location.hash;
}

function renderProjects(){
  document.title='古捷宇｜Interior Design Portfolio';
  const first=state.projects[0].images[0];
  view.innerHTML=`<section class="work-intro" aria-labelledby="work-title"><p class="kicker">JIE-YU GU · SELECTED WORKS</p><h1 id="work-title">Interior<br>Design <span>Index</span></h1><p>住宅、商業與工作場域。從空間規劃、材質整合到現場執行，以影像建立每個案場的閱讀節奏。</p></section>
  <section class="work-index" aria-label="案例目錄"><div class="index-preview" aria-hidden="true"><img src="${first.src}" width="${first.width}" height="${first.height}" alt=""></div><ol>${state.projects.map((p,i)=>projectRow(p,i)).join('')}</ol></section>`;
  const preview=view.querySelector('.index-preview img');
  view.querySelectorAll('.project-row a').forEach(link=>{
    const activate=()=>{const p=state.projects.find(x=>x.slug===link.dataset.slug);preview.classList.remove('shown');setTimeout(()=>{preview.src=p.images[0].src;preview.classList.add('shown')},90);view.querySelector('.work-index').dataset.active=link.dataset.slug};
    link.addEventListener('pointerenter',activate);link.addEventListener('focus',activate);
  });
  preview.classList.add('shown');
}
function projectRow(p,i){return `<li class="project-row" style="--i:${i}"><a href="#project/${p.slug}" data-slug="${p.slug}"><span class="project-no">${pad(NUMBERS[p.slug])}</span><span class="project-name">${esc(p.title)}<small>${esc(p.en)}</small></span><span class="project-type">${esc(p.category)}<small>${esc(p.status)}</small></span><span class="open-mark" aria-hidden="true">↗</span></a></li>`}

function renderResume(){
  document.title='Resume｜古捷宇';
  const sections=[
    ['001','PROFILE',`<p class="resume-lead">橫跨室內、產品與視覺編排的設計工作者。具住宅空間規劃、工程協調、材質整合與現場執行經驗，關注空間秩序、細節可施工性與整體完成度。</p><p>實踐大學 工業產品設計系</p>`],
    ['002','EXPERIENCE',`<ul class="data-list"><li><strong>樺品生活時尚股份有限公司</strong><span>室內設計師</span></li><li><strong>發發設計有限公司</strong><span>產品設計師</span></li><li><strong>中國網龍網絡有限公司</strong><span>工業設計實習生</span></li><li><strong>三點水文化創意</strong><span>實習生</span></li></ul>`],
    ['003','EXPERTISE',tagList(['室內設計','案場監工','產品設計','編排設計','攝影'])],
    ['004','LANGUAGES',tagList(['國語','台語','英語'])],
    ['005','SOFTWARE',tagList(['SketchUp','Enscape','AutoCAD','Layout','Photoshop','Illustrator','Codex','Claude Code'])],
    ['006','AWARDS',`<ul class="data-list"><li><strong>2018 臺北設計獎</strong><span>金獎</span></li><li><strong>2018 臺灣國際學生創意大賽</strong><span>金獎</span></li><li><strong>2018 金點新秀設計獎</strong><span>入圍</span></li><li><strong>2014 行動電源裝置創意設計競賽</strong><span>參賽紀錄</span></li></ul>`],
    ['007','CONTACT',`<ul class="data-list contact-list"><li><strong>Email</strong><span>請替換</span></li><li><strong>Phone</strong><span>請替換</span></li><li><strong>Social</strong><span>請替換</span></li></ul>`]
  ];
  view.innerHTML=`<div class="resume-dossier"><aside class="resume-identity"><p class="kicker">DESIGNER · TAIWAN</p><h1>古捷宇<span>JIE-YU<br>GU</span></h1><figure><img src="assets/profile.jpg" width="772" height="1161" alt="古捷宇個人肖像"></figure><p>Interior Design<br>Site Supervision<br>Visual Communication</p></aside><div class="resume-sections">${sections.map(s=>`<section class="resume-section" aria-labelledby="s${s[0]}"><div class="section-number">${s[0]}</div><div><p class="section-label">${s[1]}</p><h2 id="s${s[0]}">${resumeTitle(s[1])}</h2>${s[2]}</div></section>`).join('')}</div></div>`;
}
function resumeTitle(key){return{PROFILE:'個人簡介',EXPERIENCE:'工作經歷',EXPERTISE:'專長領域',LANGUAGES:'語言能力',SOFTWARE:'軟體技能',AWARDS:'得獎經歷',CONTACT:'聯絡方式'}[key]}
function tagList(items){return `<ul class="tag-list">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`}

function renderProject(slug){
  const i=state.projects.findIndex(p=>p.slug===slug);if(i<0){location.hash='#projects';return}
  const p=state.projects[i],next=state.projects[(i+1)%state.projects.length],cover=p.images[0],source=p.status==='完工作品'?'完工攝影 · DONE FOLDER':'設計提案 · RENDER / DRAWING';
  document.title=`${p.title}｜古捷宇作品集`;
  const imageSections=p.images.slice(1).map((im,n)=>`<figure class="case-image ${n%4===1?'inset':''}"><button type="button" data-open="${n+1}" aria-label="放大${esc(im.alt)}"><img src="${im.src}" width="${im.width}" height="${im.height}" alt="${esc(im.alt)}" loading="lazy" decoding="async"></button><figcaption>${pad(n+2)} / ${esc(p.title)} · ${source}</figcaption></figure>`).join('');
  const drawings=(p.drawings||[]).map(d=>`<section class="drawing-section"><header><p class="section-label">TECHNICAL DOCUMENT</p><h2>${esc(d.label)}</h2><p>此圖面取自原始設計資料，作為空間規劃與執行脈絡的補充。</p></header><button type="button" data-drawing="${esc(d.src)}" aria-label="放大${esc(d.alt)}"><img src="${d.src}" width="${d.width}" height="${d.height}" alt="${esc(d.alt)}" loading="lazy"></button><small>${esc(d.source)}</small></section>`).join('');
  view.innerHTML=`<article class="case-study"><header class="case-hero"><button type="button" class="hero-image-button" data-open="0" aria-label="放大${esc(cover.alt)}"><img src="${cover.src}" width="${cover.width}" height="${cover.height}" alt="${esc(cover.alt)}" fetchpriority="high"></button><div class="case-nav"><a href="#projects">WORK / INDEX</a><span>${pad(NUMBERS[p.slug])} / ${pad(state.projects.length)}</span></div><div class="case-title"><p>${esc(p.category)} · ${esc(p.status)}</p><h1>${esc(p.title)}</h1><span>${esc(p.en)}</span></div></header><section class="case-brief"><div><p class="section-label">PROJECT BRIEF</p><h2>空間紀錄</h2></div><div><p>${esc(p.description)}</p><dl><div><dt>TYPE</dt><dd>${esc(p.category)}</dd></div><div><dt>STATUS</dt><dd>${esc(p.status)}</dd></div><div><dt>SOURCE</dt><dd>${source}</dd></div></dl></div></section><div class="case-gallery">${imageSections}</div>${drawings}<a class="next-project" href="#project/${next.slug}"><span>NEXT PROJECT · ${pad(NUMBERS[next.slug])}</span><strong>${esc(next.title)}</strong><img src="${next.images[0].src}" width="${next.images[0].width}" height="${next.images[0].height}" alt="" loading="lazy"></a></article>`;
  view.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openLightbox(p,+b.dataset.open,b));
  view.querySelectorAll('[data-drawing]').forEach(b=>b.onclick=()=>openStandaloneImage(b.dataset.drawing,b.querySelector('img').alt,b));
}

function bindLightbox(){
  const lb=document.querySelector('#lightbox');
  document.querySelector('#lb-close').onclick=closeLightbox;document.querySelector('#lb-prev').onclick=()=>showImage(state.index-1);document.querySelector('#lb-next').onclick=()=>showImage(state.index+1);
  lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});let x=0;
  lb.addEventListener('touchstart',e=>x=e.changedTouches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x;if(Math.abs(d)>45)showImage(state.index+(d<0?1:-1))},{passive:true});
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')showImage(state.index-1);if(e.key==='ArrowRight')showImage(state.index+1);if(e.key==='Tab')trapFocus(e)});
}
function openLightbox(project,index,opener){state.gallery=project;state.opener=opener;const lb=document.querySelector('#lightbox');lb.hidden=false;lb.classList.add('open');document.body.classList.add('lb-open');document.querySelector('#lb-title').textContent=project.title;document.querySelector('#lb-thumbs').innerHTML=project.images.map((im,i)=>`<button type="button" class="lb-thumb" data-thumb="${i}" aria-label="前往第 ${i+1} 張"><img src="${im.src}" alt=""></button>`).join('');document.querySelectorAll('[data-thumb]').forEach(b=>b.onclick=()=>showImage(+b.dataset.thumb));showImage(index);document.querySelector('#lb-close').focus()}
function openStandaloneImage(src,alt,opener){openLightbox({title:'設計圖面',images:[{src,alt,source:'Technical drawing'}]},0,opener)}
function showImage(index){if(!state.gallery)return;const len=state.gallery.images.length;state.index=(index+len)%len;const im=state.gallery.images[state.index],el=document.querySelector('#lb-image');el.src=im.src;el.alt=im.alt;document.querySelector('#lb-count').textContent=`${pad(state.index+1)} / ${pad(len)}`;document.querySelector('#lb-caption').textContent=im.source||'';document.querySelectorAll('.lb-thumb').forEach((b,i)=>{b.classList.toggle('active',i===state.index);b.setAttribute('aria-current',i===state.index?'true':'false')});document.querySelector('.lb-thumb.active')?.scrollIntoView({inline:'center',block:'nearest'})}
function closeLightbox(){const lb=document.querySelector('#lightbox');if(!lb.classList.contains('open'))return;lb.classList.remove('open');lb.hidden=true;document.body.classList.remove('lb-open');state.opener?.focus();state.gallery=null}
function trapFocus(e){const f=[...document.querySelectorAll('#lightbox button:not([hidden])')];const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}

init().catch(err=>{view.innerHTML=`<div class="loading">${esc(err.message)}。請透過靜態伺服器開啟。</div>`;view.classList.add('view-ready');console.error(err)});
