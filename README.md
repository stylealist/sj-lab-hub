# sj-lab-hub — 플랫폼 통합 랜딩 허브 (Front-End)

`sj-lab-hub`는 sj-lab 분산 플랫폼의 단일 대문(Landing Hub) 역할을 수행하는 React 기반 웹 애플리케이션입니다. 시설물 관리(2D 지도), 3D 가시화, 예측 모델(Lab), OpenAPI 명세 등 플랫폼의 서브 도메인 및 기능으로 분기하는 중앙 인터페이스를 제공하며, 브라우저가 플랫폼에 진입할 때 단일 로그인(SSO) 상태를 최초로 검증·연계하는 관문입니다.

---

## 1. 서비스 역할 및 핵심 책임

- **통합 서비스 라우팅 및 런치패드**: 2D 지도 시설물 관리, 3D 공간 시뮬레이션, AI 실험실 등 플랫폼 하위 서비스로 연결되는 카드 인터페이스를 제공합니다.
- **최초 SSO 인증 게이트웨이**: React 번들이 로드되기 전 `<head>` 단계에서 토큰 보유 여부를 검사하여, 미인증 사용자에게 서비스 UI가 한 프레임도 노출되지 않도록 로그인 서버(`/auth/login.html`)로 즉시 리다이렉트합니다.
- **환경별 동적 경로 분기**: 로컬 개발 환경(포트 분리: 3000 -> 4000)과 운영 환경(NGINX 서브패스: `/` -> `/map/`) 간의 서비스 이동 URL을 클라이언트 환경에 맞게 동적으로 해석합니다.

---

## 2. 기술 스택

- **프론트엔드 라이브러리**: React 18, React DOM
- **빌드 및 번들러**: Webpack 5, Babel (ES6+, JSX 변환), `HtmlWebpackPlugin`
- **스타일링**: CSS Modules / Inline Styling Architecture
- **배포 환경**: NGINX 정적 파일 서빙 (포트 3000 / 운영 `https://sj-lab.co.kr`)

---

## 3. 사용자 진입 및 SSO 처리 프로세스

### 3.1 진입 시퀀스 다이어그램

```
[사용자 브라우저] (https://sj-lab.co.kr)
       │
       ├─ 1. index.html 수신
       │
       ▼ [Head 인라인 auth-gate 스크립트 실행] (React 로딩 전)
       │  ├─ localStorage 내 토큰 및 유효기간(auth_expires) 검사
       │  │
       │  ├─ [토큰 없음/만료] ──리다이렉트──> [인증서버]
       │  │                                  (/auth/login.html?redirect_uri=...)
       │  │                                        │
       │  │<── #auth_token=JWT&expires=... (반환) ─┘
       │  │
       │  └─ [토큰 유효 / 수신 완료]
       │       └─ 토큰 저장 후 URL 해시 정리
       │
       ▼ 2. React 번들(bundle.js) 로드 및 App 마운트
       │
[랜딩 허브 화면 표출] ──카드 클릭──> [환경별 서브 도메인 이동]
                                     (로컬: :4000 / 운영: /map/)
```

### 3.2 환경별 이동 경로 해석 (`resolveFeaturePath`)
각 서비스 카드의 이동 주소는 클라이언트의 `window.location.hostname`을 기반으로 동적으로 결정됩니다:
- **로컬 환경 (`localhost` / `127.0.0.1`)**: 포트 번호 기반으로 분기 (예: 지도 서비스는 `http://localhost:4000/`)
- **운영 환경 (`sj-lab.co.kr`)**: 동일 오리진 하위 경로 기반으로 분기 (예: 지도 서비스는 `https://sj-lab.co.kr/map/`)

---

## 4. 핵심 엔지니어링 구현 상세

### 4.1 FOUC(Flash of Unauthenticated Content) 방지를 위한 인라인 게이트
- React 번들이 파싱 및 실행되기 전 인증 상태를 판별하기 위해, 게이트 스크립트를 번들러 외부의 `public/index.html` 최상단 `<head>`에 인라인으로 배치했습니다.
- 인증되지 않은 사용자가 레이아웃이나 컴포넌트를 일시적으로 보게 되는 FOUC 현상을 원천 방지하고 즉각적인 로그인 전환을 달성했습니다.

### 4.2 데이터 기반 선언적 런치패드 설계
기능 카드는 `src/App.js`의 `features` 메타데이터 배열을 통해 렌더링됩니다:
```javascript
const features = [
  {
    id: "mapservice",
    title: "시설물 관리 (2D)",
    description: "현장조사 데이터 및 공공 지리정보 기반 시설물 공간 조회/내업 처리",
    path: "/map/",
    isAvailable: true,
    status: "운영 중"
  },
  // ... 추가 서비스 모듈
];
```
신규 서비스 런칭 시 컴포넌트 JSX 구조를 수정하지 않고 설정 배열의 메타데이터 추가만으로 안전하게 카드를 추가/제어할 수 있습니다.

### 4.3 정적 배포 시 하위 서비스 파일 보존 규칙
- 운영 환경에서 `sj-lab-hub`의 빌드 산출물은 웹서버 노드의 `/home/kuber-volume/sj-lab-webserver/html`에 동기화됩니다.
- 해당 디렉터리의 하위 폴더인 `html/map`에는 지도 서비스(`sj-lab-mapservice`)가 독립 배포되어 서빙되므로, 허브 배포 파이프라인에서 상위 디렉터리를 일괄 삭제(`cleanRemote: true`)하지 않고 안전하게 복사하도록 배포 스크립트를 격리 설계했습니다.

---

## 5. 실행 및 개발 환경

### 로컬 개발 서버 기동
```bash
# 의존성 설치
npm install

# Webpack Dev Server 실행 (포트 3000, 핫 리로딩 지원)
npm start
```

### 프로덕션 빌드
```bash
npm run build
```
빌드 결과물은 `build/` 디렉터리에 번들 파일(`bundle.js`)과 HTML로 생성됩니다.
