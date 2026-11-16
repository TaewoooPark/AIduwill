import { photos } from './media';
import React, { useState } from 'react';
import { exams } from './content';

export function Demo({ initialExam }) {
  const [id, setId] = useState(initialExam);
  const [choice, setChoice] = useState(null);
  const [reveal, setReveal] = useState(false);
  const exam = exams.find(e => e.id === id);
  function changeExam(value) { setId(value); setChoice(null); setReveal(false); }
  return <>
    <div className="modal-heading"><p className="eyebrow">AI두윌 글래스 · 풀이 체험</p><h2 id="dialog-title">렌즈로 한 문제 풀기</h2></div>
    <div className="switcher">{exams.map(e => <button key={e.id} aria-pressed={id === e.id} onClick={() => changeExam(e.id)}>{e.name}</button>)}</div>
    <div className="practice"><span className="eyebrow">{exam.subject} · 연습문제 01</span><h3>{exam.question}</h3>
    <div className="answers">{exam.options.map((o,i) => <button key={o} aria-pressed={choice === i} onClick={() => { setChoice(i); setReveal(true); }} className={reveal && i === exam.answer ? 'correct' : (choice === i ? 'incorrect' : '')}>
      <span>{['①','②','③'][i]}</span> {o}{reveal && i === exam.answer && <b>정답</b>}</button>)}</div></div>
    {reveal ? <div className="explanation" role="status"><strong>{choice === null ? '렌즈 해설' : choice === exam.answer ? '정답입니다' : '렌즈가 찾은 풀이'}</strong><p>{exam.reasoning}</p></div> : <button className="action-primary" onClick={() => setReveal(true)}>렌즈 해설 켜기 <span>→</span></button>}
  </>;
}

export function Product({ tryDemo }) {
  const [photo, setPhoto] = useState(0);
  return <>
    <div className="modal-heading"><p className="eyebrow">시험 대비 AI 안경</p><h2 id="dialog-title">AIduwill Glass</h2><p>문제집을 읽으면 계산 과정과 지문의 근거가 렌즈에 뜹니다.</p></div>
    <figure className="product-photo"><img src={photos[['amber','midnight','study'][photo]]} alt={['옐로 배경의 검정색 AI 안경','검정 프레임과 렌즈의 정면 디테일','문제집 위에 놓인 AI 안경'][photo]}/></figure>
    <div className="switcher photo-toggle">{['제품 전체','프레임 디테일','학습 장면'].map((t,i) => <button key={t} aria-pressed={photo === i} onClick={() => setPhoto(i)}>{t}</button>)}</div>
    <p className="product-description">{['블랙 프레임과 투명 렌즈. 평소 보던 문제집을 펼치고 안경을 쓰면 됩니다.','프레임 모서리에 문제를 읽는 카메라를 넣었습니다. 책에서 눈을 떼지 않고 렌즈에 뜬 해설을 확인하세요.','회계 문제는 계산식을 한 줄씩, 추리논증은 결론을 뒷받침하는 문장부터 보여줍니다.'][photo]}</p>
    <button className="action-primary" onClick={tryDemo}>렌즈 풀이 체험하기 <span>→</span></button>
  </>;
}

