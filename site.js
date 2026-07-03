/* Muntasir Masum — interactive layer for the static site.
   Loaded on every page (after the footer). No dependencies.
   Handles: dark-mode toggle (persisted), search overlay (⌘K or /),
   and research-interest topic pop-ups ([data-mm-topic] elements). */
(function(){

  document.documentElement.classList.add('mm-js');

  /* ---------------- DARK MODE ---------------- */
  var root = document.documentElement;
  function syncThemeColor(){
    var m=document.querySelector('meta[name="theme-color"]');
    if(m) m.setAttribute('content', root.classList.contains('quarto-dark') ? '#141118' : '#f5f6f8');
  }
  function applyStored(){
    try{ if(localStorage.getItem('mm-theme')==='dark') root.classList.add('quarto-dark'); }catch(e){}
    syncThemeColor();
  }
  applyStored();
  function toggleDark(){
    var dark = root.classList.toggle('quarto-dark');
    try{ localStorage.setItem('mm-theme', dark ? 'dark' : 'light'); }catch(e){}
    syncThemeColor();
  }

  /* ---------------- SEARCH / TOPIC INDEX ---------------- */
  var IDX=[
    {t:'Alcohol & binge drinking frequency and hypertension',s:'Publication',u:'publications.html',b:'American Journal of Preventive Medicine, 2024. Frequent and binge drinking tracked with higher hypertension prevalence nationwide.',k:['alcohol','chronic']},
    {t:'Does staying put protect? Neighborhood cohesion & drinking',s:'Publication',u:'publications.html',b:'Alcohol and Alcoholism, 2026. Cohesion protects more against risky drinking the longer adults stay put.',k:['alcohol','sdoh']},
    {t:'Predictive modeling of cognitive function with machine learning',s:'Publication',u:'publications.html',b:'Journal of Biomedical Informatics, under review. Benchmarks ML models for early-midlife cognition.',k:['ml','chronic']},
    {t:'COVerAGE-DB: a global COVID-19 database',s:'Publication',u:'publications.html',b:'International Journal of Epidemiology, 2021. An open resource harmonizing COVID-19 cases and deaths.',k:['reproducible']},
    {t:'Labor force status buffers alcohol mortality risk',s:'Publication',u:'publications.html',b:'Preventive Medicine, 2022. Employment buffered drinking-related mortality among U.S. women.',k:['alcohol','longitudinal','chronic']},
    {t:'Combined alcohol use & weight status effects on mortality',s:'Publication',u:'publications.html',b:'Drug & Alcohol Dependence, 2022. NHIS linked mortality files, 2001-2015.',k:['alcohol','longitudinal','chronic']},
    {t:'Historical redlining and binge drinking in early midlife',s:'Publication',u:'publications.html',b:'American Journal of Epidemiology, submitted. Structural pathways through the alcohol environment.',k:['alcohol','sdoh']},
    {t:'Abstainer heterogeneity & the alcohol-CVD mortality J-curve',s:'Publication',u:'publications.html',b:'Addiction, under review. Early-midlife US adults and the alcohol J-curve.',k:['alcohol','longitudinal','chronic']},
    {t:'Boomer-Gen X gap in midlife functional limitations',s:'Publication',u:'publications.html',b:'Demography, under review. A race-stratified decomposition of midlife functional limitations.',k:['longitudinal','chronic']},
    {t:'Binge drinking, mental distress & the alcohol harm paradox',s:'Publication',u:'publications.html',b:'Annals of Epidemiology, under review. Variation by race, ethnicity, and sex.',k:['alcohol','chronic']},
    {t:'Alcohol epidemiology across the life course',s:'Research',u:'research.html',b:'Drinking trajectories from adolescence into midlife and links to hypertension, CVD, and mortality.',k:['alcohol','longitudinal','chronic']},
    {t:'Social determinants & place',s:'Research',u:'research.html',b:'How cohesion, length of residence, and redlining pattern health by race, ethnicity, and sex.',k:['sdoh']},
    {t:'Machine learning for population health',s:'Research',u:'research.html',b:'Predictive models for cognition and CVD risk, and reproducible pipelines for survey harmonization.',k:['ml','reproducible']},
    {t:'AI Plus Institute Agentic AI Seed Grant',s:'Funding',u:'research.html',b:'PI, 2026. Agentic AI for harmonizing BRFSS data.',k:['ml','reproducible']},
    {t:'SUNY AI Platform Award',s:'Funding',u:'research.html',b:'PI, $100,000, 2025-26. ML prediction of cardiovascular risk in early midlife.',k:['ml','chronic']},
    {t:'Grant Radar',s:'Tool',u:'studio.html',b:'A weekly dashboard turning NIH funding notices into structured, searchable cards. R + Quarto.',k:['reproducible']},
    {t:'Quarto + Typst CV template',s:'Tool',u:'studio.html',b:'A reproducible, data-driven academic CV — one render produces the PDF.',k:['reproducible']},
    {t:'CIHS Course Waiver Evaluator',s:'Tool',u:'studio.html',b:'A Shiny app scoring syllabi against course content with local NLP and the Claude API.',k:['ml','reproducible']},
    {t:'AI in Epidemiology (workshop)',s:'Talk',u:'dispatches.html',b:'A hands-on reveal.js workshop on AI tools in epidemiologic research and teaching.',k:['ml','reproducible']},
    {t:'No Protective Effect of Moderate Drinking',s:'Talk',u:'dispatches.html',b:'Invited talk, 2025. Beyond Addiction Symposium, University at Albany.',k:['alcohol']},
    {t:'EPI 553 — Principles of Statistical Inference II',s:'Course',u:'teaching.html',b:'Graduate biostatistics — regression, ANOVA, logistic, Poisson, and survival models.',k:['longitudinal','reproducible']},
    {t:'HSPH 459 — Alcohol, Society & Health',s:'Course',u:'teaching.html',b:'An undergraduate course on alcohol, society, and health.',k:['alcohol']},
    {t:'Publication-Ready Tables in R',s:'Tutorial',u:'teaching.html',b:'A practical guide to Table 1 and regression tables with gtsummary and flextable.',k:['reproducible']},
    {t:'Funded: agentic AI to harmonize the BRFSS',s:'Writing',u:'dispatches.html',b:'June 2026. What the seed grant will build, and why harmonization matters.',k:['ml','reproducible']},
    {t:'Why I rebuilt my CV and website in Quarto',s:'Writing',u:'dispatches.html',b:'April 2026. One data source for the CV and the whole site, and far less maintenance.',k:['reproducible']},
    {t:'Notes from the UAlbany AI Plus Symposium',s:'Writing',u:'dispatches.html',b:'March 2026. Teaching regression methods with Claude and RStudio.',k:['ml','reproducible']}
  ];
  var TL={alcohol:'Alcohol epidemiology',sdoh:'Social determinants of health',ml:'Machine learning',longitudinal:'Survival & longitudinal data',chronic:'Chronic health outcomes',reproducible:'Reproducible research'};
  var ORD={Publication:1,Research:2,Funding:3,Talk:4,Course:5,Tutorial:6,Tool:7,Writing:8};
  var ov,headEl,listEl,inputEl,rows=[],sel=-1;
  var NAV=[
    {s:'Page',t:'Home',u:'index.html',b:'Overview, selected work, and recent news.'},
    {s:'Page',t:'About',u:'about.html',b:'Bio, appointments, education, honors, and service.'},
    {s:'Page',t:'Research',u:'research.html',b:'Themes, the interactive body map, and current funding.'},
    {s:'Page',t:'Publications',u:'publications.html',b:'Peer-reviewed work by year, plus papers under review.'},
    {s:'Page',t:'Dispatches',u:'dispatches.html',b:'Talks, workshops, and writing.'},
    {s:'Page',t:'Teaching',u:'teaching.html',b:'Courses, materials, R labs, and mentoring.'},
    {s:'Page',t:'Studio',u:'studio.html',b:'Visualizations, tools, and experiments.'}
  ];
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
  function build(){
    ov=document.createElement('div');ov.className='mm-ov';ov.style.display='none';
    ov.innerHTML='<div class="mm-ov-panel" role="dialog" aria-modal="true" aria-label="Site search"><div class="mm-ov-head"></div><div class="mm-ov-list"></div><div class="mm-ov-foot"><span class="mm-kbd">&#8593;</span><span class="mm-kbd">&#8595;</span> navigate &nbsp; <span class="mm-kbd">&#8629;</span> open &nbsp; <span class="mm-kbd">esc</span> close</div></div>';
    document.body.appendChild(ov);
    headEl=ov.querySelector('.mm-ov-head');listEl=ov.querySelector('.mm-ov-list');
    ov.addEventListener('click',function(e){if(e.target===ov)close();});
    document.addEventListener('keydown',function(e){
      var open=ov.style.display!=='none';
      if(e.key==='Escape'&&open){close();return;}
      if((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey)){e.preventDefault();openSearch();return;}
      if(e.key==='/'&&!open&&!/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||'')){e.preventDefault();openSearch();return;}
      if(open&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();move(e.key==='ArrowDown'?1:-1);}
      else if(open&&e.key==='Enter'){var r=rows[sel];if(r){e.preventDefault();window.location.href=r.u;}}
    });
  }
  var lastFocus=null;
  function show(){lastFocus=document.activeElement;ov.style.display='flex';document.body.style.overflow='hidden';}
  function close(){ov.style.display='none';document.body.style.overflow='';if(lastFocus&&lastFocus.focus){lastFocus.focus();lastFocus=null;}}
  function rowHtml(e,i){return '<a class="mm-ov-row'+(i===sel?' is-active':'')+'" href="'+e.u+'" data-i="'+i+'"><span class="mm-ov-label">'+esc(e.s)+'</span><span class="mm-ov-title">'+esc(e.t)+'</span><span class="mm-ov-desc">'+esc(e.b)+'</span></a>';}
  function highlight(){listEl.querySelectorAll('.mm-ov-row').forEach(function(el){el.classList.toggle('is-active',(+el.getAttribute('data-i'))===sel);});}
  function move(d){if(!rows.length)return;sel=(sel+d+rows.length)%rows.length;highlight();}
  function paint(items,heading){rows=items.slice();sel=items.length?0:-1;var html=heading?'<div class="mm-ov-sec">'+heading+'</div>':'';html+=items.length?items.map(rowHtml).join(''):'<div class="mm-ov-empty">No matching items.</div>';listEl.innerHTML=html;listEl.querySelectorAll('.mm-ov-row').forEach(function(el){el.addEventListener('mousemove',function(){var i=+el.getAttribute('data-i');if(i!==sel){sel=i;highlight();}});});}
  function renderList(items,heading){items=items.slice().sort(function(a,b){return (ORD[a.s]||50)-(ORD[b.s]||50);});paint(items,heading);}
  function openTopic(key){
    if(!ov)build();
    headEl.innerHTML='<span class="mm-ov-pill">'+esc(TL[key]||key)+'</span><span class="mm-ov-count">'+IDX.filter(function(e){return e.k.indexOf(key)!==-1;}).length+' related items across the site</span>';
    renderList(IDX.filter(function(e){return e.k.indexOf(key)!==-1;}),null);show();
  }
  function openSearch(){
    if(!ov)build();
    headEl.innerHTML='<span style="display:inline-flex;flex:none;color:var(--muted2)"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="20.5" y1="20.5" x2="16.5" y2="16.5"></line></svg></span><input class="mm-ov-input" type="text" placeholder="Search publications, talks, teaching, software…" autocomplete="off" spellcheck="false">';
    inputEl=headEl.querySelector('.mm-ov-input');
    inputEl.addEventListener('input',function(){doSearch(inputEl.value);});
    paint(NAV,'Jump to');show();setTimeout(function(){inputEl.focus();},30);
  }
  function doSearch(q){q=(q||'').trim().toLowerCase();if(!q){paint(NAV,'Jump to');return;}var toks=q.split(/\s+/);renderList(IDX.filter(function(e){var h=(e.t+' '+e.b+' '+e.s).toLowerCase();return toks.every(function(t){return h.indexOf(t)!==-1;});}),'Results');}

  function wire(){
    document.querySelectorAll('[data-mm-topic]').forEach(function(el){
      el.style.cursor='pointer';
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
      el.addEventListener('click',function(ev){ev.preventDefault();openTopic(el.getAttribute('data-mm-topic'));});
      el.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); openTopic(el.getAttribute('data-mm-topic')); } });
    });
    document.querySelectorAll('[data-mm-search]').forEach(function(el){
      el.addEventListener('click',function(ev){ev.preventDefault();openSearch();});
    });
    document.querySelectorAll('[data-mm-dark]').forEach(function(el){
      el.addEventListener('click',function(ev){ev.preventDefault();toggleDark();});
    });
    window.mmOpenSearch=openSearch;
  }
  function setupNav(){
    var nav=document.querySelector('.mm-nav'); if(!nav) return;
    var inner=nav.querySelector('.mm-nav-inner'); var brand=inner&&inner.querySelector('.mm-brand');
    if(!inner||!brand||inner.querySelector('.mm-hamburger')) return;
    var btn=document.createElement('button');
    btn.className='mm-hamburger'; btn.type='button';
    btn.setAttribute('aria-label','Menu'); btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    inner.appendChild(btn);
    btn.addEventListener('click',function(){ var open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open?'true':'false'); });
    inner.querySelectorAll('.mm-links a').forEach(function(a){ a.addEventListener('click',function(){ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }); });
  }
  /* ---------- FIGURE LIGHTBOX (studio) ---------- */
  var lbOv=null,lbLast=null;
  function lbBuild(){
    lbOv=document.createElement('div');
    lbOv.className='mm-ov mm-lb';
    lbOv.style.display='none';
    lbOv.innerHTML='<div class="mm-lb-panel" role="dialog" aria-modal="true" aria-label="Figure viewer"><div class="mm-lb-head"><button class="mm-lb-close" type="button" aria-label="Close figure viewer">&#215;</button></div><div class="mm-lb-scroll"></div><figcaption class="mm-lb-cap"></figcaption><div class="mm-lb-foot"></div></div>';
    document.body.appendChild(lbOv);
    lbOv.querySelector('.mm-lb-close').addEventListener('click',lbClose);
    lbOv.addEventListener('click',function(e){if(e.target===lbOv)lbClose();});
    document.addEventListener('keydown',function(e){
      if(!lbOv||lbOv.style.display==='none')return;
      if(e.key==='Escape'){e.preventDefault();lbClose();return;}
      if(e.key==='Tab')lbTrap(e);
    });
  }
  function lbTrap(e){
    var f=lbOv.querySelectorAll('button, a[href]');
    if(!f.length)return;
    var first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  function lbOpen(card){
    if(!lbOv)lbBuild();
    var figs=(card.getAttribute('data-mm-figs')||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
    var alts=(card.getAttribute('data-mm-alt')||'').split('|');
    var cap=card.getAttribute('data-mm-cap')||'';
    var paper=card.getAttribute('data-mm-paper')||'';
    var plabel=card.getAttribute('data-mm-paper-label')||'View the paper';
    var wide=figs.length===1;
    lbOv.querySelector('.mm-lb-scroll').innerHTML=figs.map(function(src,i){
      var a=esc(alts[i]||alts[0]||'Research figure');
      return '<div class="mm-lb-mat'+(wide?' is-wide':'')+'"><img src="'+esc(src)+'" alt="'+a+'"></div>';
    }).join('');
    lbOv.querySelector('.mm-lb-cap').innerHTML=esc(cap);
    lbOv.querySelector('.mm-lb-foot').innerHTML=paper?'<a class="mm-lb-paper" href="'+esc(paper)+'" target="_blank" rel="noopener">'+esc(plabel)+' &#8599;</a>':'';
    lbLast=document.activeElement;
    lbOv.style.display='flex';
    document.body.style.overflow='hidden';
    lbOv.querySelector('.mm-lb-close').focus();
  }
  function lbClose(){
    if(!lbOv)return;
    lbOv.style.display='none';
    document.body.style.overflow='';
    if(lbLast&&lbLast.focus){lbLast.focus();lbLast=null;}
  }
  function lbWire(){
    document.querySelectorAll('.mm-figcard').forEach(function(card){
      card.addEventListener('click',function(e){ if(e.target.closest('a'))return; lbOpen(card); });
      card.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); lbOpen(card); } });
    });
  }
  function init(){build();wire();setupNav();lbWire();}
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
