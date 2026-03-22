/* SECTOR ARCADE v2 – main.js | www.sector-games.com */
(function(){
'use strict';

/* ── GAMES DATA ── */
var GAMES = [
  { slug:'sector-arkanoid',  name:'Sector Arkanoid',  icon:'🧱', tags:['arcade','classic','brick breaker','arkanoid'] },
  { slug:'galaxy-assault',   name:'Galaxy Assault',   icon:'🚀', tags:['shooter','action','space','aliens'] },
  { slug:'void-bird',        name:'Void Bird',        icon:'🐦', tags:['casual','arcade','flappy','tap'] },
  { slug:'castle-destroyer', name:'Castle Destroyer', icon:'🏰', tags:['strategy','action','siege','physics'] },
  { slug:'neon-blocks',      name:'Neon Blocks',      icon:'🟪', tags:['puzzle','arcade','tetris','blocks'] },
  { slug:'serpent-ultra',    name:'Serpent Ultra',    icon:'🐍', tags:['snake','arcade','power-ups','neon'] },
];

/* Depth detection: 0 = root, 1 = /games/ or /blog/ or /categories/ */
var PATH = window.location.pathname;
var DEPTH = (PATH.match(/\/games\/|\/blog\/|\/categories\//) ? 1 : 0);
function root(rel){ return DEPTH ? '../' + rel : rel; }
function gameUrl(slug){ return root('games/' + slug + '.html'); }

/* ── STARFIELD ── */
var canvas = document.getElementById('star-canvas');
if(canvas){
  var ctx = canvas.getContext('2d'), stars = [], W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function initStars(){
    stars = [];
    for(var i = 0; i < 230; i++)
      stars.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.1+.15,
                   vy:Math.random()*.2+.04, tw:Math.random()*Math.PI*2, op:Math.random()*.55+.1 });
  }
  function drawStars(){
    ctx.clearRect(0,0,W,H);
    for(var i = 0; i < stars.length; i++){
      var s = stars[i];
      s.tw += .018; s.y -= s.vy;
      if(s.y < -2){ s.y = H+2; s.x = Math.random()*W; }
      var op = s.op*(.65+.35*Math.sin(s.tw));
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(180,215,255,'+op.toFixed(2)+')'; ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  resize(); initStars(); drawStars();
  window.addEventListener('resize', function(){ resize(); initStars(); });
}

/* ── THUMB PARTICLES ── */
var ks = document.createElement('style');
ks.textContent = '@keyframes tp-rise{from{transform:translateY(110%);opacity:0}10%{opacity:1}90%{opacity:.8}to{transform:translateY(-10%);opacity:0}}';
document.head.appendChild(ks);
function addParticles(id, colour){
  var el = document.getElementById(id); if(!el) return;
  for(var i = 0; i < 14; i++){
    var p = document.createElement('span');
    var dur = (Math.random()*2.5+2).toFixed(1), del = (Math.random()*3).toFixed(1);
    p.style.cssText = 'position:absolute;left:'+(Math.random()*100)+'%;bottom:0;width:2px;height:2px;border-radius:50%;background:'+colour+';animation:tp-rise '+dur+'s '+del+'s linear infinite;pointer-events:none;';
    el.appendChild(p);
  }
}
addParticles('tp-a','#00f0ff'); addParticles('tp-g','#ff2d6e');
addParticles('tp-v','#7b2fff'); addParticles('tp-c','#ffb400');
addParticles('tp-n','#d400ff'); addParticles('tp-s','#00ff88');

/* ── NAVBAR SCROLL ── */
var navbar = document.getElementById('navbar');
function onScroll(){ navbar && (window.scrollY > 10 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled')); }
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* ── HAMBURGER ── */
var hBtn = document.getElementById('hamburger-btn');
var mMenu = document.getElementById('mobile-menu');
var isOpen = false;
function openMenu(){ isOpen=true; hBtn&&hBtn.classList.add('open'); hBtn&&hBtn.setAttribute('aria-expanded','true'); mMenu&&mMenu.classList.add('open'); document.body.classList.add('menu-open'); }
function closeMenu(){ isOpen=false; hBtn&&hBtn.classList.remove('open'); hBtn&&hBtn.setAttribute('aria-expanded','false'); mMenu&&mMenu.classList.remove('open'); document.body.classList.remove('menu-open'); }
if(hBtn && mMenu){
  hBtn.addEventListener('click', function(e){ e.stopPropagation(); isOpen ? closeMenu() : openMenu(); });
  mMenu.querySelectorAll('a').forEach(function(l){ l.addEventListener('click', closeMenu); });
  document.addEventListener('click', function(e){ if(isOpen && !mMenu.contains(e.target) && e.target !== hBtn && !hBtn.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && isOpen) closeMenu(); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 900 && isOpen) closeMenu(); });
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var href = this.getAttribute('href'); if(href === '#') return;
    var target = document.querySelector(href); if(!target) return;
    e.preventDefault();
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),10) || 68;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH - 12, behavior:'smooth' });
  });
});

