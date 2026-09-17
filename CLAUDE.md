# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

SJ-LAB Hub는 React + Webpack 기반의 단일 페이지 랜딩 허브입니다. 시설물 관리(지도), 3D 가시화, Lab, OpenAPI 등 여러 하위 기능으로 진입하는 카드형 UI 하나만 제공하는 아주 작은 프로젝트입니다. 별도 라우터 없이 `window.location.href`로 각 기능 경로(`/map`, `/3d`, `/lab`, `/openapi`)로 이동하며, 아직 개발되지 않은 기능은 클릭 시 alert만 표시합니다.

## 명령어

- `npm start` — webpack-dev-server로 개발 서버 실행 (포트 3000, hot reload, 자동 브라우저 오픈)
- `npm run build` — production 모드로 `build/` 디렉터리에 번들 생성

테스트·린트 스크립트는 아직 구성되어 있지 않습니다. 변경 후 정확성 확인은 `npm start`로 브라우저에서 직접 확인하거나 `npm run build`로 빌드 성공 여부를 확인하는 방식이 유일한 검증 수단입니다.

## 아키텍처

- 엔트리 포인트: [src/index.js](src/index.js) → `createRoot`로 [src/App.js](src/App.js)의 `App` 컴포넌트를 `#root`에 렌더링
- [src/App.js](src/App.js) 최상단의 `features` 배열이 전체 UI를 구동하는 단일 데이터 소스입니다. 각 항목은 `title`, `gradient`, `icon`, `description`, `path`, `isAvailable`, `status`(비활성 시 배지 문구)로 구성되며, 새 기능 카드를 추가/수정하려면 이 배열만 편집하면 됩니다.
- 카드 클릭 핸들러 `handleCardClick`은 `isAvailable`이 true면 `path`로 이동하고, false면 `status`를 포함한 alert를 표시합니다. react-router 등 별도 라우팅 라이브러리는 사용하지 않습니다.
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