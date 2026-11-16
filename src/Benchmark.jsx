import React from 'react';
import { exams, labels } from './content';

export const percent = value => value * 100 / 40;

export function MiniChart() {
  return <div className="mini-chart" aria-hidden="true">
    {exams[0].counts.map((n, i) => <div key={i} className={'mini-col mini-' + i}>
      <span>{percent(n)}<small>%</small></span><i style={{ height: n * 2.05 }} />
      <small>{['2024', '2025', 'Glass'][i]}</small>
    </div>)}
  </div>;
}

export default function Benchmark({ examId, selectExam, showMethod }) {
  const exam = exams.find(e => e.id === examId);
  return <section id="benchmark" className="bench-section section-padding">
    <div className="wrap">
      <div className="section-header text-center">
        <h2 className="text-h2">만점의 기준이 바뀌다</h2>
        <p>역대 만점자와 AI 안경이 같은 연습문제를 푼다면?</p>
      </div>
      <div className="group-tabs-container"><div className="group-tabs" aria-label="비교할 시험">
        {exams.map(e => <button key={e.id} aria-pressed={e.id === examId} className={'group-tab-btn ' + (e.id === examId ? 'active' : '')} onClick={() => selectExam(e.id)}>{e.name}</button>)}
      </div></div>
      <div className="bench-panel" aria-live="polite">
        <div className="bench-info"><span className="eyebrow">모의 벤치마크</span>
          <h3>{exam.round}<br/>문항 정답률</h3>
          <p>{exam.subject} 연습문항 40개<br/>역대 만점자 2명과 AI두윌</p>
          <button onClick={showMethod} className="text-link">비교 기준 보기 <span>↗</span></button>
        </div>
        <div className="bars">
          {exam.counts.map((n, i) => <div className={'bar-row row-' + i} key={i}>
            <div className="bar-caption"><span>{labels[i]}</span><strong>{percent(n)}% <small>({n}/40)</small></strong></div>
            <div className="bar-track"><div style={{ width: percent(n) + '%' }}/></div>
          </div>)}
          <div className="axis"><span>0%</span><span>50%</span><span>100%</span></div>
        </div>
      </div>
      <p className="bench-note">같은 모의고사 40문항. 성적표 순서는 2024년 만점자, 2025년 만점자, AI두윌입니다.</p>
    </div>
  </section>;
}
