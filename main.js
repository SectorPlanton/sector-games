/* ══════════════════════════════════
   SECTOR ARCADE – SHARED JS
   www.sector-games.com
══════════════════════════════════ */
(function () {
  'use strict';

  /* ── STARFIELD ── */
  var canvas = document.getElementById('star-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var W, H;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function initStars() {
      stars = [];
      for (var i = 0; i < 230; i++) {
        stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.1+0.15,
          vy: Math.random()*0.2+0.04, tw: Math.random()*Math.PI*2, op: Math.random()*0.55+0.1 });
      }
    }
    function drawStars() {
      ctx.clearRect(0,0,W,H);
      for (var i=0;i<stars.length;i++){
        var s=stars[i]; s.tw+=0.018; s.y-=s.vy;
        if(s.y<-2){s.y=H+2;s.x=Math.random()*W;}
        var op=s.op*(0.65+0.35*Math.sin(s.tw));
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle='rgba(180,215,255,'+op.toFixed(2)+')'; ctx.fill();
      }
      requestAnimationFrame(drawStars);
    }
    resize(); initStars(); drawStars();
    window.addEventListener('resize', function(){resize();initStars();});
  }

  /* ── CARD PARTICLES ── */
  var ks = document.createElement('style');
  ks.textContent='@keyframes tp-rise{from{transform:translateY(110%);opacity:0}10%{opacity:1}90%{opacity:.8}to{transform:translateY(-10%);opacity:0}}';
  document.head.appendChild(ks);

  function addParticles(id, colour) {
    var el = document.getElementById(id); if(!el)return;
    for(var i=0;i<14;i++){
      var p=document.createElement('span');
      var dur=(Math.random()*2.5+2).toFixed(1), delay=(Math.random()*3).toFixed(1);
      p.style.cssText='position:absolute;left:'+(Math.random()*100)+'%;bottom:0;width:2px;height:2px;border-radius:50%;background:'+colour+';animation:tp-rise '+dur+'s '+delay+'s linear infinite;pointer-events:none;';
      el.appendChild(p);
    }
  }
  addParticles('tp-a','#00f0ff'); addParticles('tp-g','#ff2d6e');
  addParticles('tp-v','#7b2fff'); addParticles('tp-c','#ffb400');
  addParticles('tp-n','#d400ff'); addParticles('tp-s','#00ff88');

  /* ── NAVBAR SCROLL SHADOW ── */
  var navbar = document.getElementById('navbar');
  function onScroll(){ navbar && (window.scrollY>10 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled')); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ── HAMBURGER ── */
  var btn=document.getElementById('hamburger-btn'), menu=document.getElementById('mobile-menu'), isOpen=false;
  function openMenu(){ isOpen=true; btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); btn.setAttribute('aria-label','Close navigation menu'); menu.classList.add('open'); document.body.classList.add('menu-open'); }
  function closeMenu(){ isOpen=false; btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Open navigation menu'); menu.classList.remove('open'); document.body.classList.remove('menu-open'); }
  if(btn && menu){
    btn.addEventListener('click',function(e){e.stopPropagation();isOpen?closeMenu():openMenu();});
    var mLinks=menu.querySelectorAll('a'); for(var i=0;i<mLinks.length;i++) mLinks[i].addEventListener('click',closeMenu);
    document.addEventListener('click',function(e){if(isOpen&&!menu.contains(e.target)&&e.target!==btn&&!btn.contains(e.target))closeMenu();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeMenu();});
    window.addEventListener('resize',function(){if(window.innerWidth>900&&isOpen)closeMenu();});
  }

  /* ── SMOOTH SCROLL ── */
  var anchors=document.querySelectorAll('a[href^="#"]');
  for(var i=0;i<anchors.length;i++){
    anchors[i].addEventListener('click',function(e){
      var href=this.getAttribute('href'); if(href==='#')return;
      var target=document.querySelector(href); if(!target)return;
      e.preventDefault();
      var navH=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),10)||68;
      window.scrollTo({top:target.getBoundingClientRect().top+window.pageYOffset-navH-12,behavior:'smooth'});
    });
  }

  /* ── SCROLL REVEAL ── */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++) if(entries[i].isIntersecting){entries[i].target.classList.add('in');io.unobserve(entries[i].target);}
    },{threshold:0.1});
    var reveals=document.querySelectorAll('.reveal');
    for(var i=0;i<reveals.length;i++) io.observe(reveals[i]);
  } else {
    var reveals=document.querySelectorAll('.reveal');
    for(var i=0;i<reveals.length;i++) reveals[i].classList.add('in');
  }

  /* ── ACTIVE NAV LINK ── */
  var sections=document.querySelectorAll('section[id]'), navAnchors=document.querySelectorAll('.nav-links a');
  function updateActive(){
    var scrollY=window.pageYOffset, current='';
    for(var i=0;i<sections.length;i++) if(scrollY>=sections[i].offsetTop-80) current=sections[i].id;
    for(var i=0;i<navAnchors.length;i++){
      var href=navAnchors[i].getAttribute('href').replace('#','').replace(/.*\//,'');
      navAnchors[i].classList.toggle('active', href===current || (navAnchors[i].getAttribute('href').includes(window.location.pathname) && window.location.pathname!=='/' && window.location.pathname!=='/index.html'));
    }
  }
  window.addEventListener('scroll',updateActive,{passive:true}); updateActive();

})();