/* ── SCROLL REVEAL ── */
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
}

/* ── SEARCH (desktop + mobile) ── */
function initSearch(inputId, resultsId){
  var input = document.getElementById(inputId);
  var results = document.getElementById(resultsId);
  if(!input || !results) return;

  input.addEventListener('input', function(){
    var q = this.value.trim().toLowerCase();
    if(q.length < 2){ results.classList.remove('open'); results.innerHTML=''; return; }
    var matches = GAMES.filter(function(g){
      return g.name.toLowerCase().includes(q) || g.tags.some(function(t){ return t.includes(q); });
    });
    if(!matches.length){ results.classList.remove('open'); results.innerHTML=''; return; }
    results.innerHTML = matches.map(function(g){
      return '<div class="search-result-item" onclick="window.location.href=\''+gameUrl(g.slug)+'\'">'
        +'<span class="search-result-icon">'+g.icon+'</span><span>'+g.name+'</span></div>';
    }).join('');
    results.classList.add('open');
  });

  document.addEventListener('click', function(e){
    if(!input.contains(e.target) && !results.contains(e.target)) results.classList.remove('open');
  });
  input.addEventListener('keydown', function(e){
    if(e.key==='Escape'){ results.classList.remove('open'); input.blur(); return; }
    if(e.key==='Enter'){
      var first = results.querySelector('.search-result-item');
      if(first) first.click();
    }
  });
}
initSearch('nav-search-input', 'nav-search-results');
initSearch('mm-search-input',  'mm-search-results');

/* ── RANDOM GAME ── */
function goRandom(){
  var g = GAMES[Math.floor(Math.random() * GAMES.length)];
  window.location.href = gameUrl(g.slug);
}
document.querySelectorAll('.btn-random, [data-random]').forEach(function(el){
  el.addEventListener('click', goRandom);
});

/* ── FAVORITES (localStorage) ── */
var FAV_KEY = 'sa_favorites_v2';
function getFavs(){ try{ return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }catch(e){ return []; } }
function saveFavs(arr){ try{ localStorage.setItem(FAV_KEY, JSON.stringify(arr)); }catch(e){} }
function toggleFav(slug){ var favs=getFavs(); var idx=favs.indexOf(slug); if(idx===-1) favs.push(slug); else favs.splice(idx,1); saveFavs(favs); return idx===-1; }
function isFav(slug){ return getFavs().indexOf(slug) !== -1; }

document.querySelectorAll('.card-fav').forEach(function(btn){
  var slug = btn.dataset.game; if(!slug) return;
  // Set initial state
  if(isFav(slug)){ btn.classList.add('active'); btn.textContent = '♥'; }
  else { btn.textContent = '♡'; }
  btn.addEventListener('click', function(e){
    e.preventDefault(); e.stopPropagation();
    var active = toggleFav(slug);
    btn.classList.toggle('active', active);
    btn.textContent = active ? '♥' : '♡';
    // Pulse animation
    btn.style.transform = 'scale(1.3)';
    setTimeout(function(){ btn.style.transform = ''; }, 200);
  });
});

