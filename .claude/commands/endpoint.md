# 새 API 엔드포인트 추가

사용자가 요청한 새 API 엔드포인트를 프로젝트 컨벤션에 맞게 추가합니다.

## 작업 순서

1. `docs/adding-features.md`를 읽고 프로젝트 컨벤션을 확인합니다.
2. `.claude/templates/`의 템플릿을 참고하여 다음 파일들을 생성/수정합니다:
   - `src/services/{name}Service.js` — 서비스 클래스 (constructor(env) 패턴)
   - `src/routes/{name}.js` — Hono 라우터 (default export)
   - `src/index.js` — 라우트 등록 (`app.route()`)
   - `src/openapi.js` — OpenAPI 스펙에 엔드포인트 추가
3. 인증이 불필요한 경우 `src/index.js`의 `PUBLIC_PATHS`에 추가합니다.

## 엔드포인트 정보

$ARGUMENTS
