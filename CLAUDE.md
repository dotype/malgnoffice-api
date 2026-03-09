# CLAUDE.md

Cloudflare Workers + Hono 프레임워크 기반 API 서버 템플릿입니다.

## 프로젝트 구조

```
src/
├── index.js              # 엔트리 포인트 (미들웨어, 라우트 등록)
├── openapi.js            # OpenAPI 3.0 스펙
├── routes/               # API 라우트 핸들러 (입력 검증 + 서비스 호출만)
├── services/             # 비즈니스 로직 (클래스 기반, env 주입)
├── middleware/            # 인증, 에러 핸들링
└── utils/                # 상태 없는 유틸리티 함수
```

## 기술 스택

- **런타임**: Cloudflare Workers
- **프레임워크**: Hono
- **인증**: JWT (jose, HS256, 24시간 만료)
- **API 문서**: Swagger UI (`/docs`), OpenAPI 3.0
- **DB**: D1 (SQLite) - 스키마: `schema.sql`
- **스토리지**: KV (캐시), R2 (파일)

## 주요 명령어

```bash
npm run dev       # 로컬 개발 서버 (port 8787)
npm run deploy    # 프로덕션 배포
npm run test      # 테스트 실행
npm run test:watch # 테스트 감시 모드
```

## 테스트 계정

- admin / admin123 (role: admin)
- user / user123 (role: user)

## 새 기능 추가 순서

1. `src/services/{name}Service.js` — 서비스 클래스 생성
2. `src/routes/{name}.js` — 라우트 핸들러 생성 (Hono 라우터 default export)
3. `src/index.js` — `app.route('/{name}', routes)` 등록
4. `src/openapi.js` — API 스펙 업데이트

## 세부 개발 가이드

작업 전 관련 docs 파일을 반드시 읽을 것:

- `docs/project-structure.md` — 폴더 구조, 파일별 역할
- `docs/coding-conventions.md` — 네이밍, Export 패턴, 코드 스타일
- `docs/architecture.md` — 레이어 구조, 서비스/라우트 패턴
- `docs/cloudflare-bindings.md` — KV, D1, R2 사용법
- `docs/authentication.md` — JWT, 공개 경로, 사용자 정보 접근
- `docs/environment.md` — .dev.vars, Wrangler Secrets
- `docs/error-handling.md` — 에러 throw 패턴, 상태코드 매핑
- `docs/adding-features.md` — 엔드포인트/서비스 추가 순서, 체크리스트

## 슬래시 커맨드

- `/endpoint` — 새 API 엔드포인트 추가 (서비스 + 라우트 + 등록 + OpenAPI)
- `/service` — 새 서비스 클래스 생성
- `/review` — 현재 변경 사항을 프로젝트 컨벤션 기준으로 코드 리뷰
- `/test` — 지정된 기능에 대한 테스트 작성

## 참고 자료

- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [Hono 문서](https://hono.dev/)
- [Wrangler 문서](https://developers.cloudflare.com/workers/wrangler/)
