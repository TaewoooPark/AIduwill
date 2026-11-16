import React, { memo, useEffect, useRef, useState } from 'react';
import layout from './home/library.json';
import Reader from './Reader';

const fragments = import.meta.glob('./home/*.html',{eager:true,query:'?raw',import:'default'});
const region = name => fragments['./home/'+name+'.html'];
const bands = ['promotions','shortcuts','recommendations','schedule','guide','lineup','labs','faculty','shorts','reviews'];
const fullHome = region('intro')+region('floating')+'<div id="wrap" class="wrap-relative"><div id="container"><div id="contents" class="www"><div id="TMPLT__119_TP_1_1">'+region('banner')+region('header')+'<main class="main-content">'+bands.map(region).join('')+'</main>'+region('menu')+'</div>'+region('after-main')+'</div></div></div>'+region('ending')+region('signature')+region('footer');
const HomeMarkup = memo(function HomeMarkup(){ return <div className="archive-layout" dangerouslySetInnerHTML={{__html:fullHome}}/> });

export default function Page() {
  const root=useRef(null),[reader,setReader]=useState(null);
  useEffect(()=>{
    const el=root.current, one=s=>el.querySelector(s), all=s=>[...el.querySelectorAll(s)];
    const intro=one('#globalIntro'), menu=one('.mega-menu-container'), search=menu.querySelector('input'), reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let previous=null, reviewIndex=5;
    function sessionGet(){try{return sessionStorage.getItem('aiduwill:archive-intro')}catch{return null}}
    function introMode(on){
      intro.hidden=!on;document.body.classList.toggle('viewing-intro',on);
      const video=intro.querySelector('video');video.muted=true;
      for(const sibling of intro.parentElement.children){if(sibling!==intro)sibling.inert=on}
      if(on){intro.querySelector('a').focus({preventScroll:true,focusVisible:false});if(!reduced.matches) video.play().catch(()=>{});}
      else {video.pause();try{sessionStorage.setItem('aiduwill:archive-intro','1')}catch{}}
    }
    introMode(!location.hash&&!sessionGet());
    function jump(id){const node=document.getElementById(id);if(!node)return;node.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});history.replaceState(null,'','#'+id)}
    if(location.hash&&document.getElementById(location.hash.slice(1)))requestAnimationFrame(()=>document.getElementById(location.hash.slice(1)).scrollIntoView());
    function setMenu(open,focus=false){
      menu.classList.toggle('active',open);menu.setAttribute('aria-hidden',String(!open));menu.inert=!open;document.body.classList.toggle('viewing-menu',open);
      if(open){previous=document.activeElement;search.value='';filterMenu();(focus?search:menu.querySelector('.mega-close-btn')).focus({preventScroll:true})}
      else if(previous){previous.focus({preventScroll:true});previous=null}
    }
    menu.inert=true;menu.setAttribute('aria-label','전체 메뉴');menu.setAttribute('role','dialog');
    function pane(name){all('.mega-tab-content').forEach((e,i)=>e.classList.toggle('active',i===(name==='labs'?1:0)));all('.mega-tabs-links button').forEach((e,i)=>e.classList.toggle('active',i===(name==='labs'?1:0)));search.value='';filterMenu()}
    function filterMenu(){const term=search.value.trim().toLowerCase(); const out=one('.mega-search-result');
      all('.mega-tab-content').forEach(x=>x.style.display=term?'none':''); one('.mega-search-none').style.display='none';out.replaceChildren();out.style.display=term?'block':'none';if(!term)return;
      const hits=Object.entries(layout.articles).filter(([,a])=>[a.title,a.lead,a.category].join(' ').toLowerCase().includes(term));
      if(!hits.length){out.textContent='일치하는 자료가 없습니다.';return}
      const grid=document.createElement('div');grid.className='ai-search-hits';for(const [id,item] of hits){const a=document.createElement('a');a.href='#read-'+id;a.dataset.action='read:'+id;a.textContent=item.title;const small=document.createElement('small');small.textContent=item.category;a.append(small);grid.append(a)}out.append(grid)
    }
    function showDeck(i){const grid=one('.group-grid');grid.outerHTML=layout.decks[i];all('.group-tab-btn').forEach((btn,j)=>{btn.classList.toggle('active',j===i);btn.setAttribute('aria-pressed',j===i)})}
    const flyers=one('.flyer-window');
    const flyerCards=all('.flyer-slide');
    const flyerStep=()=>flyerCards[1].offsetLeft-flyerCards[0].offsetLeft;
    function syncFlyers(){
      const index=Math.round(flyers.scrollLeft/flyerStep());
      one('.global-benefit-banner .slick-counter strong').textContent=index+1;
      one('[data-action="flyer-prev"]').disabled=flyers.scrollLeft<1;
      one('[data-action="flyer-next"]').disabled=flyers.scrollWidth-flyers.clientWidth-flyers.scrollLeft<2;
    }
    function doAction(key){
      if(key==='flyer-next'||key==='flyer-prev'){
        flyers.scrollBy({left:(key==='flyer-next'?1:-1)*flyerStep(),behavior:reduced.matches?'instant':'smooth'});
        return;
      }
      if(key==='review-prev'||key==='review-next'){reviewsAt(reviewIndex+(key==='review-next'?1:-1));return}
      if(key==='intro'){introMode(true);return}
      if(key==='enter'){introMode(false);window.scrollTo(0,0);one('.menu-btn').focus({preventScroll:true,focusVisible:false});return}
      if(key==='menu'||key==='search'){setMenu(true,key==='search');return}
      if(key==='close-menu'){setMenu(false);return}
      if(key==='mega-find'){filterMenu();return}
      if(key.startsWith('mega:')){pane(key.split(':')[1]);return}
      if(key.startsWith('mega-cat:')){const i=Number(key.split(':')[1]);const active=one('.mega-tab-content.active');for(const sel of ['.mega-category-list li','.mega-sub-items'])[...active.querySelectorAll(sel)].forEach((n,j)=>n.classList.toggle('active',i===j));return}
      if(menu.classList.contains('active'))setMenu(false);
      if(key.startsWith('jump:')){jump(key.slice(5));return}
      if(key.startsWith('group:')){showDeck(Number(key.slice(6)));return}
      setReader(key)
    }
    const phone = window.matchMedia('(max-width:1023px)');
    const sliders = ['professor', 'shorts'];
    const ending = one('#brand-ending');
    const floating = one('.floating-menu');
    function carousel(type, requestedIndex, fromSwipe = false) {
      const track = one('.'+type+'-track'), wrap = track.parentElement;
      const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
      const limit = Math.max(0, track.scrollWidth - wrap.clientWidth);
      const last = Math.ceil(limit / step);
      const index = fromSwipe
        ? (wrap.scrollLeft >= limit - 1 ? last : Math.round(wrap.scrollLeft / step))
        : Math.max(0, Math.min(requestedIndex, last));
      track.dataset.index = index;
      if (!fromSwipe) {
        const left = Math.min(index * step, limit);
        if (phone.matches) {
          if (Math.abs(wrap.scrollLeft-left) > 1) wrap.scrollTo({left,behavior:'instant'});
        } else {
          wrap.scrollLeft = 0;
          track.style.transform = 'translateX(-'+left+'px)';
        }
      }
      const dots = all('.'+type+'-indicators button');
      while (dots.length <= last) {
        const button = document.createElement('button');
        button.className = 'indicator-dot';
        dots[0].parentElement.append(button);
        dots.push(button);
      }
      dots.forEach((button,j)=>{
        button.hidden = j > last;
        button.classList.toggle('active', j===index);
        button.setAttribute('aria-current', j===index ? 'true' : 'false');
        button.setAttribute('aria-label', (type==='shorts'?'릴스':'강사')+' '+(j+1)+'번째 묶음');
        button.dataset.slide = type+':'+j;
      });
    }
    function onSwipe(event) {
      if (phone.matches) carousel(event.currentTarget.dataset.carousel, 0, true);
    }
    sliders.forEach(type=>{
      const box = one('.'+type+'-marquee');
      box.dataset.carousel = type;
      box.addEventListener('scroll',onSwipe,{passive:true});
    });
    function reviewsAt(i){const list=all('.coverflow-item');reviewIndex=(i+list.length)%list.length;
      one('.review-position').textContent=(reviewIndex+1)+' / '+list.length;
      list.forEach((c,j)=>{let diff=(j-reviewIndex+list.length)%list.length;if(diff>list.length/2)diff-=list.length;c.className='review-card coverflow-item '+(diff < -2?'hidden-left':diff > 2?'hidden-right':({'-2':'prev-2','-1':'prev-1',0:'item-center',1:'next-1',2:'next-2'})[diff]);c.tabIndex=Math.abs(diff)<=2?0:-1})}
    function click(e){const item=e.target.closest('[data-action], [data-slide]');if(!item)return;e.preventDefault();
      if(item.dataset.slide){const [type,i]=item.dataset.slide.split(':');carousel(type,Number(i));return}
      if(item.matches('.coverflow-item')&&!item.classList.contains('item-center')){reviewsAt(all('.coverflow-item').indexOf(item));return}doAction(item.dataset.action)}
    function keydown(e){
      if(document.querySelector('dialog[open]'))return;
      if(e.key==='Escape'){if(menu.classList.contains('active'))setMenu(false);else if(!intro.hidden)doAction('enter');return}
      if(!intro.hidden&&['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();doAction('enter');return}
      if(e.key==='Enter'&&e.target===search){e.preventDefault();filterMenu();return}
      if(e.target.closest('.coverflow-container')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();reviewsAt(reviewIndex+(e.key==='ArrowRight'?1:-1));return}
      if([' ','Enter'].includes(e.key)&&e.target.matches('[role=button]')&&!e.target.matches('a,button,input')){e.preventDefault();e.target.click()}
      if(e.key==='Tab'&&menu.classList.contains('active')){const enabled=[...menu.querySelectorAll('input,button,a,[tabindex="0"]')].filter(x=>x.offsetParent!==null);if(e.shiftKey&&document.activeElement===enabled[0]){e.preventDefault();enabled.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===enabled.at(-1)){e.preventDefault();enabled[0].focus()}}
    }
    const motion=()=>{
      for(const t of phone.matches ? [] : sliders){const tr=one('.'+t+'-track');if(!tr.parentElement.matches(':hover,:focus-within')&&tr.getBoundingClientRect().top<innerHeight&&tr.getBoundingClientRect().bottom>0){const count=all('.'+t+'-indicators button').filter(x=>!x.hidden).length;carousel(t,(Number(tr.dataset.index)+1)%count)}}
      const card=one('.coverflow-container');if(!phone.matches&&card.getBoundingClientRect().top<innerHeight&&card.getBoundingClientRect().bottom>0&&!card.matches(':hover,:focus-within'))reviewsAt(reviewIndex+1)
    };
    function onScroll(){const pin=one('.global-sticky-header').getBoundingClientRect().top<=0;one('.header-container').classList.toggle('is-fixed',pin);floating.classList.toggle('visible',window.scrollY>350 && ending.getBoundingClientRect().top>window.innerHeight-60)}
    function resize(){syncFlyers();for(const t of ['professor','shorts'])carousel(t,Number(one('.'+t+'-track').dataset.index||0));onScroll()}
    function wheel(e){if(!intro.hidden&&e.deltaY>1)doAction('enter')}
    let startY=0;function touchStart(e){startY=e.touches[0].clientY}function touchEnd(e){if(!intro.hidden&&startY-e.changedTouches[0].clientY>18)doAction('enter')}
    flyers.addEventListener('scroll',syncFlyers,{passive:true});
    el.addEventListener('click',click);document.addEventListener('keydown',keydown);search.addEventListener('input',filterMenu);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',resize);intro.addEventListener('wheel',wheel,{passive:true});intro.addEventListener('touchstart',touchStart,{passive:true});intro.addEventListener('touchend',touchEnd);
    const frame=requestAnimationFrame(resize);const timer=!reduced.matches&&setInterval(motion,4800);reviewsAt(5);
    return()=>{sliders.forEach(type=>one('.'+type+'-marquee').removeEventListener('scroll',onSwipe));flyers.removeEventListener('scroll',syncFlyers);cancelAnimationFrame(frame);clearInterval(timer);el.removeEventListener('click',click);document.removeEventListener('keydown',keydown);search.removeEventListener('input',filterMenu);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',resize);intro.removeEventListener('wheel',wheel);intro.removeEventListener('touchstart',touchStart);intro.removeEventListener('touchend',touchEnd);document.body.classList.remove('viewing-intro','viewing-menu')}
  },[]);
  return <div id="globalWrapper" className="globalmain-wrapper" ref={root}><HomeMarkup/>{reader&&<Reader key={reader} kind={reader} close={()=>setReader(null)} open={setReader}/>}</div>;
}
