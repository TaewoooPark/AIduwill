# AIduwill Glass

에듀윌 홈을 UIForge로 기록·복원한 한국어 패러디 사이트입니다. 원본의 영상 인트로, 중앙 메뉴, 본문 10개 구역, 엔딩 배너와 푸터를 따라갑니다. AI 안경과 모의 성적표, 12명의 강사는 이 프로젝트에서 창작했습니다. 본문 뒤에는 원본 특강 전단을 바탕으로 만든 AI두윌 글래스 광고 26장, 공지사항, 상담센터, 손글씨 슬로건을 복원했습니다.

[공개 사이트](https://taewooopark.github.io/AIduwill/)

- `npm run standalone`으로 만든 `AIduwill.html`을 브라우저에서 열면 영상, 사진, 폰트, 메뉴와 연습 콘텐츠를 오프라인에서 사용할 수 있습니다. 수석 밀착취재 릴스 10편은 새로 생성한 사진에 움직임과 한글 자막을 넣은 8초짜리 무음 영상입니다. 릴스도 오프라인에서 재생됩니다.
- `npm install` 후 `npm run dev`로 편집합니다. `npm run build`는 정적 사이트를, `npm run standalone`은 단일 HTML도 함께 만듭니다.
- `src/home/`에 UIForge 복원 마크업을 구역별로 담았습니다. `faculty.html`은 강사 카드, `library.json`은 과목 노트와 강사별 대결 원고입니다. `src/Reader.jsx`와 `src/Overlays.jsx`에서 성적표, 칠판과 렌즈의 비교, 연습문제, 제품 사진을 표시합니다.
- 로컬 작업 폴더의 `archive/`는 UIForge가 2026년 11월 16일에 기록한 응답 259개와 로컬 재생 서버입니다. `node archive/serve.mjs`로 실행합니다. `restore/`는 원본 React 복원본입니다. 강사 코너를 바로 열려면 사이트 주소 뒤에 `#professor-section-app`을 붙입니다.

[에듀윌 원본 홈](https://www.eduwill.net/sites/home) · [UIForge](https://github.com/TaewoooPark/UIForge) (`00eca20`)
