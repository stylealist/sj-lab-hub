# sj-lab-hub — 서비스 첫 화면

> sj-lab의 **랜딩 허브**입니다. 시설물 관리(지도)·3D 가시화·Lab·OpenAPI 등 하위 기능으로 들어가는 입구이자, **SSO 로그인이 처음 걸리는 지점**입니다.

| | |
|---|---|
| **데모** | https://sj-lab.co.kr (로그인 화면의 **체험용 계정 버튼**으로 바로 입장) |
| **스택** | React 18 · Webpack 5 · Babel · 라우터 없음 · 인라인 style 객체 |
| **로컬** | `http://localhost:3000` |

---

## 1. 위치

```
[이 사이트] sj-lab.co.kr  ──카드 클릭──▶  sj-lab.co.kr/map/ (지도, 별도 저장소)
      │                                    로컬은 http://localhost:4000
      │ 토큰 없으면 리다이렉트
      ▼
[로그인 서버] /auth/login.html?redirect_uri=...  → 해시로 토큰 반환
```

작은 앱이지만 **여러 사이트가 로그인 상태를 공유하는 구조의 시작점**이라, 아래 두 가지가 이 저장소의 핵심입니다.

---

## 2. 면접에서 봐주셨으면 하는 부분

### ① SSO 게이트를 번들보다 먼저 실행

로그인하지 않은 화면이 **한 프레임도 보이지 않도록**, 게이트 스크립트를 `public/index.html`의 `<head>` 최상단 인라인으로 두어 React 번들보다 먼저 실행합니다. `localStorage`에 유효한 토큰이 없으면 즉시 공유 로그인 페이지로 보내고, 돌아올 때 URL 해시로 실려 오는 토큰을 저장한 뒤 주소창에서 지웁니다.

> **인라인으로 둔 이유(실제로 겪은 문제)**: `public/*.js`로 분리하면 `npm start`에서는 서빙되지만 `npm run build` 결과(`build/`)에는 복사되지 않아 **운영에서만 게이트가 사라집니다**. favicon만 `HtmlWebpackPlugin`의 `favicon` 옵션으로 예외 처리했습니다.

같은 로직이 지도 저장소(`js/auth-gate.js`)에도 있습니다. 빌드 도구가 달라(webpack vs 무빌드 정적) 공유 모듈 대신 **의도적으로 복제**하고, "한쪽을 고치면 다른 쪽도"를 양쪽 문서에 규칙으로 남겼습니다.

### ② 환경별 이동 경로 분기

로컬에서는 지도가 **다른 포트**(4000)에 뜨고, 운영에서는 nginx가 **같은 오리진의 하위 경로**(`/map/`)로 서빙합니다. 그래서 `resolveFeaturePath()`가 hostname을 보고 분기합니다. 지도 쪽에도 짝이 되는 허브 링크 분기가 있어, 두 사이트를 오가는 동선이 로컬·운영 모두에서 동작합니다.

### ③ 데이터 한 곳으로 화면 구동

카드 UI 전체가 `src/App.js` 최상단 `features` 배열 하나로 그려집니다.

```js
{ title, gradient, icon, description, path, isAvailable, status }
```

기능을 추가·비활성화할 때 **JSX를 건드리지 않고 배열만** 수정하면 되고, `isAvailable: false`면 준비 중 안내를 표시합니다. 파비콘이 카드 네 개의 그라데이션 색을 2×2로 배치한 모양이라, 카드 색을 바꾸면 파비콘도 함께 고치도록 문서에 적어 두었습니다.

---

## 3. 실행

```bash
npm install
npm start      # webpack-dev-server, 3000, hot reload
npm run build  # production 번들 → build/
```

테스트·린트는 구성돼 있지 않습니다. 검증은 `npm start` 브라우저 확인 또는 빌드 성공 여부입니다.

---

## 4. 구조

| 파일 | 역할 |
|---|---|
| `src/index.js` | `createRoot`로 `App`을 `#root`에 마운트 |
| `src/App.js` | 화면 전체. `features` 배열 + 하단 `xxxStyle` 인라인 스타일 객체 |
| `public/index.html` | HTML 템플릿. **SSO 게이트 인라인 스크립트**, 폰트 프리로드, 초기 로딩 화면 |
| `public/favicon.svg` | 탭 아이콘(카드 색 2×2 타일) |
| `webpack.config.js` | `src/index.js` → `build/bundle.js`, `HtmlWebpackPlugin` |

---

## 5. 배포

Jenkins가 빌드 결과(`build/`)를 웹서버 노드의 `/home/kuber-volume/sj-lab-webserver/html`로 복사하고 nginx가 서빙합니다.

> ⚠️ **지도 사이트가 이 디렉터리의 하위 폴더(`html/map`)에 있습니다.** 허브 배포가 상위를 통째로 비우면(`cleanRemote: true`) 지도가 함께 지워집니다 — 실제로 반복 발생했고, 원인과 안전한 배포 스테이지를 총괄 저장소의 `docs/deploy-static-sites.md`·`docs/jenkins/sj-lab-hub-pipeline.groovy`에 정리했습니다.

---

## 6. 한계

- 라우터가 없어 경로 이동은 `window.location.href`입니다(사이트 규모상 의도한 선택).
- 게이트는 **화면 접근만** 막습니다. 백엔드 API는 토큰을 강제하지 않습니다.
- 번들 파일명이 고정(`bundle.js`)이라 캐시 무효화가 약합니다(`contenthash` 적용은 배포 잡 확인 후 과제로 남겨 둠).

## 참고

- 전체 구조·배포 경로: 총괄 저장소 `mapservice-rest`의 `docs/system-architecture.md`
- SSO 흐름 상세: `sj-lab-authserver`의 `CLAUDE.md`
- 작업 규칙: 이 저장소의 `CLAUDE.md`
