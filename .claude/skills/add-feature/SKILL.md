---
name: add-feature
description: Scaffold a new feature card on the SJ-LAB Hub landing page by adding an entry to the features array in src/App.js, following the project's existing conventions (gradient, icon, path, availability badge). Use when the user asks to add a new feature/card/section to the hub.
---

## 목적

[src/App.js](../../../src/App.js)의 `features` 배열에 새 카드 항목을 기존 패턴에 맞게 추가합니다. 이 배열이 랜딩 페이지 UI 전체를 구동하는 단일 데이터 소스입니다.

## 절차

1. `src/App.js`를 읽고 기존 `features` 배열 항목들의 패턴을 확인합니다. 각 항목은 다음 필드를 가집니다.
   - `title`: 카드에 표시될 한국어 제목
   - `gradient`: `linear-gradient(135deg, #색상1 0%, #색상2 100%)` 형식의 CSS 그라디언트 문자열. 기존 카드들과 겹치지 않는 색상 조합을 고릅니다.
   - `icon`: 이모지 하나
   - `description`: 영어로 된 짧은 설명 (예: "Interactive Maps")
   - `path`: 이동할 경로 (예: `/lab`)
   - `isAvailable`: 기능이 실제로 준비되었으면 `true`, 아니면 `false`
   - `status`: `isAvailable`이 `false`일 때만 필요 (예: `"Coming Soon"`). `true`이면 이 필드는 생략합니다.
2. 사용자가 제공한 기능 이름/설명/경로를 바탕으로 위 형식에 맞는 새 객체를 `features` 배열 끝에 추가합니다. 사용자가 그라디언트 색상을 지정하지 않았다면 기존 카드들과 톤이 어울리면서 겹치지 않는 색을 고릅니다.
3. `isAvailable: true`로 추가하는 경우, 사용자가 실제 페이지 구현까지 요청했는지 확인합니다 — 이 배열만 수정하면 카드는 보이지만 `path`로 이동했을 때 실제 페이지가 없으면 깨집니다. 페이지 구현이 범위 밖이면 사용자에게 알립니다.
4. 다른 파일(스타일 정의, 컴포넌트 구조 등)은 건드리지 않습니다 — `features` 배열 수정만으로 카드가 그리드에 자동 반영됩니다.
5. 변경 후 `npm start`로 개발 서버를 띄워 카드가 올바르게 렌더링되는지 육안으로 확인할 것을 권장합니다.
