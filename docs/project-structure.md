# 프로젝트 구조

```
src/
├── index.js              # 엔트리 포인트 (미들웨어 등록, 라우트 마운트, PUBLIC_PATHS 정의)
├── openapi.js            # OpenAPI 3.0 스펙 정의
├── routes/               # API 라우트 핸들러
├── services/             # 비즈니스 로직 (클래스 기반)
├── middleware/            # 미들웨어 (인증, 에러 핸들링)
└── utils/                # 유틸리티 함수
```

## 폴더별 역할

### `routes/`

- HTTP 요청/응답 처리
- 입력 검증
- 서비스 호출
- **규칙**: 비즈니스 로직 포함 금지, 서비스 레이어에 위임
- **Export**: `export default router` (default export)

### `services/`

- 비즈니스 로직
- 외부 API 통합
- 데이터 처리 (D1, KV, R2 접근)
- **규칙**: 반드시 클래스 기반, `constructor(env)` 패턴
- **Export**: `export class SomeService` (named export)

### `middleware/`

- 인증 (`auth.js`): JWT 검증, 사용자 컨텍스트 설정
- 에러 핸들링 (`errorHandler.js`): 에러명 → HTTP 상태코드 매핑
- **규칙**: Hono 미들웨어 패턴 사용

### `utils/`

- 범용 유틸리티 함수 (`utils.js`)
- `formatResponse()`, `isValidEmail()`, `generateId()` 등
- **규칙**: 상태 없는(stateless) 순수 함수

## 주요 파일

| 파일 | 역할 |
|------|------|
| `src/index.js` | 앱 초기화, 미들웨어 스택, 라우트 등록, PUBLIC_PATHS |
| `src/openapi.js` | Swagger/OpenAPI 스펙 |
| `schema.sql` | D1 데이터베이스 스키마 |
| `wrangler.toml` | Cloudflare Workers 배포 설정 |
| `.dev.vars` | 로컬 환경 변수 (git 제외) |
