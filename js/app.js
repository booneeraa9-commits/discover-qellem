/* ============================================================
   Discover Qellem — Vanilla JS SPA
   ============================================================ */
(function(){
  'use strict';

  // -------- State --------
  var state = {
    lang: (localStorage.getItem('dq_lang') || 'en'),
    theme: (localStorage.getItem('dq_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')),
    route: null,
    deferredInstall: null
  };

  var $app;
  var $nav;

  // -------- Helpers --------
  function t(key){
    var d = DATA.i18n.en, s = DATA.i18n[state.lang];
    return (s && s[key] != null) ? s[key] : (d[key] != null ? d[key] : key);
  }
  function pick(obj){
    if (obj == null) return '';
    if (typeof obj !== 'object') return String(obj);
    if (obj[state.lang] != null) return obj[state.lang];
    if (obj.en != null) return obj.en;
    return String(obj);
  }
  function fmt(n){
    if (typeof n !== 'number') return n;
    return n.toLocaleString('en-US');
  }
  function fmtDate(iso){
    try{
      var d = new Date(iso);
      return d.toLocaleDateString(state.lang === 'om' ? 'en-GB' : 'en-GB', {year:'numeric', month:'short', day:'numeric'});
    }catch(e){ return iso; }
  }
  function el(tag, attrs, html){
    var e = document.createElement(tag);
    if (attrs){
      for (var k in attrs){
        if (k === 'class') e.className = attrs[k];
        else if (k === 'html') e.innerHTML = attrs[k];
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function iconHtml(name){
    return '<i data-lucide="'+name+'"></i>';
  }
  function imgBg(url, fallbackText){
    return 'background-image:linear-gradient(135deg, rgba(11,61,46,.55), rgba(11,61,46,.25)), url(\''+url+'\');';
  }
  function toast(msg){
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function(){ el.classList.remove('show'); }, 2400);
  }

  // -------- Apply theme & language --------
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', state.theme);
    var ic = document.getElementById('themeIcon');
    if (ic) ic.setAttribute('data-lucide', state.theme === 'dark' ? 'sun' : 'moon');
    localStorage.setItem('dq_theme', state.theme);
    if (window.lucide) lucide.createIcons();
  }
  function applyLang(){
    document.documentElement.setAttribute('lang', state.lang === 'om' ? 'om' : 'en');
    var lbl = document.getElementById('langLabel');
    if (lbl) lbl.textContent = state.lang === 'om' ? 'EN' : 'OM';
    localStorage.setItem('dq_lang', state.lang);
    // Re-render with new language
    render();
  }

  // -------- Router --------
  function parseHash(){
    var h = (window.location.hash || '#/').replace(/^#/, '');
    if (h === '' || h === '/') return {name:'home'};
    var parts = h.split('/').filter(Boolean);
    if (parts[0] === 'places') return {name:'places'};
    if (parts[0] === 'place' && parts[1]){
      var slug = parts[1];
      var sub = parts.slice(2).map(decodeURIComponent).join('/');
      return {name:'place', slug:slug, sub:sub || null};
    }
    if (parts[0] === 'news') return {name:'news'};
    if (parts[0] === 'stories') return {name:'stories'};
    if (parts[0] === 'history') return {name:'history'};
    if (parts[0] === 'support') return {name:'support'};
    if (parts[0] === 'contribute') return {name:'contribute'};
    if (parts[0] === 'staff') return {name:'staff'};
    if (parts[0] === 'about') return {name:'about'};
    if (parts[0] === 'article') return {name:'article', type:parts[1], id:parts[2]};
    return {name:'notfound'};
  }

  function setActiveNav(){
    if (!$nav) return;
    var links = $nav.querySelectorAll('.nav-links a, .mobile-menu a');
    var r = state.route;
    for (var i=0; i<links.length; i++){
      var a = links[i];
      var href = a.getAttribute('href') || '';
      a.classList.remove('active');
      if (r.name === 'home' && href === '#/') a.classList.add('active');
      else if ((r.name === 'places' || r.name === 'place') && href === '#/places') a.classList.add('active');
      else if ((r.name === 'news' || (r.name === 'article' && r.type !== 'story')) && href === '#/news') a.classList.add('active');
      else if ((r.name === 'stories' || (r.name === 'article' && r.type === 'story')) && href === '#/stories') a.classList.add('active');
      else if (r.name === 'history' && href === '#/history') a.classList.add('active');
      else if (r.name === 'support' && href === '#/support') a.classList.add('active');
    }
  }

  // -------- Rendering --------
  function render(){
    state.route = parseHash();
    var html;
    try{
      switch(state.route.name){
        case 'home':       html = viewHome(); break;
        case 'places':     html = viewPlaces(); break;
        case 'place':      html = viewPlace(state.route.slug, state.route.sub); break;
        case 'news':       html = viewNews(); break;
        case 'stories':    html = viewStories(); break;
        case 'history':    html = viewHistory(); break;
        case 'support':    html = viewSupport(); break;
        case 'contribute': html = viewContribute(); break;
        case 'staff':      html = viewStaff(); break;
        case 'article':    html = viewArticle(state.route.type, state.route.id); break;
        case 'about':      html = viewAbout(); break;
        default:           html = view404();
      }
    }catch(e){
      console && console.error && console.error(e);
      html = '<div class="container section text-center"><h1>Error</h1><p class="muted">'+(e.message||'')+'</p></div>';
    }
    $app.innerHTML = html;
    // Toggle a body class so the glassy nav inverts over dark photo heroes
    var isPhotoHero = state.route.name === 'place' && !state.route.sub;
    document.body.classList.toggle('photo-nav', !!isPhotoHero);
    setActiveNav();
    if (window.lucide) lucide.createIcons();
    // Bind behaviors AFTER render (so we query DOM in new content)
    setTimeout(bindBehaviors, 0);
    setTimeout(animateCounters, 100);
    closeMenu();
    window.scrollTo({top:0, behavior:'instant'});
  }

  function bindBehaviors(){
    // Read-more
    var rms = document.querySelectorAll('[data-rm]');
    for (var i=0; i<rms.length; i++){
      (function(rm){
        var btn = rm.querySelector('[data-rm-btn]');
        if (!btn) return;
        if (btn._bound) return;
        btn._bound = true;
        btn.addEventListener('click', function(){
          rm.classList.toggle('open');
          btn.innerHTML = iconHtml(rm.classList.contains('open') ? 'chevron-up' : 'chevron-down') + ' ' + (rm.classList.contains('open') ? t('seeLess') : t('seeMore'));
          if (window.lucide) lucide.createIcons();
        });
      })(rms[i]);
    }
    // Tabs
    var tabs = document.querySelectorAll('[data-tab-btn]');
    for (var j=0; j<tabs.length; j++){
      tabs[j].addEventListener('click', function(e){
        e.preventDefault();
        var cat = this.getAttribute('data-tab-btn');
        var container = document.getElementById('newsGrid');
        var all = document.querySelectorAll('.tab');
        for (var k=0; k<all.length; k++) all[k].classList.remove('active');
        this.classList.add('active');
        if (!container) return;
        var items;
        if (cat === 'all') items = DATA.news.concat(DATA.events);
        else if (cat === 'news') items = DATA.news;
        else if (cat === 'event') items = DATA.events;
        else items = DATA.news.concat(DATA.events);
        container.innerHTML = items.map(newsCard).join('');
        if (window.lucide) lucide.createIcons();
        observeFadeIn();
      });
    }
    // Donate amount
    var amts = document.querySelectorAll('.amount-btn');
    for (var m=0; m<amts.length; m++){
      amts[m].addEventListener('click', function(){
        for (var n=0; n<amts.length; n++) amts[n].classList.remove('active');
        this.classList.add('active');
      });
    }
    // Forms
    var forms = document.querySelectorAll('form[data-ajax]');
    for (var f=0; f<forms.length; f++){
      forms[f].addEventListener('submit', function(e){
        e.preventDefault();
        var msg = this.getAttribute('data-success') || (state.lang === 'om' ? 'Galatoomi! Ergameera.' : 'Thank you — submitted.');
        toast(msg);
        this.reset();
      });
    }
    // Fade-in observer
    observeFadeIn();

    // Gallery lightbox
    bindGallery();
  }

  // -------- Lightbox --------
  var _lb = null; // {images:[...], idx, container}
  function openLightbox(images, startIdx){
    if (!_lb){
      // create DOM once
      var box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role','dialog');
      box.setAttribute('aria-modal','true');
      box.innerHTML =
        '<button class="lb-close" aria-label="Close"><i data-lucide="x"></i></button>'
      + '<button class="lb-prev" aria-label="Previous"><i data-lucide="chevron-left"></i></button>'
      + '<button class="lb-next" aria-label="Next"><i data-lucide="chevron-right"></i></button>'
      + '<div class="lb-stage"><img class="lb-img" alt=""><div class="lb-cap"></div></div>'
      + '<div class="lb-count"></div>';
      document.body.appendChild(box);
      _lb = {container:box, images:[], idx:0, img:box.querySelector('.lb-img'), cap:box.querySelector('.lb-cap'), count:box.querySelector('.lb-count')};
      box.querySelector('.lb-close').addEventListener('click', closeLightbox);
      box.querySelector('.lb-prev').addEventListener('click', function(e){e.stopPropagation(); lbNav(-1);});
      box.querySelector('.lb-next').addEventListener('click', function(e){e.stopPropagation(); lbNav(1);});
      box.addEventListener('click', function(e){ if (e.target === box || e.target.classList.contains('lb-stage')) closeLightbox(); });
      document.addEventListener('keydown', function(e){
        if (!_lb.container.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') lbNav(-1);
        else if (e.key === 'ArrowRight') lbNav(1);
      });
    }
    _lb.images = images;
    _lb.idx = startIdx|0;
    _lb.container.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
    lbShow();
  }
  function closeLightbox(){
    if (!_lb) return;
    _lb.container.classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbNav(dir){
    if (!_lb) return;
    var n = _lb.images.length;
    _lb.idx = (_lb.idx + dir + n) % n;
    lbShow();
  }
  function lbShow(){
    if (!_lb) return;
    var src = _lb.images[_lb.idx];
    _lb.img.src = src;
    _lb.count.textContent = (_lb.idx+1) + ' / ' + _lb.images.length;
    _lb.cap.textContent = (state.lang==='om'?'Suuraa':'Photo')+' ' + (_lb.idx+1);
  }
  function bindGallery(){
    var galleries = document.querySelectorAll('[data-gallery]');
    for (var i=0; i<galleries.length; i++){
      (function(gal){
        if (gal._bound) return;
        gal._bound = true;
        var btns = gal.querySelectorAll('[data-gallery-img]');
        var imgs = [];
        for (var b=0; b<btns.length; b++){
          imgs.push(btns[b].getAttribute('data-gallery-img'));
        }
        for (var c=0; c<btns.length; c++){
          (function(btn, idx){
            btn.addEventListener('click', function(e){
              e.preventDefault();
              openLightbox(imgs, idx);
            });
          })(btns[c], c);
        }
      })(galleries[i]);
    }
  }

  function observeFadeIn(){
    var els = document.querySelectorAll('.fade-in:not(.visible)');
    if (!('IntersectionObserver' in window)){
      for (var i=0; i<els.length; i++) els[i].classList.add('visible');
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.1});
    for (var i=0; i<els.length; i++) io.observe(els[i]);
  }

  function animateCounters(){
    var els = document.querySelectorAll('[data-count]');
    els.forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;
      var start = performance.now();
      var dur = 1600;
      function step(now){
        var p = Math.min(1, (now - start)/dur);
        var eased = 1 - Math.pow(1-p, 3);
        var v = Math.floor(target * eased);
        el.textContent = fmt(v) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target) + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  // -------- Menu --------
  function openMenu(){
    var m = document.getElementById('mobileMenu');
    var b = document.getElementById('menuBtn');
    if (m) m.classList.add('open');
    if (b){ b.setAttribute('aria-expanded','true'); b.querySelector('i').setAttribute('data-lucide','x'); }
    if (window.lucide) lucide.createIcons();
  }
  function closeMenu(){
    var m = document.getElementById('mobileMenu');
    var b = document.getElementById('menuBtn');
    if (m) m.classList.remove('open');
    if (b){ b.setAttribute('aria-expanded','false'); var i=b.querySelector('i'); if(i) i.setAttribute('data-lucide','menu'); }
    if (window.lucide) lucide.createIcons();
  }
  function toggleMenu(){
    var m = document.getElementById('mobileMenu');
    if (m && m.classList.contains('open')) closeMenu(); else openMenu();
  }

  // ============================================================
  // VIEWS
  // ============================================================

  // ---- HOME ----
  function viewHome(){
    var statsHtml = DATA.stats.map(function(s, i){
      var lbl = DATA.statLabels[state.lang] ? DATA.statLabels[state.lang][s.key] : DATA.statLabels.en[s.key];
      return '<div class="stat fade-in delay-'+Math.min(i+1,4)+'">'
        + '<div class="stat-value" data-count="'+s.value+'" data-suffix="'+(s.suffix||'')+'">0'+(s.suffix||'')+'</div>'
        + '<div class="stat-label">'+(lbl?lbl.l:'')+'</div>'
        + '<div class="stat-sub">'+(lbl?lbl.s:'')+'</div>'
        + '</div>';
    }).join('');

    var featuresHtml = DATA.features.map(function(f){
      return '<div class="feature fade-in">'
        + '<div class="feature-ico">'+iconHtml(featureIconName(f.icon))+'</div>'
        + '<h3>'+pick(f.title)+'</h3>'
        + '<p>'+pick(f.text)+'</p>'
        + '</div>';
    }).join('');

    var placesHtml = DATA.places.slice(0,6).map(placeCard).join('');
    var newsHtml = DATA.news.slice(0,3).map(newsCard).join('');
    var storiesHtml = DATA.stories.slice(0,3).map(storyCard).join('');
    var peopleHtml = DATA.zonePeople.map(personCard).join('');
    var planHtml = DATA.plan.map(function(p){
      return '<div class="feature fade-in">'
        + '<div class="feature-ico">'+iconHtml(featureIconName(p.icon))+'</div>'
        + '<h3>'+pick(p.title)+'</h3>'
        + '<p>'+pick(p.text)+'</p>'
        + '</div>';
    }).join('');

    return '<div class="page">'
      // HERO
      + '<section class="hero">'
      +   '<div class="hero-img" style="background-image:'
        + 'linear-gradient(120deg, rgba(255,255,255,.86) 0%, rgba(255,255,255,.58) 38%, rgba(255,255,255,.08) 100%),'
        + 'url(\''+IMG.hero+'\');background-size:cover;background-position:center;"></div>'
      +   '<div class="container"><div class="hero-grid"><div>'
      +     '<span class="kicker hero-kicker fade-in">'+t('heroKicker')+'</span>'
      +     '<h1 class="fade-in delay-1">'+t('heroLine1')+'<br><em>'+t('heroLine2')+'</em><br>'+t('heroLine3').replace('and ','')+'</h1>'
      +     '<p class="hero-sub fade-in delay-2">'+t('heroSub')+'</p>'
      +     '<div class="hero-cta fade-in delay-2">'
      +       '<a href="#/places" class="btn btn-primary">'+iconHtml('arrow-right')+' '+t('ctaExplore')+'</a>'
      +       '<a href="#/support" class="btn btn-ghost">'+iconHtml('heart')+' '+t('ctaSupport')+'</a>'
      +     '</div>'
      +     '<div class="hero-meta fade-in delay-3">'
      +       '<span class="hero-meta-item">'+iconHtml('shield-check')+' '+t('verifiedOnly')+'</span>'
      +       '<span class="hero-meta-item">'+iconHtml('languages')+' Afaan Oromoo / English</span>'
      +       '<span class="hero-meta-item">'+iconHtml('wifi-off')+' '+t('offline')+'</span>'
      +     '</div>'
      +   '</div></div>'
      +   '<div class="stats fade-in delay-3">'+statsHtml+'</div>'
      +   '</div></section>'

      // INTRO
      + '<section class="section"><div class="container"><div class="twocol">'
      +   '<div class="text-col fade-in">'
      +     '<span class="kicker">'+t('introKicker')+'</span>'
      +     '<h2>'+t('introTitle')+'</h2>'
      +     '<p>'+t('introP1')+'</p>'
      +     '<div class="readmore" data-rm>'
      +       '<div class="truncated"><p>'+truncate(t('introP2'), 220)+'</p><div class="fade-out"></div></div>'
      +       '<div class="full"><p>'+t('introP2')+'</p><p>'+t('introP3')+'</p></div>'
      +       '<button class="readmore-btn" data-rm-btn>'+iconHtml('chevron-down')+' '+t('seeMore')+'</button>'
      +     '</div>'
      +   '</div>'
      +   '<div class="img-col fade-in delay-1"><div class="photo">'
      +     '<div style="width:100%;height:100%;background-size:cover;background-position:center;'+imgBg(IMG.coffee2,'Qellem')+'"></div>'
      +   '</div></div>'
      + '</div></div></section>'

      // FEATURES
      + '<section class="section" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('featuresKicker')+'</span>'
      +     '<h2>'+t('featuresTitle')+'</h2><p>'+t('featuresSub')+'</p></div>'
      +   '<div class="features">'+featuresHtml+'</div>'
      + '</div></section>'

      // PLACES
      + '<section class="section"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('placesKicker')+'</span>'
      +     '<h2>'+t('placesTitle')+'</h2><p>'+t('placesSub')+'</p></div>'
      +   '<div class="places-grid">'+placesHtml+'</div>'
      +   '<div class="text-center mt-8 fade-in"><a href="#/places" class="btn btn-ghost">'+iconHtml('grid-3x3')+' '+
          (state.lang==='om'?'Aanaalee hunda ilaali':'View all woredas & towns')+'</a></div>'
      + '</div></section>'

      // NEWS
      + '<section class="section" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('newsKicker')+'</span>'
      +     '<h2>'+t('newsTitle')+'</h2><p>'+t('newsSub')+'</p></div>'
      +   '<div class="news-grid">'+newsHtml+'</div>'
      +   '<div class="text-center mt-8 fade-in"><a href="#/news" class="btn btn-ghost">'+iconHtml('newspaper')+' '+
          (state.lang==='om'?'Oduu hunda ilaali':'All news & events')+'</a></div>'
      + '</div></section>'

      // STORIES
      + '<section class="section"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('storiesKicker')+'</span>'
      +     '<h2>'+t('storiesTitle')+'</h2><p>'+t('storiesSub')+'</p></div>'
      +   storiesHtml
      +   '<div class="text-center mt-6 fade-in"><a href="#/stories" class="btn btn-ghost">'+iconHtml('book-open')+' '+
          (state.lang==='om'?'Seenota hunda ilaali':'See all stories')+'</a></div>'
      + '</div></section>'

      // NOTABLE PEOPLE
      + '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('notableKicker')+'</span><h2>'+t('notableTitle')+'</h2></div>'
      +   '<div class="people-grid">'+peopleHtml+'</div>'
      + '</div></section>'

      // PLAN VISIT
      + '<section class="section"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('planKicker')+'</span>'
      +     '<h2>'+t('planTitle')+'</h2><p>'+t('planSub')+'</p></div>'
      +   '<div class="grid-3">'+planHtml+'</div>'
      + '</div></section>'

      // TABLE
      + '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('tableKicker')+'</span><h2>'+t('tableTitle')+'</h2>'
      +     '<p>'+t('tableSub')+'</p></div>'
      +   '<div class="fade-in">'+renderGlanceTable()+'</div>'
      + '</div></section>'

      // MAP
      + '<section class="section"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('mapKicker')+'</span><h2>'+t('mapTitle')+'</h2><p>'+t('mapSub')+'</p></div>'
      +   '<div class="map-wrap fade-in">'+renderMapSvg()+'</div>'
      + '</div></section>'
      // Sponsors marquee
      + '<section class="sponsors-section"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('sponsorsKicker')+'</span>'
      +     '<h2>'+t('sponsorsTitle')+'</h2><p>'+t('sponsorsSub')+'</p></div>'
      +   '<div class="marquee fade-in"><div class="marquee-track">'
      +     DATA.sponsors.concat(DATA.sponsors).map(function(s){
            var color = s.tint === 'gold' ? 'var(--gold-500)' : 'var(--brand-700)';
            var bg = s.tint === 'gold' ? 'var(--gold-100)' : 'var(--brand-100)';
            return '<div class="sponsor-pill">'
              + '<span class="sponsor-mark" style="background:'+bg+';color:'+color+';">'+s.initials+'</span>'
              + '<span class="sponsor-name">'+pick(s.name)+'</span>'
              + '</div>';
          }).join('')
      +   '</div></div>'
      + '</div></section>'

      // CTA
      + '<section class="section tight"><div class="container">'
      +   '<div class="support-hero fade-in" style="padding:48px;">'
      +     '<span class="kicker" style="color:var(--gold-300);">'+t('supportTitle')+'</span>'
      +     '<h1 style="font-size:clamp(28px,3.4vw,40px);">'+t('supportHeroTitle')+'</h1>'
      +     '<p>'+t('supportHeroSub')+'</p>'
      +     '<a href="#/support" class="btn btn-gold mt-4">'+iconHtml('heart')+' '+t('ctaDonate')+'</a>'
      +   '</div>'
      + '</div></section>'
      + '</div>';
  }

  function featureIconName(n){
    var map = {
      'coffee':'coffee','tree-pine':'trees','layers':'layers','droplet':'droplets',
      'users':'users','landmark':'landmark','route':'route','mountain-snow':'mountain-snow',
      'calendar-days':'calendar-days','car':'car','compass':'compass',
      'hand-heart':'hand-heart','shopping-bag':'shopping-bag','wheat':'wheat','flag':'flag',
      'plane':'plane'
    };
    return map[n] || 'star';
  }

  function truncate(s, n){
    if (!s) return '';
    s = String(s);
    if (s.length <= n) return s;
    return s.slice(0,n).replace(/\s+\S*$/, '') + '…';
  }

  // Place card
  function placeCard(p){
    var badgesHtml = p.badges.map(function(b){
      return '<span class="chip"><i data-lucide="'+featureIconName(b.icon)+'" style="width:12px;height:12px;"></i>'+pick(b.l)+'</span>';
    }).join('');
    var bg = p.img ? imgBg(p.img, pick(p.name)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
    return '<a class="place-card fade-in" href="#/place/'+p.slug+'">'
      + '<div class="place-media"><div style="position:absolute;inset:0;'+bg+'"></div>'
      +   '<div class="place-badges">'+badgesHtml+'</div>'
      +   '<span class="place-arrow"><i data-lucide="arrow-right"></i></span>'
      + '</div>'
      + '<div class="place-body">'
      +   '<h3 class="place-title">'+pick(p.name)+'</h3>'
      +   '<p class="place-sub">'+pick(p.tagline)+'</p>'
      +   '<div class="place-meta">'
      +     '<span><i data-lucide="users"></i>'+p.pop+'</span>'
      +     '<span><i data-lucide="mountain-snow"></i>'+pick(p.elev)+'</span>'
      +     (p.key ? '<span><i data-lucide="coffee"></i>'+pick(p.key)+'</span>' : '')
      +   '</div>'
      + '</div></a>';
  }

  function newsCard(n){
    var bg = n.img ? imgBg(n.img, pick(n.title)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
    return '<article class="news-card fade-in">'
      + '<a href="#/article/'+(n.type==='event'?'event':'news')+'/'+n.id+'" class="news-media" style="position:relative;display:block;color:inherit;">'
      +   '<div style="position:absolute;inset:0;'+bg+'"></div>'
      +   '<span class="news-cat">'+pick(n.cat)+'</span>'
      + '</a>'
      + '<div class="news-body">'
      +   '<div class="news-date">'+fmtDate(n.date)+' · '+pick(n.place)+'</div>'
      +   '<h3 class="news-title">'+pick(n.title)+'</h3>'
      +   '<p class="news-excerpt">'+pick(n.excerpt)+'</p>'
      +   '<a class="news-more" href="#/article/'+(n.type==='event'?'event':'news')+'/'+n.id+'">'+t('readMore')+' <i data-lucide="arrow-right"></i></a>'
      + '</div></article>';
  }

  function storyCard(s){
    var bg = s.img ? imgBg(s.img, pick(s.title)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
    return '<article class="story-card fade-in">'
      + '<div class="story-media"><div style="width:100%;height:100%;'+bg+'"></div></div>'
      + '<div>'
      +   '<div class="story-meta"><i data-lucide="calendar-days" style="width:13px;height:13px;"></i> '+fmtDate(s.date)
      +     ' <span style="margin:0 6px;opacity:.4;">·</span> <i data-lucide="map-pin" style="width:13px;height:13px;"></i> '+pick(s.place)+'</div>'
      +   '<h3 class="story-title">'+pick(s.title)+'</h3>'
      +   '<p class="story-excerpt">'+pick(s.excerpt)+'</p>'
      +   '<a class="btn btn-sm btn-ghost" href="#/article/story/'+s.id+'">'+iconHtml('book-open')+' '+t('readMore')+'</a>'
      + '</div></article>';
  }

  function personCard(p){
    var avatarHtml;
    if (p.img){
      avatarHtml = '<div class="person-avatar person-photo" style="background-image:url(\''+p.img+'\');"></div>';
    } else {
      var initials = pick(p.name).split(/\s+/).filter(function(w){return w.length>1;}).map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();
      avatarHtml = '<div class="person-avatar">'+initials+'</div>';
    }
    var cardInner = avatarHtml
      + '<div class="person-body">'
      +   '<div class="person-role">'+p.years+'</div>'
      +   '<h4 class="person-name">'+pick(p.name)+'</h4>'
      +   '<p class="person-bio">'+pick(p.role)+'</p>'
      +   (p.bio ? '<p class="person-bio person-bio-more">'+pick(p.bio)+'</p>' : '')
      +   (p.link ? '<span class="person-cta">'+iconHtml('arrow-right')+' '+(state.lang==='om'?'Fuula isaa ilaali':'View page')+'</span>' : '')
      + '</div>';
    if (p.link){
      return '<a class="person-card person-card-link fade-in" href="#'+p.link+'">'+cardInner+'</a>';
    }
    return '<div class="person-card fade-in">'+cardInner+'</div>';
  }

  function renderGlanceTable(){
    var rows = DATA.glance.map(function(r){
      var note = r.note ? ('<td class="note">'+pick(r.note)+'</td>') : '<td></td>';
      return '<tr><td>'+pick(r.label)+'</td><td class="val">'+pick(r.val)+'</td>'+note+'</tr>';
    }).join('');
    return '<table class="pretty-table"><thead><tr>'
      + '<th style="width:35%;">'+(state.lang==='om'?'Qabxii':'Indicator')+'</th>'
      + '<th>'+(state.lang==='om'?'Galmaa':'Value')+'</th>'
      + '<th>'+(state.lang==='om'?'Yaadni':'Note')+'</th></tr></thead>'
      + '<tbody>'+rows+'</tbody></table>';
  }

  function renderMapSvg(){
    // Stylized SVG map with pins placed by index in a circular layout representing zone
    var places = DATA.places;
    var cx = 400, cy = 260, rx = 300, ry = 180;
    var pins = places.map(function(p, i){
      // Position based roughly on geography: N/S/E/W offsets
      var positions = {
        'dembi-dollo':   [400,245],
        'sayo':          [360,280],
        'hawa-gelan':    [430,300],
        'dale-sadi':     [490,330],
        'dale-wabera':   [480,270],
        'gawo-kebe':     [430,210],
        'yemalogi-welel':[370,180],
        'anfilo':        [270,260],
        'gidami':        [220,210],
        'lalo-kile':     [500,215],
        'sadi-chanka':   [470,240],
        'jimma-horo':    [320,170]
      };
      var pos = positions[p.slug] || [cx + rx*Math.cos(i/places.length*Math.PI*2 - Math.PI/2)*0.8, cy + ry*Math.sin(i/places.length*Math.PI*2 - Math.PI/2)*0.8];
      return {p:p, x:pos[0], y:pos[1]};
    });
    var pinsHtml = pins.map(function(o){
      var isCap = o.p.slug === 'dembi-dollo';
      return '<a class="map-pin" xlink:href="#/place/'+o.p.slug+'" href="#/place/'+o.p.slug+'">'
        + (isCap ? '<circle class="pin-pulse" cx="'+o.x+'" cy="'+o.y+'" r="6" style="fill:var(--gold-500);"></circle>' : '')
        + '<circle class="pin-dot" cx="'+o.x+'" cy="'+o.y+'" r="'+(isCap?9:6)+'" style="'+(isCap?'fill:var(--gold-500);':'')+'"></circle>'
        + '<text x="'+(o.x+12)+'" y="'+(o.y+4)+'">'+pick(o.p.name)+'</text>'
        + '</a>';
    }).join('');
    return '<svg class="map-svg" viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Kellem Wollega map" style="min-height:380px;">'
      + '<defs><linearGradient id="zoneFill" x1="0" x2="1" y1="0" y2="1">'
      +   '<stop offset="0%" stop-color="var(--brand-100)"/><stop offset="100%" stop-color="var(--brand-200)"/></linearGradient></defs>'
      + '<path d="M190,150 C270,100 430,95 550,130 C650,160 690,240 660,320 C630,400 540,430 420,430 C290,430 170,390 140,310 C110,230 130,180 190,150 Z" fill="url(#zoneFill)" stroke="var(--brand-500)" stroke-width="2" opacity=".75"/>'
      + '<path d="M220,230 C300,210 370,270 460,240 C530,220 580,280 630,310" fill="none" stroke="var(--brand-400)" stroke-width="1.6" stroke-dasharray="4 5" opacity=".65"/>'
      + '<path d="M200,320 C290,300 360,350 450,330 C530,310 590,350 640,340" fill="none" stroke="var(--brand-400)" stroke-width="1.6" stroke-dasharray="3 4" opacity=".55"/>'
      + '<text x="400" y="275" text-anchor="middle" font-family="var(--serif)" font-size="20" font-weight="600" fill="var(--brand-700)" opacity=".55">'
      +   (state.lang==='om'?'Qeellam Wallaggaa':'Kellem Wollega')+'</text>'
      + pinsHtml
      + '</svg>';
  }

  // ---- PLACES LIST ----
  function viewPlaces(){
    var html = DATA.places.map(placeCard).join('');
    return '<div class="page">'
      + '<section class="place-hero"><div class="place-hero-bg"></div><div class="container">'
      +   '<div class="breadcrumb fade-in"><a href="#/"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <span>'+t('navPlaces')+'</span></div>'
      +   '<h1 class="fade-in delay-1">'+t('placesTitle')+'</h1>'
      +   '<p class="tagline fade-in delay-2">'+t('placesSub')+'</p>'
      + '</div></section>'
      + '<section class="section tight"><div class="container">'
      +   '<div class="places-grid">'+html+'</div>'
      + '</div></section></div>';
  }

  // ---- SINGLE PLACE ----
  function viewPlace(slug, sub){
    var p = DATA.places.find(function(x){return x.slug===slug;});
    if (!p) return view404();

    // If sub-location is requested (match by EN or OM name)
    if (sub){
      var subDecoded = decodeURIComponent(sub);
      var subItem = (p.placesList||[]).find(function(pl){ return pick(pl.name) === subDecoded || pl.name.om === subDecoded || pl.name.en === subDecoded; });
      if (subItem) return viewSubPlace(p, subItem);
    }

    var typeLabel = p.type === 'town' ? t('capitalLabel') : t('woredaLabel');
    var badgesHtml = p.badges.map(function(b){
      return '<span class="chip"><i data-lucide="'+featureIconName(b.icon)+'" style="width:12px;height:12px;"></i>'+pick(b.l)+'</span>';
    }).join('');

    // ---- About paragraphs (local introduction) ----
    var aboutHtml = (p.about||[]).map(function(para){ return '<p>'+pick(para)+'</p>'; }).join('');

    // ---- At a glance table (reference style) ----
    var glanceRows = '';
    function glanceRow(label, val, note){
      return '<tr><td>'+label+'</td><td class="val">'+val+'</td>'+(note?'<td class="note">'+note+'</td>':'<td></td>')+'</tr>';
    }
    glanceRows += glanceRow(t('glanceType'), (p.type === 'town' ? t('townLabel') : t('woredaLabel')) + (p.type === 'town' ? ' · ' + t('capitalLabel') : ''));
    glanceRows += glanceRow(t('glanceZone'), state.lang === 'om' ? 'Qeellam Wallaggaa' : 'Kellem Wollega');
    glanceRows += glanceRow(t('glanceAltitude'), pick(p.elev));
    glanceRows += glanceRow(t('glancePopulation'), p.pop);
    if (p.key) glanceRows += glanceRow(t('glanceKeyRole'), pick(p.key));
    if (p.cap && p.cap !== '—') glanceRows += glanceRow(t('capitalTown'), pick(p.cap));
    glanceRows += glanceRow(t('glanceLanguages'), state.lang === 'om' ? 'Afaan Oromoo, Amaariffa' : 'Afaan Oromoo, Amharic');
    glanceRows += glanceRow(t('glanceAccess'), state.lang === 'om' ? 'Karaa asfaaltii Finfinnee–Dambi Doolloo' : 'Finfinnee–Dembi Dolo asphalt road');
    glanceRows += glanceRow(t('glanceMarketDay'), state.lang === 'om' ? 'Torban torbaniin' : 'Weekly markets');
    // Append extra facts from p.facts
    (p.facts||[]).forEach(function(r){
      glanceRows += glanceRow(pick(r.l), pick(r.v), r.n ? pick(r.n) : null);
    });

    // ---- Gallery (5-image hero strip) ----
    var galleryHtml = '';
    if (p.gallery && p.gallery.length){
      var items = p.gallery.map(function(src, idx){
        var cap = '';
        return '<button class="g-item" data-gallery-img="'+src+'" data-gallery-idx="'+idx+'" aria-label="Open photo '+(idx+1)+'"><div style="width:100%;height:100%;'+imgBg(src,'')+'"></div>'+(cap?'<span class="g-cap">'+cap+'</span>':'')+'</button>';
      }).join('');
      galleryHtml = '<div class="place-gallery-wrap"><div class="gallery place-gallery" data-gallery>'+items+'</div></div>';
    }

    // ---- Places to discover (landmarks/cards grid) ----
    var placesListHtml = '';
    if (p.placesList && p.placesList.length){
      placesListHtml = '<div class="news-grid">'+p.placesList.map(function(pl){
        var bg = pl.img ? imgBg(pl.img, pick(pl.name)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
        return '<a class="news-card fade-in" href="#/place/'+p.slug+'/'+encodeURIComponent(pick(pl.name))+'">'
          + '<div class="news-media"><div style="position:absolute;inset:0;'+bg+'"></div><span class="news-cat">'+pick(pl.type)+'</span></div>'
          + '<div class="news-body"><h3 class="news-title">'+pick(pl.name)+'</h3>'
          + '<p class="news-excerpt">'+pick(pl.short)+'</p>'
          + '<span class="news-more">'+t('seeMore')+' <i data-lucide="arrow-right"></i></span>'
          + '</div></a>';
      }).join('')+'</div>';
    }

    // ---- Notable people ----
    var peopleHtml = '';
    if (p.notable && p.notable.length){
      peopleHtml = '<div class="people-grid">'+p.notable.map(function(np){
        return personCard(np);
      }).join('')+'</div>';
    }

    // ---- Culture grid (9 cards like reference) ----
    var cultureItems = [
      {icon:'utensils', k:'cultureFood', d:'cultureFoodD'},
      {icon:'shirt',     k:'cultureClothing', d:'cultureClothingD'},
      {icon:'music',     k:'cultureMusic', d:'cultureMusicD'},
      {icon:'music-2',   k:'cultureDance', d:'cultureDanceD'},
      {icon:'party-popper', k:'cultureFestivals', d:'cultureFestivalsD'},
      {icon:'flower-2',  k:'cultureCeremonies', d:'cultureCeremoniesD'},
      {icon:'palette',   k:'cultureArts', d:'cultureArtsD'},
      {icon:'handshake', k:'cultureTraditions', d:'cultureTraditionsD'},
      {icon:'book-open', k:'cultureFolklore', d:'cultureFolkloreD'}
    ];
    var cultureHtml = '<div class="culture-grid">'+cultureItems.map(function(c, i){
      return '<div class="culture-card fade-in'+(i%3===0?'':'')+'">'
        + '<div class="feature-ico">'+iconHtml(c.icon)+'</div>'
        + '<h4>'+t(c.k)+'</h4>'
        + '<p>'+t(c.d)+'</p>'
        + '</div>';
    }).join('')+'</div>';

    // ---- Keep exploring (other places, excluding current) ----
    var others = DATA.places.filter(function(x){return x.slug !== p.slug;}).slice(0,3);
    var moreHtml = '<div class="news-grid">'+others.map(function(o){
      var bg = o.img ? imgBg(o.img, pick(o.name)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
      return '<a class="news-card fade-in" href="#/place/'+o.slug+'">'
        + '<div class="news-media"><div style="position:absolute;inset:0;'+bg+'"></div>'
        + '<span class="news-cat">'+(o.type === 'town' ? t('capitalLabel') : t('woredaLabel'))+'</span></div>'
        + '<div class="news-body"><h3 class="news-title">'+pick(o.name)+'</h3>'
        + '<p class="news-excerpt">'+pick(o.tagline)+'</p>'
        + '<span class="news-more">'+t('explore')+' <i data-lucide="arrow-right"></i></span>'
        + '</div></a>';
    }).join('')+'</div>';

    // ---- Page construction following reference section order ----
    var heroBgStyle = 'background-image:url(\'' + (p.img||IMG.hero) + '\');';
    return '<div class="page">'
      // 1. HERO (with photo background, breadcrumb, title, tagline, quick stats)
      + '<section class="place-hero place-hero-photo">'
      +   '<div class="place-hero-bg" style="'+heroBgStyle+'"></div>'
      +   '<div class="container">'
      +     '<div class="breadcrumb fade-in" style="color:#fff;"><a href="#/" style="color:#cfe8dc;"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;color:rgba(255,255,255,.6);"></i> <a href="#/places" style="color:#cfe8dc;">'+t('navPlaces')+'</a> <i data-lucide="chevron-right" style="width:12px;height:12px;color:rgba(255,255,255,.6);"></i> <span style="color:#fff;">'+pick(p.name)+'</span></div>'
      +     '<div class="place-hero-grid"><div>'
      +       '<span class="kicker place-type-kicker fade-in" style="color:var(--gold-300);">'+typeLabel+'</span>'
      +       '<h1 class="place-hero-title fade-in delay-1">'+pick(p.name)+'</h1>'
      +       '<p class="tagline place-hero-tagline fade-in delay-2">'+pick(p.tagline)+'</p>'
      +       '<div class="chips fade-in delay-2" style="margin-top:16px;">'+badgesHtml+'</div>'
      +     '</div>'
      +     '<div class="place-quickfacts place-quickfacts-hero fade-in delay-2">'
      +       '<div class="qf qf-hero"><div class="qf-label">'+t('elevation')+'</div><div class="qf-val" style="font-size:16px;">'+pick(p.elev)+'</div></div>'
      +       '<div class="qf qf-hero"><div class="qf-label">'+t('population')+'</div><div class="qf-val">'+p.pop+'</div></div>'
      +       (p.key ? '<div class="qf qf-hero"><div class="qf-label">'+t('keyProduct')+'</div><div class="qf-val" style="font-size:15px;">'+pick(p.key)+'</div></div>' : '')
      +       (p.cap && p.cap !== '—' ? '<div class="qf qf-hero"><div class="qf-label">'+t('capitalTown')+'</div><div class="qf-val" style="font-size:15px;">'+pick(p.cap)+'</div></div>' : '')
      +     '</div></div>'
      +   '</div>'
      + '</section>'

      // 2. LOCAL INTRO
      + '<section class="section"><div class="container" style="max-width:960px;">'
      +   '<span class="kicker fade-in">'+t('localIntro')+'</span>'
      +   '<h2 class="fade-in delay-1" style="font-size:clamp(28px,3.6vw,44px);">'+t('knowBeyond').replace('{name}',pick(p.name))+'</h2>'
      +   '<div class="fade-in delay-2 place-intro">'+aboutHtml+'</div>'
      + '</div></section>'

      // 3. GALLERY (immediately after intro as reference shows photos)
      + (galleryHtml ? '<section class="section tight" style="padding-top:0;"><div class="container">'
        + '<div class="section-head left fade-in"><span class="kicker">'+t('gallery')+'</span><h2>'+(state.lang==='om'?'Suuraalee':'Gallery')+'</h2><p class="muted" style="margin:0;">'+pick(p.name)+'.</p></div>'
        + galleryHtml+'</div></section>' : '')

      // 4. AT A GLANCE (pretty table)
      + '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head left fade-in"><span class="kicker">'+(state.lang==='om'?'Gabaabina':'Quick facts')+'</span><h2>'+t('atAGlance').replace('{name}',pick(p.name))+'</h2></div>'
      +   '<div class="fade-in"><table class="pretty-table"><thead><tr><th style="width:35%;">'+(state.lang==='om'?'Qabxii':'Indicator')+'</th><th>'+(state.lang==='om'?'Galmaa':'Value')+'</th><th>'+(state.lang==='om'?'Yaadni':'Note')+'</th></tr></thead><tbody>'+glanceRows+'</tbody></table></div>'
      + '</div></section>'

      // 5. HISTORY & NAMING (uses the first about paragraph or tagline)
      + '<section class="section"><div class="container"><div class="twocol">'
      +   '<div class="img-col fade-in">'
      +     '<div class="photo"><div style="width:100%;height:100%;'+imgBg(p.img||IMG.hills1,'')+'"></div></div>'
      +   '</div>'
      +   '<div class="text-col fade-in delay-1"><span class="kicker">'+t('historyNaming')+'</span>'
      +     '<h2>'+t('howGotName').replace('{name}',pick(p.name))+'</h2>'
      +     '<p>'+pick(p.tagline)+'</p>'
      +     ((p.about||[]).length >= 2 ? '<p>'+pick(p.about[1])+'</p>' : '')
      +     '<a href="#/history" class="btn btn-ghost mt-2">'+iconHtml('book-open')+' '+(state.lang==='om'?'Seenaa guutuu ilaali':'See full history')+'</a>'
      +   '</div>'
      + '</div></div></section>'

      // 6. PLACES TO DISCOVER (cards)
      + (placesListHtml ? '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
        + '<div class="section-head left fade-in"><span class="kicker">'+(state.lang==='om'?'Bakkaalee':'Places')+'</span><h2>'+t('places')+'</h2><p class="muted" style="margin:0;">'+(state.lang==='om'?'Daawwannaa, bakka seenaa fi taateewwan.':'Attractions, landmarks and points of interest.')+'</p></div>'
        + placesListHtml+'</div></section>' : '')

      // 7. CULTURE
      + '<section class="section"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+(state.lang==='om'?'Aadaa':'Culture')+'</span>'
      +     '<h2>'+t('cultureHeading')+'</h2><p>'+t('cultureSub')+'</p></div>'
      +   cultureHtml+'</div></section>'

      // 8. NOTABLE PEOPLE
      + (peopleHtml ? '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
        + '<div class="section-head left fade-in"><span class="kicker">'+t('people')+'</span><h2>'+t('notableTitle')+'</h2>'
        + '<p class="muted" style="margin:0;">'+(state.lang==='om'?'Namoota beekamoo fi gahee isaanii.':'Notable figures and their contributions.')+'</p></div>'
        + peopleHtml+'</div></section>' : '')

      // 9. LOCATION / MAP
      + '<section class="section tight"><div class="container">'
      +   '<div class="section-head left fade-in"><span class="kicker">'+t('location')+'</span><h2>'+t('location')+'</h2></div>'
      +   '<div class="osm-wrap fade-in"><iframe title="map" style="width:100%;height:420px;border:0;display:block;" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox='+(p.coords[1]-0.3)+'%2C'+(p.coords[0]-0.2)+'%2C'+(p.coords[1]+0.3)+'%2C'+(p.coords[0]+0.2)+'&amp;layer=mapnik&amp;marker='+p.coords[0]+'%2C'+p.coords[1]+'"></iframe></div>'
      + '</div></section>'

      // 10. KEEP EXPLORING
      + '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head fade-in"><span class="kicker">'+t('keepExploring')+'</span>'
      +     '<h2>'+t('moreQellem')+'</h2></div>'
      +   moreHtml+'</div></section>'

      // 11. CONTRIBUTE CTA
      + '<section class="section tight"><div class="container">'
      +   '<div class="support-hero fade-in" style="padding:48px;">'
      +     '<span class="kicker" style="color:var(--gold-300);">'+t('helpBuild')+'</span>'
      +     '<h1 style="font-size:clamp(26px,3.2vw,38px);">'+t('helpBuildTitle')+'</h1>'
      +     '<p>'+t('helpBuildSub')+'</p>'
      +     '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px;">'
      +     '<a href="#/contribute" class="btn btn-gold">'+iconHtml('send')+' '+(state.lang==='om'?'Seenaa ergi':'Share a story')+'</a>'
      +     '<a href="#/support" class="btn" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.25);">'+iconHtml('heart')+' '+t('supportTitle')+'</a>'
      +     '</div>'
      +   '</div></div></section>'
      + '</div>';
  }

  // ---- SUB-PLACE (individual point of interest) ----
  function viewSubPlace(parent, item){
    var bg = item.img ? imgBg(item.img, pick(item.name)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
    return '<div class="page"><section class="section tight"><div class="container" style="max-width:820px;">'
      + '<div class="breadcrumb fade-in"><a href="#/"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <a href="#/places">'+t('navPlaces')+'</a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <a href="#/place/'+parent.slug+'">'+pick(parent.name)+'</a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <span>'+pick(item.name)+'</span></div>'
      + '<span class="chip fade-in">'+pick(item.type)+'</span>'
      + '<h1 class="fade-in delay-1" style="margin-top:14px;">'+pick(item.name)+'</h1>'
      + '<div class="article-hero fade-in delay-1"><div style="width:100%;height:100%;'+bg+'"></div></div>'
      + '<div class="article fade-in delay-2">'
      +   '<p style="font-size:18px;color:var(--ink-700);">'+pick(item.short)+'</p>'
      +   '<p>'+(item.description ? pick(item.description) : pick(item.short))+'</p>'
      +   (item.tips ? '<blockquote>'+pick(item.tips)+'</blockquote>' : '')
      +   '<p class="muted" style="font-size:13.5px;">'+(state.lang==='om'?'Ragaa waajjira godinaa irraa.':'From the zone profile records.')+'</p>'
      +   '<a href="#/place/'+parent.slug+'" class="btn btn-ghost">'+iconHtml('arrow-left')+' '+pick(parent.name)+' '+(state.lang==='om'?'itti deebi\'i':'back')+'</a>'
      + '</div>'
    + '</div></section></div>';
  }

  // ---- NEWS LISTING ----
  function viewNews(){
    return '<div class="page">'
      + '<section class="place-hero"><div class="place-hero-bg"></div><div class="container">'
      +   '<div class="breadcrumb fade-in"><a href="#/"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <span>'+t('navNews')+'</span></div>'
      +   '<h1 class="fade-in delay-1">'+t('newsTitle')+'</h1>'
      +   '<p class="tagline fade-in delay-2">'+t('newsSub')+'</p>'
      + '</div></section>'
      + '<section class="section"><div class="container">'
      +   '<div class="tabs fade-in">'
      +     '<button class="tab active" data-tab-btn="all">'+t('newsAll')+'</button>'
      +     '<button class="tab" data-tab-btn="news">'+t('tabNews')+'</button>'
      +     '<button class="tab" data-tab-btn="event">'+t('tabEvents')+'</button>'
      +   '</div>'
      +   '<div class="news-grid" id="newsGrid">'+DATA.news.concat(DATA.events).map(newsCard).join('')+'</div>'
      + '</div></section></div>';
  }

  // ---- STORIES LISTING ----
  function viewStories(){
    return '<div class="page">'
      + '<section class="place-hero"><div class="place-hero-bg"></div><div class="container">'
      +   '<div class="breadcrumb fade-in"><a href="#/"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <span>'+t('navStories')+'</span></div>'
      +   '<h1 class="fade-in delay-1">'+t('storiesTitle')+'</h1>'
      +   '<p class="tagline fade-in delay-2">'+t('storiesSub')+'</p>'
      + '</div></section>'
      + '<section class="section"><div class="container">'+DATA.stories.map(storyCard).join('')+'</div></section></div>';
  }

  // ---- HISTORY ----
  function viewHistory(){
    var timelineHtml = DATA.timeline.map(function(ti){
      return '<div class="tl-item"><div class="tl-year">'+ti.year+'</div><div class="tl-title">'+pick(ti.t)+'</div><p class="tl-text">'+pick(ti.txt)+'</p></div>';
    }).join('');
    var peopleHtml = DATA.zonePeople.map(personCard).join('');
    return '<div class="page">'
      + '<section class="place-hero"><div class="place-hero-bg"></div><div class="container">'
      +   '<div class="breadcrumb fade-in"><a href="#/"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <span>'+t('navHistory')+'</span></div>'
      +   '<h1 class="fade-in delay-1">'+t('historyTitle')+'</h1>'
      +   '<p class="tagline fade-in delay-2">'+t('historySub')+'</p>'
      + '</div></section>'
      + '<section class="section"><div class="container"><div class="twocol">'
      +   '<div class="text-col fade-in">'
      +     '<span class="kicker">'+t('historyKicker')+'</span>'
      +     '<h2>'+pick({om:'Sayyoo irraa hamma har\'aa',en:'From Sayyoo to today'})+'</h2>'
      +     '<p>'+t('historyP1')+'</p>'
      +     '<p>'+t('historyP2')+'</p>'
      +     '<p>'+t('historyP3')+'</p>'
      +   '</div>'
      +   '<div class="img-col fade-in delay-1"><div class="photo"><div style="width:100%;height:100%;'+imgBg(IMG.valley,'')+'"></div></div></div>'
      + '</div></div></section>'
      + '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head left fade-in"><span class="kicker">'+t('timelineHeading')+'</span><h2>'+t('timelineHeading')+'</h2></div>'
      +   '<div class="timeline fade-in">'+timelineHtml+'</div>'
      + '</div></section>'
      + '<section class="section tight"><div class="container">'
      +   '<div class="section-head left fade-in"><span class="kicker">'+t('notableKicker')+'</span><h2>'+t('zonePeopleHeading')+'</h2></div>'
      +   '<div class="people-grid">'+peopleHtml+'</div>'
      + '</div></section></div>';
  }

  // ---- SUPPORT ----
  function viewSupport(){
    var amounts = [100,250,500,1000];
    var amountHtml = amounts.map(function(a, i){
      return '<button class="amount-btn '+(i===1?'active':'')+'" type="button">'+a+' <small style="font-size:11px;opacity:.7;">ETB</small></button>';
    }).join('');
    return '<div class="page">'
      + '<section class="section tight"><div class="container">'
      +   '<div class="support-hero fade-in">'
      +     '<span class="kicker" style="color:var(--gold-300);">'+t('supportTitle')+'</span>'
      +     '<h1>'+t('supportHeroTitle')+'</h1>'
      +     '<p>'+t('supportHeroSub')+'</p>'
      +   '</div>'
      +   '<div class="grid-2">'
      +     '<div class="donate-card fade-in">'
      +       '<span class="chip gold">'+iconHtml('sparkles')+' '+t('supportComing')+' — Chapa</span>'
      +       '<h2 class="mt-4">'+t('ctaDonate')+'</h2>'
      +       '<p class="muted">'+(state.lang==='om'?'Gumaachi kee odeeffannoo fi suuraa sirrii jabeessuuf oola.':'Contributions fund accurate content and photography.')+'</p>'
      +       '<div class="amount-grid">'+amountHtml+'</div>'
      +       '<input type="number" class="amount-input" placeholder="'+(state.lang==='om'?'Hamuma biraa galchi':'Custom amount')+'">'
      +       '<button class="btn btn-gold btn-lg mt-4" style="width:100%;justify-content:center;" onclick="toast(\''+(state.lang==='om'?'Chapa dhiyootti — yeroo ammaa hin hojjenne.':'Chapa coming soon — not yet live.')+'\')">'+iconHtml('heart')+' '+(state.lang==='om'?'Kaffaltii eegale':'Continue to donate')+'</button>'
      +       '<p class="muted mt-4" style="font-size:12.5px;">'+(state.lang==='om'?'Galmeen hin barbaachisu. Kaffaltiin Chapa yeroo qophaa\'u eegala.':'No account needed. Payments activate when Chapa is ready.')+'</p>'
      +     '</div>'
      +     '<div class="fade-in delay-1">'
      +       '<span class="kicker">'+t('impactTitle')+'</span>'
      +       '<h2>'+t('allocTitle')+'</h2>'
      +       '<div class="allocation">'
      +         '<div class="alloc-item"><div class="alloc-pct">40%</div><div class="alloc-title">'+t('allocResearch')+'</div><p class="alloc-desc">'+t('allocResearchD')+'</p></div>'
      +         '<div class="alloc-item"><div class="alloc-pct">25%</div><div class="alloc-title">'+t('allocPhoto')+'</div><p class="alloc-desc">'+t('allocPhotoD')+'</p></div>'
      +         '<div class="alloc-item"><div class="alloc-pct">15%</div><div class="alloc-title">'+t('allocTrans')+'</div><p class="alloc-desc">'+t('allocTransD')+'</p></div>'
      +       '<div class="alloc-item"><div class="alloc-pct">20%</div><div class="alloc-title">'+t('allocTech')+'</div><p class="alloc-desc">'+t('allocTechD')+'</p></div>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      + '</div></section>'

      // Wall of supporters
      + '<section class="section tight" style="background:var(--paper-2);"><div class="container">'
      +   '<div class="section-head left fade-in"><span class="kicker">'+t('supportTitle')+'</span><h2>'+t('supportersHeading')+'</h2><p>'+t('supportersSub')+'</p></div>'
      +   '<div class="supporters-grid">'
      +     DATA.supporters.map(function(s){
            var initials = s.initials || pick(s.name).split(/\s+/).map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();
            var useGold = /Office|Administration|Authority|Cooperative|City|Zone/.test(pick(s.name));
            var bg = useGold ? 'var(--gold-100)' : 'var(--brand-100)';
            var fg = useGold ? 'var(--gold-700)' : 'var(--brand-700)';
            return '<div class="supporter-card fade-in">'
              + '<div class="supporter-avatar" style="background:'+bg+';color:'+fg+';">'+initials+'</div>'
              + '<div>'
              + '<h4 class="supporter-name">'+pick(s.name)+'</h4>'
              + '<p class="supporter-role">'+pick(s.role)+'</p>'
              + '</div></div>';
          }).join('')
      +   '</div>'
      + '</div></section>'
      + '</div>';
  }

  // ---- CONTRIBUTE ----
  function viewContribute(){
    return '<div class="page"><section class="section tight"><div class="container" style="max-width:760px;">'
      + '<span class="kicker fade-in">'+t('contribute')+'</span>'
      + '<h1 class="fade-in delay-1">'+t('shareStory')+'</h1>'
      + '<p class="fade-in delay-2">'+t('shareStoryD')+'</p>'
      + '<form class="donate-card fade-in delay-2" data-ajax data-success="'+(state.lang==='om'?'Galatoomi! Ergameera.':'Thank you — your submission was received.')+'">'
      +   '<div class="form-group"><label class="form-label">'+t('yourName')+'</label><input type="text" class="form-input" required></div>'
      +   '<div class="form-group"><label class="form-label">'+t('yourEmail')+'</label><input type="email" class="form-input"></div>'
      +   '<div class="form-group"><label class="form-label">'+t('yourPlace')+'</label><select class="form-select">'+DATA.places.map(function(p){return '<option>'+pick(p.name)+'</option>';}).join('')+'</select></div>'
      +   '<div class="form-group"><label class="form-label">'+t('yourStory')+'</label><textarea class="form-textarea" rows="6" required></textarea></div>'
      +   '<button class="btn btn-primary" type="submit">'+iconHtml('send')+' '+t('send')+'</button>'
      + '</form>'
    + '</div></section></div>';
  }

  // ---- STAFF LOGIN ----
  function viewStaff(){
    return '<div class="page"><section class="auth-wrap">'
      + '<div class="auth-card fade-in">'
      +   '<span class="kicker">'+(state.lang==='om'?'Hojjettoota':'Staff')+'</span>'
      +   '<h2>'+t('staffLogin')+'</h2>'
      +   '<p class="sub muted">'+(state.lang==='om'?'Editori fi bulchiinsaaf qofa.':'Editors and administrators only.')+'</p>'
      +   '<form data-ajax data-success="'+(state.lang==='om'?'Studio dhiyootti.':'Studio coming soon.')+'">'
      +     '<div class="form-group"><label class="form-label">'+t('username')+'</label><input type="text" class="form-input" required></div>'
      +     '<div class="form-group"><label class="form-label">'+t('password')+'</label><input type="password" class="form-input" required></div>'
      +     '<button class="btn btn-primary" style="width:100%;justify-content:center;" type="submit">'+iconHtml('log-in')+' '+t('login')+'</button>'
      +   '</form>'
      +   '<p class="muted mt-4" style="font-size:12.5px;">'+(state.lang==='om'?'Fuulli studio baatii fudhachuu, qindaa\'uu fi maxxansuuf — hanga dhiyootti.':'The editor studio for preview, editing and publishing — coming soon.')+'</p>'
      + '</div></section></div>';
  }

  // ---- ARTICLE DETAIL ----
  function viewArticle(type, id){
    var item;
    if (type === 'news') item = DATA.news.find(function(n){return n.id===id;});
    else if (type === 'event') item = DATA.events.find(function(n){return n.id===id;});
    else if (type === 'story') item = DATA.stories.find(function(n){return n.id===id;});
    if (!item) return view404();
    var bg = item.img ? imgBg(item.img, pick(item.title)) : ('background:linear-gradient(135deg,var(--brand-700),var(--brand-500));');
    var backHref = type === 'story' ? '#/stories' : '#/news';
    var backLabel = type === 'story' ? t('navStories') : t('navNews');

    // Build article body — paragraphs split on newlines
    var bodyText = (item.body ? (state.lang === 'om' && item.body.om ? item.body.om : (state.lang === 'en' && item.en ? item.en : pick(item.body))) : pick(item.excerpt));
    var bodyParas = bodyText.split(/\n\n+/).filter(Boolean).map(function(para){
      return '<p>'+para.replace(/\n/g,'<br>')+'</p>';
    }).join('');

    // Build gallery
    var artGalleryHtml = '';
    if (item.gallery && item.gallery.length){
      var gitems = item.gallery.map(function(src, idx){
        return '<button class="g-item" data-gallery-img="'+src+'" data-gallery-idx="'+idx+'" aria-label="Open photo '+(idx+1)+'"><div style="width:100%;height:100%;'+imgBg(src,'')+'"></div></button>';
      }).join('');
      artGalleryHtml = '<div class="article-gallery-section"><div class="section-head left fade-in"><span class="kicker">'+t('gallery')+'</span><h3 style="font-size:22px;">'+t('galleryComing')+'</h3></div>'
        + '<div class="gallery" data-gallery>'+gitems+'</div></div>';
    }

    var sourceNote = '';
    if (item.source){
      sourceNote = '<p class="muted" style="font-size:13.5px;">'+(state.lang==='om'?'Madda: ':'Source: ')+pick(item.source)+'</p>';
    } else {
      sourceNote = '<p class="muted" style="font-size:13.5px;">'+(state.lang==='om'?'Madda: Ragaa waajjira godinaa (2015/16 A.L.I).':'Source: Zone profile (2015/16 E.C.) and Oromo source book.')+'</p>';
    }

    return '<div class="page"><section class="section tight"><div class="container"><div style="max-width:860px;margin:0 auto;">'
      + '<div class="breadcrumb fade-in"><a href="#/"><i data-lucide="home" style="width:13px;height:13px;"></i></a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <a href="'+backHref+'">'+backLabel+'</a> <i data-lucide="chevron-right" style="width:12px;height:12px;"></i> <span>'+pick(item.title)+'</span></div>'
      + '<span class="chip fade-in">'+pick(item.cat)+'</span>'
      + '<h1 class="fade-in delay-1" style="margin-top:14px;">'+pick(item.title)+'</h1>'
      + '<div class="meta-row fade-in delay-1"><span><i data-lucide="calendar-days" style="width:14px;height:14px;vertical-align:-2px;"></i> '+fmtDate(item.date)+'</span><span><i data-lucide="map-pin" style="width:14px;height:14px;vertical-align:-2px;"></i> '+pick(item.place)+'</span></div>'
      + '<div class="article-hero fade-in delay-1"><div style="width:100%;height:100%;'+bg+'"></div></div>'
      + '<div class="article fade-in delay-2">'
      +   '<p style="font-size:19px;color:var(--ink-700);font-family:var(--serif);line-height:1.5;">'+pick(item.excerpt)+'</p>'
      +   bodyParas
      +   sourceNote
      +   '<a href="'+backHref+'" class="btn btn-ghost">'+iconHtml('arrow-left')+' '+backLabel+' '+(state.lang==='om'?'itti deebi\'i':'back')+'</a>'
      + '</div>'
      + artGalleryHtml
    + '</div></div></section></div>';
  }

  // ---- ABOUT ----
  function viewAbout(){
    return '<div class="page"><section class="section tight"><div class="container" style="max-width:780px;">'
      + '<span class="kicker fade-in">'+t('about')+'</span>'
      + '<h1 class="fade-in delay-1">Discover Qellem</h1>'
      + '<p class="fade-in delay-2" style="font-size:17px;color:var(--ink-600);">'+t('footerAbout')+'</p>'
      + '<p class="fade-in delay-2">'+(state.lang==='om'?'Fuulli kun afaan lamaaniin — Afaan Oromoo fi Ingiliffaan — qophaa\'eera. Qabeenyi fi ragnni hundi ragaa ofiisaalii irraa dhufe.':'This site is published in Afaan Oromoo and English. Every fact is drawn from official zone sources and verified Oromo source documents.')+'</p>'
    + '</div></section></div>';
  }

  // ---- 404 ----
  function view404(){
    return '<div class="page"><div class="nf-wrap fade-in">'
      + '<h1>404</h1>'
      + '<p>'+t('notFoundSub')+'</p>'
      + '<a href="#/" class="btn btn-primary">'+iconHtml('arrow-left')+' '+t('backHome')+'</a>'
    + '</div></div>';
  }

  // -------- INIT --------
  function init(){
    $app = document.getElementById('app');
    $nav = document.getElementById('nav');
    if (!$app) return;

    document.getElementById('year').textContent = new Date().getFullYear();

    // Theme & language
    applyTheme();
    // Set lang label (applyLang calls render)
    var lbl = document.getElementById('langLabel');
    if (lbl) lbl.textContent = state.lang === 'om' ? 'EN' : 'OM';

    // Announce close
    var ac = document.getElementById('announceClose');
    if (ac) ac.addEventListener('click', function(){
      var a = document.getElementById('announce');
      if (a) a.classList.add('hidden');
    });

    // Toggle buttons
    var tt = document.getElementById('themeToggle');
    if (tt) tt.addEventListener('click', function(){
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      toast(state.theme === 'dark' ? (state.lang==='om'?'Halkan hojii: jiru':'Dark mode on') : (state.lang==='om'?'Ifa hojii: jiru':'Light mode on'));
    });
    var lt = document.getElementById('langToggle');
    if (lt) lt.addEventListener('click', function(){
      state.lang = state.lang === 'om' ? 'en' : 'om';
      applyLang();
      toast(state.lang === 'om' ? 'Afaan Oromoo' : 'English');
    });

    // Menu
    var mb = document.getElementById('menuBtn');
    if (mb) mb.addEventListener('click', toggleMenu);

    // Close menu when clicking a link inside it
    var mm = document.getElementById('mobileMenu');
    if (mm){
      var mmLinks = mm.querySelectorAll('a');
      for (var i=0; i<mmLinks.length; i++){
        mmLinks[i].addEventListener('click', closeMenu);
      }
    }

    // Nav scroll
    window.addEventListener('scroll', function(){
      if (window.scrollY > 8) $nav.classList.add('scrolled');
      else $nav.classList.remove('scrolled');
    });

    // Expose toast globally for inline handlers
    window.toast = toast;

    // ----- PWA install banner -----
    function showInstallBanner() {
      var b = document.getElementById('installBanner');
      if (!b) return;
      if (localStorage.getItem('dq_install_dismissed') === '1') return;
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return;
      if (window.navigator.standalone === true) return;
      b.hidden = false;
      requestAnimationFrame(function(){ b.classList.add('show'); });
      var t = document.getElementById('installTitle');
      var s = document.getElementById('installSub');
      if (t && s){
        t.textContent = state.lang === 'om' ? 'Appii keessatti buufadhuu' : 'Install Discover Qellem';
        s.textContent = state.lang === 'om' ? 'Offline akka hojjetuuf appii bilbila/kompitarra keessaniitti buufadhaa.' : 'Add to home screen for fast, offline access on phone or desktop.';
      }
    }
    function hideInstallBanner(persist) {
      var b = document.getElementById('installBanner');
      if (!b) return;
      b.classList.remove('show');
      setTimeout(function(){ b.hidden = true; }, 400);
      if (persist) localStorage.setItem('dq_install_dismissed', '1');
    }
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      state.deferredInstall = e;
      showInstallBanner();
    });
    window.addEventListener('appinstalled', function(){
      hideInstallBanner(true);
      toast(state.lang === 'om' ? 'Erga buufameera — galatoomi!' : 'App installed — thank you!');
    });
    // iOS Safari: show banner manually if in browser and not installed
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) {
      setTimeout(showInstallBanner, 2500);
    }
    // Also show the banner a few seconds after page load on other platforms if a prompt is available (i.e. beforeinstallprompt already fired)
    setTimeout(function(){
      if (state.deferredInstall) showInstallBanner();
    }, 3500);
    var ib = document.getElementById('installBtn');
    if (ib) ib.addEventListener('click', function(){
      if (state.deferredInstall) {
        state.deferredInstall.prompt();
        state.deferredInstall.userChoice.then(function(choice){
          if (choice.outcome === 'accepted') {
            hideInstallBanner(true);
          }
          state.deferredInstall = null;
        });
      } else {
        // Fallback: instructions toast
        toast(state.lang === 'om'
          ? 'Safari keessatti Share → Add to Home Screen cuqaasi.'
          : 'On Safari: Share → Add to Home Screen. On Chrome: tap the install icon in the address bar.');
      }
    });
    var ic = document.getElementById('installClose');
    if (ic) ic.addEventListener('click', function(){ hideInstallBanner(true); });
    var fi = document.getElementById('footerInstall');
    if (fi) fi.addEventListener('click', function(){
      if (state.deferredInstall) {
        state.deferredInstall.prompt();
        state.deferredInstall.userChoice.then(function(choice){
          if (choice.outcome === 'accepted') hideInstallBanner(true);
          state.deferredInstall = null;
        });
      } else {
        // Manual instructions
        var ua = navigator.userAgent;
        var isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
        var isAndroid = /Android/.test(ua);
        if (isiOS) {
          toast(state.lang === 'om'
            ? 'Safari: Share → "Add to Home Screen" tuqi.'
            : 'Safari: tap Share → "Add to Home Screen".');
        } else if (isAndroid) {
          toast(state.lang === 'om'
            ? 'Chrome: qaqqabii gubbaa sadii → "Install app" filadhu.'
            : 'Chrome: open the three-dot menu → "Install app".');
        } else {
          toast(state.lang === 'om'
            ? 'Chrome/Edge: marsariitii irra address bar keessatti "Install app" cuqaasi.'
            : 'On Chrome/Edge desktop, click the install icon (⊕) in the address bar.');
        }
        showInstallBanner();
      }
    });

    // Routing
    window.addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