/* Render favorites section if present */
var favGrid = document.getElementById('favorites-grid');
if(favGrid){
  var favSlugs = getFavs();
  if(!favSlugs.length){
    favGrid.innerHTML = '<div class="fav-empty"><div class="fav-empty-icon">♡</div><p>No favorites yet — click ♥ on any game card to save it here.</p></div>';
  } else {
    var favGames = GAMES.filter(function(g){ return favSlugs.indexOf(g.slug) !== -1; });
    if(!favGames.length){
      favGrid.innerHTML = '<div class="fav-empty"><div class="fav-empty-icon">♡</div><p>No favorites yet.</p></div>';
    } else {
      var THUMB = {
        'sector-arkanoid':  {cls:'t-arkanoid', col:'#00f0ff', tag:'tag-c', tagName:'Arcade'},
        'galaxy-assault':   {cls:'t-galaxy',   col:'#ff2d6e', tag:'tag-p', tagName:'Shooter'},
        'void-bird':        {cls:'t-void',     col:'#7b2fff', tag:'tag-v', tagName:'Casual'},
        'castle-destroyer': {cls:'t-castle',   col:'#ffb400', tag:'tag-g', tagName:'Strategy'},
        'neon-blocks':      {cls:'t-neon',     col:'#d400ff', tag:'tag-v', tagName:'Puzzle'},
        'serpent-ultra':    {cls:'t-serpent',  col:'#00ff88', tag:'tag-n', tagName:'Snake'},
      };
      var html = '<div class="games-grid">';
      favGames.forEach(function(g, i){
        var t = THUMB[g.slug] || {cls:'t-arkanoid', col:'#00f0ff', tag:'tag-c', tagName:'Game'};
        var url = gameUrl(g.slug);
        html += '<a href="'+url+'" class="game-card reveal" style="transition-delay:'+(i*0.07).toFixed(2)+'s">'
          +'<button class="card-fav active" data-game="'+g.slug+'" title="Remove from favorites">♥</button>'
          +'<div class="card-thumb '+t.cls+'">'
          +'<div class="thumb-grid"></div>'
          +'<div class="card-thumb-bg">'
          +'<span class="thumb-emoji" style="color:'+t.col+'">'+g.icon+'</span>'
          +'</div>'
          +'<div class="play-overlay"><div class="play-circle">▶</div></div>'
          +'</div>'
          +'<div class="card-body">'
          +'<h3 class="card-title">'+g.name+'</h3>'
          +'<div class="card-footer">'
          +'<div class="tags"><span class="tag '+t.tag+'">'+t.tagName+'</span></div>'
          +'<span class="card-play-link">Play →</span>'
          +'</div></div></a>';
      });
      html += '</div>';
      favGrid.innerHTML = html;
      // Re-attach fav listeners on dynamically created buttons
      favGrid.querySelectorAll('.card-fav').forEach(function(btn){
        var slug = btn.dataset.game; if(!slug) return;
        btn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          var active = toggleFav(slug);
          btn.classList.toggle('active', active);
          btn.textContent = active ? '♥' : '♡';
          if(!active){
            // Remove card from favorites grid
            var card = btn.closest('.game-card');
            if(card) card.style.opacity = '0';
            setTimeout(function(){ if(card) card.remove(); }, 300);
          }
        });
      });
      // Re-trigger reveal
      if('IntersectionObserver' in window){
        favGrid.querySelectorAll('.reveal').forEach(function(el){ io && io.observe(el); });
      } else {
        favGrid.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
      }
    }
  }
}

/* ── ACTIVE NAV LINK ── */
var currentFile = PATH.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(function(a){
  var href = (a.getAttribute('href') || '').split('/').pop().split('#')[0] || 'index.html';
  if(href === currentFile && currentFile !== '') a.classList.add('active');
});

})();
