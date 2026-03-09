# Architecture Rules

- 흐름: Request → Middleware(logger,cors,auth) → Route → Service → Bindings → Response
- Route: 입력 검증 + 서비스 호출만. 비즈니스 로직/DB 접근 금지
- Service: 클래스 기반, `constructor(env)`로 바인딩 주입, named export
- Route는 `export default router`, Service는 `export class`
- 파일명 camelCase (`authService.js`), 클래스명 PascalCase (`AuthService`)
- 에러: 서비스에서 `error.name` 지정 후 throw → errorHandler가 자동 매핑 (ValidationError→400, UnauthorizedError→401, NotFoundError→404)
- 바인딩: `c.env.DB` / `this.env.KV` / `this.env.BUCKET` 직접 사용
- `process.env` 사용 금지, Node.js 전용 API 사용 금지
- 공개 경로는 `src/index.js`의 `PUBLIC_PATHS`에 등록
- 환경 변수: 로컬은 `.dev.vars`, 프로덕션은 `wrangler secret`
- 세부 패턴과 예제는 `docs/architecture.md`, `docs/adding-features.md`, `docs/error-handling.md` 등을 직접 읽어서 확인할 것
