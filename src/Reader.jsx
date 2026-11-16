import React, { useEffect, useRef, useState } from 'react';
import library from './home/library.json';
import { Product, Demo } from './Overlays';
import { exams, questions, labels } from './content';

function Graph({ initial, open }) {
  const [id,set]=useState(initial || 'tax');
  const exam=exams.find(e=>e.id===id);
  return <><div className="modal-heading"><p className="eyebrow">AI두윌 글래스 성능 비교</p><h2 id="dialog-title">{exam.round} 정답률</h2><p>AI두윌은 40문항을 모두 맞혔습니다. 같은 문항을 푼 2025년 만점자보다 {id==='tax'?'8':'5'}문제 더 맞힌 결과입니다.</p></div>
    <div className="switcher">{exams.map(e=><button key={e.id} onClick={()=>set(e.id)} aria-pressed={id===e.id}>{e.name}</button>)}</div>
    <div className="score-graph" aria-live="polite">{exam.counts.map((n,i)=><div className={'score-row score-'+i} key={i}><div><span>{labels[i]}</span><strong>{n*2.5}% <small>({n}/40)</small></strong></div><div className="score-track"><i style={{width:n*2.5+'%'}}/></div></div>)}<div className="score-axis"><span>0%</span><span>50%</span><span>100%</span></div></div>
    <p className="reader-note">‘만점자’는 각 연도 성적을 기준으로 한 표기입니다. 그래프는 같은 모의고사 40문항의 정답률입니다.</p><div className="reader-actions"><button onClick={()=>open('method')}>비교 기준 보기</button><button onClick={()=>open('demo:'+id)}>이 유형 풀어보기 →</button></div></>;
}
function Guide({index}) {
  const [tag,title,example,check]=library.guides[index];
  return <div className="reader-example"><p className="eyebrow">{tag} · 공통 연습 예제</p><h3>{title}</h3><p>{example}</p><h4>다시 풀 때</h4><p>{check}</p></div>;
}
function Reel({ article }) {
  const { movie, photo, captions, alt } = article.reel;
  const marks = ['00:00:00.000','00:00:02.650','00:00:05.300','00:00:08.000'];
  const subtitles = 'WEBVTT\n\n' + captions.map((line,i) => marks[i]+' --> '+marks[i+1]+' line:75%\n'+line).join('\n\n');
  return <div className="reel-reader">
    <p className="eyebrow">{article.category}</p><h2 id="dialog-title">{article.title}</h2>
    <video key={movie} poster={photo} controls autoPlay muted playsInline aria-label={alt}>
      <source src={movie} type="video/mp4" />
      <track kind="captions" srcLang="ko" label="한국어" default src={'data:text/vtt;charset=utf-8,'+encodeURIComponent(subtitles)}/>
    </video>
    <details><summary>자막 전문</summary>{captions.map(t=><p key={t}>{t}</p>)}</details>
  </div>;
}
function TextPage({kind,open}) {
  const [section,id]=kind.split(':');
  if(section==='flyer'){
    const flyer=library.flyers[Number(id)];
    return <div className="flyer-reader"><p className="eyebrow">{flyer.line}</p><h2 id="dialog-title">{flyer.title}</h2><img src={flyer.photo} alt={flyer.line+' · '+flyer.title+' · '+flyer.detail}/><button className="action-primary" onClick={()=>open(flyer.action)}>{flyer.cta} <span>→</span></button></div>;
  }
  if(section==='read'){
    const a=library.articles[id];
    if(a.reel) return <Reel article={a}/>;
    if(a.duel){
      const d=a.duel;
      return <><div className="modal-heading"><p className="eyebrow">{a.category}</p><h2 id="dialog-title">{a.title}</h2><p>{a.lead}</p></div>
        <div className="duel-question"><span>오늘의 한 문제</span><h3>{d.question}</h3></div>
        <section className="duel-turn"><img src={d.photo} alt=""/><div><small>{d.nick}</small><h3>{d.name} 강사의 칠판</h3><p>{d.human}</p></div></section>
        <section className="duel-turn glass-turn"><img src="/media/glass-cutout.webp" alt=""/><div><small>AIduwill Glass</small><h3>AI두윌의 렌즈</h3><p>{d.glass}</p></div></section>
        <button className="action-primary" onClick={()=>open('demo:'+(id==='prof0'||id==='prof5'?'tax':'leet'))}>이번에는 직접 풀기 →</button></>;
    }
    return <><div className="modal-heading"><p className="eyebrow">{a.category}</p><h2 id="dialog-title">{a.title}</h2><p>{a.lead}</p></div>{a.answer && <div className="reader-example"><h3>{a.answerLabel}</h3><p>{a.answer}</p></div>}<div className="reader-actions"><button onClick={()=>open('product')}>렌즈 살펴보기</button><button onClick={()=>open('demo:'+(a.mode===0?'tax':'leet'))}>풀이 데모 열기 →</button></div></>;
  }
  if(section==='exercise')return <><div className="modal-heading"><p className="eyebrow">과목별 렌즈 해설</p><h2 id="dialog-title">{library.guides[Number(id)][0]} 연습</h2></div><Guide index={Number(id)}/></>;
  if(section==='schedule')return <><div className="modal-heading"><p className="eyebrow">AI두윌 글래스</p><h2 id="dialog-title">23강 학습 과정</h2></div><div className="schedule-list">{library.sessions.map(([sub,t],i)=><button key={i} onClick={()=>open('read:day'+i)}><small>DAY {String(i+1).padStart(2,'0')}</small><strong>{t}</strong><span>{sub}</span></button>)}</div></>;
  if(section==='method')return <><div className="modal-heading"><p className="eyebrow">AI두윌 모의고사</p><h2 id="dialog-title">정답률 산출 기준</h2></div><div className="reader-example"><h3>같은 연습문항 40개</h3><p>답안지 세 장에 같은 배점을 적용합니다. 한 문제당 2.5점, 부분점수는 없습니다.</p><h4>채점 기록</h4><p>세무사 정답 수는 26개, 32개, 40개. LEET는 28개, 35개, 40개. 각각 2024년 만점자, 2025년 만점자, AI두윌의 정답 수입니다.</p></div><button className="action-primary" onClick={()=>open('bench:tax')}>성적표 보기 →</button></>;
  if(section==='sources')return <><div className="modal-heading"><p className="eyebrow">원본 자료</p><h2 id="dialog-title">홈페이지 아카이브</h2></div><p>2026년 11월 16일 에듀윌 홈페이지에서 보이는 인트로 영상, 아이콘, 마스코트, 푸터의 수상 마크를 원래 위치에 사용했습니다. 특강 전단 26장은 원본의 색과 지면 구성을 바탕으로 AI두윌 광고로 다시 제작했습니다. 안경, 강사진, 릴스와 모의 성적표는 AI두윌 제작분입니다. 수상 마크는 에듀윌 원본 자료입니다.</p><a className="video-source" href="https://www.eduwill.net/sites/home" rel="noreferrer" target="_blank">에듀윌 원본 홈 ↗</a></>;
  if(section==='notice')return <><div className="modal-heading"><p className="eyebrow">체험 안내</p><h2 id="dialog-title">글래스 풀이 체험</h2></div><div className="schedule-list"><button onClick={()=>open('demo:tax')}>세무사 · 매출원가 계산 <b>→</b></button><button onClick={()=>open('demo:leet')}>LEET · 전제에서 결론 찾기 <b>→</b></button><button onClick={()=>open('schedule')}>23강 학습 과정 <b>→</b></button></div></>;
  return <><div className="modal-heading"><p className="eyebrow">AIduwill Glass</p><h2 id="dialog-title">렌즈 사용 안내</h2></div>{questions.map(([q,a],i)=><details key={q} open={i===0||undefined}><summary>{q}</summary><p>{a}</p></details>)}<button className="action-primary" onClick={()=>open('product')}>제품 자세히 보기 →</button></>;
}
export default function Reader({kind,close,open}){
  const ref=useRef(null);
  useEffect(()=>{const el=ref.current,prev=document.activeElement;el.showModal(); const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=old;prev?.focus({preventScroll:true})}},[]);
  return <dialog ref={ref} className="sheet" aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target!==ref.current)return;const r=ref.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}>
    <button className="sheet-close" aria-label="닫기" onClick={close}>×</button>
    {kind==='product'?<Product tryDemo={()=>open('demo:tax')}/>:kind.startsWith('demo:')?<Demo initialExam={kind.split(':')[1]}/>:kind.startsWith('bench:')?<Graph initial={kind.split(':')[1]} open={open}/>:<TextPage kind={kind} open={open}/>}
  </dialog>
}
