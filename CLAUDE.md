# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

SJ-LAB Hub는 React + Webpack 기반의 단일 페이지 랜딩 허브입니다. 시설물 관리(지도), 3D 가시화, Lab, OpenAPI 등 여러 하위 기능으로 진입하는 카드형 UI 하나만 제공하는 아주 작은 프로젝트입니다. 별도 라우터 없이 `window.location.href`로 각 기능 경로(`/map`, `/3d`, `/lab`, `/openapi`)로 이동하며, 아직 개발되지 않은 기능은 클릭 시 alert만 표시합니다.

## 명령어

- `npm start` — webpack-dev-server로 개발 서버 실행 (포트 3000, hot reload, 자동 브라우저 오픈)
- `npm run build` — production 모드로 `build/` 디렉터리에 번들 생성

테스트·린트 스크립트는 아직 구성되어 있지 않습니다. 변경 후 정확성 확인은 `npm start`로 브라우저에서 직접 확인하거나 `npm run build`로 빌드 성공 여부를 확인하는 방식이 유일한 검증 수단입니다.

## 아키텍처

- **SSO 로그인 게이트(2026-09-22 추가)**: [public/index.html](public/index.html)의 `<head>` 맨 위, React 번들보다 먼저 실행되는 인라인 스크립트가 로그인 여부를 확인한다. `localStorage`(`sjLabAuthToken`)에 유효한 토큰이 없으면 `sj-lab-authserver`의 공유 로그인 페이지(`/auth/login.html?redirect_uri=...`)로 즉시 리다이렉트하고, 로그인 서버가 다시 이 사이트로 돌려보낼 때 URL 해시(`#auth_token=...`)에 실려 오는 토큰을 저장한다. 전역 `window.SjLabAuth`(`getToken`/`getUsername`/`logout`)를 앱 어디서든 쓸 수 있다. **이 스크립트는 `HtmlWebpackPlugin`이 템플릿을 그대로 복사하기 때문에 인라인으로 유지한다** — 별도 파일(`public/*.js`)은 `npm start`(devServer의 `static`)에서는 서빙되지만 `npm run build` 결과(`build/`)에는 자동으로 복사되지 않으므로 쓰지 말 것(favicon만 `HtmlWebpackPlugin`의 `favicon` 옵션으로 예외 처리됨). `sj-lab-mapservice`의 `js/auth-gate.js`와 로직이 동일하며, 한쪽을 고치면 다른 쪽도 함께 고쳐야 한다. 자세한 SSO 흐름은 `sj-lab-authserver`의 `CLAUDE.md` 참고.
- [src/App.js](src/App.js) 우측 상단(`userBoxStyle`)에 "👤 아이디님" 형태의 접속자 표시(`userNameStyle`/`userIconStyle`/`userIdStyle`, `SjLabAuth.getUsername()`)와 로그아웃 버튼(`logoutButtonStyle`, `SjLabAuth.logout()`)이 있다.
- 엔트리 포인트: [src/index.js](src/index.js) → `createRoot`로 [src/App.js](src/App.js)의 `App` 컴포넌트를 `#root`에 렌더링
- [src/App.js](src/App.js) 최상단의 `features` 배열이 전체 UI를 구동하는 단일 데이터 소스입니다. 각 항목은 `title`, `gradient`, `icon`, `description`, `path`, `isAvailable`, `status`(비활성 시 배지 문구)로 구성되며, 새 기능 카드를 추가/수정하려면 이 배열만 편집하면 됩니다.
- 카드 클릭 핸들러 `handleCardClick`은 `isAvailable`이 true면 `path`로 이동하고, false면 `status`를 포함한 alert를 표시합니다. react-router 등 별도 라우팅 라이브러리는 사용하지 않습니다. `resolveFeaturePath()`(2026-09-22 추가)가 `path === "/map"`이고 로컬(`localhost`/`127.0.0.1`)이면 `http://localhost:4000`으로 바꿔치기합니다 — 로컬에서는 `sj-lab-mapservice`가 이 허브와 다른 포트에서 별도로 뜨기 때문에 상대경로로는 못 가고, 운영은 nginx가 `sj-lab.co.kr/map/`을 같은 오리진의 하위 경로로 서빙하므로 상대경로를 그대로 둡니다(`sj-lab-mapservice`의 `getApiUrl()`과 같은 hostname 분기 패턴).
- 스타일은 전부 인라인 style 객체(`camelCase` JS 객체, `xxxStyle` 네이밍)로 [src/App.js](src/App.js) 하단에 정의되어 있으며, 별도 CSS 파일이나 CSS-in-JS 라이브러리는 쓰지 않습니다.
- [public/index.html](public/index.html)에 Google Fonts(Poppins, Inter) 프리로드와 초기 로딩 화면(`.loading`)이 정의되어 있고, 실제 앱은 이 정적 HTML의 `#root`에 마운트됩니다.
- 탭 아이콘은 [public/favicon.svg](public/favicon.svg)입니다. 허브 배경색(슬레이트) 위에 `features` 네 카드의 그라데이션 시작색(파랑·초록·주황·보라)을 2×2 타일로 배치한 모양이라, **카드를 추가·삭제하거나 카드 색을 바꾸면 이 파일도 함께 고칠 것**. 지도 서비스(`sj-lab-mapservice`)의 집 모양 아이콘과는 일부러 다르게 만들었습니다. `public/index.html`에 `<link rel="icon">`을 직접 넣지 말 것 — `HtmlWebpackPlugin`의 `favicon` 옵션이 `build/`로 파일을 복사하고 링크를 주입하므로, 템플릿에 따로 넣으면 링크가 두 번 생기거나 빌드 결과에 파일이 빠집니다.
- 빌드는 [webpack.config.js](webpack.config.js) 기준으로 [src/index.js](src/index.js)를 엔트리로 `build/bundle.js`를 생성하고, `HtmlWebpackPlugin`이 [public/index.html](public/index.html)을 템플릿으로 사용합니다. [.babelrc](.babelrc)는 `@babel/preset-env`, `@babel/preset-react`만 사용하며 TypeScript는 쓰지 않습니다.

## 참고

### 코드 스타일 컨벤션

- 화면에 노출되는 텍스트(제목 등)는 한국어, `description`·변수명·주석은 영어를 혼용하는 기존 패턴을 따릅니다.
- 새 style 객체를 추가할 때는 기존처럼 `xxxStyle` 네이밍과 파일 하단 배치 컨벤션을 유지합니다.

### 알려진 제약

- 라우팅 라이브러리가 없으므로 `/map`, `/3d`, `/lab`, `/openapi` 경로 이동 시 실제 페이지가 존재하는지는 이 저장소 범위 밖(별도 배포/서버) 문제일 수 있습니다.
- 테스트 프레임워크가 구성되어 있지 않으므로, 변경 후에는 반드시 `npm start`로 브라우저에서 동작을 직접 확인해야 합니다.

## 통합 허브

저장소를 넘나드는 작업(DB → 백엔드 → 디스커버리 → 게이트웨이 → 프론트엔드 → 배포)의 총괄 기준 저장소는 `C:\developer\workspace\mapservice-rest`입니다. 시스템 전체 구조·API 계약·배포 경로는 그 저장소의 `docs/system-architecture.md`, 로컬 포트·기동 순서·CORS는 `docs/dev-environment.md`에 있고, MCP(GitHub/DB)와 로컬 비밀값도 그 저장소에서만 관리합니다.