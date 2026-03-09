# 환경 변수 관리

## 로컬 개발 (`.dev.vars`)

Wrangler가 자동으로 로드하는 로컬 환경 변수 파일입니다.

```bash
# .dev.vars
ENVIRONMENT=development
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-...
```

**주의**: `.dev.vars`는 `.gitignore`에 포함되어 있으며 절대 커밋하지 마세요.

## 프로덕션 (Wrangler Secrets)

민감한 정보는 Wrangler Secrets로 관리합니다:

```bash
wrangler secret put JWT_SECRET --env production
wrangler secret put OPENAI_API_KEY --env production
```

## 비민감 변수 (`wrangler.toml`)

비밀이 아닌 설정값은 `wrangler.toml`에 직접 정의합니다:

```toml
[vars]
ENVIRONMENT = "development"
AI_GATEWAY_URL = "https://gateway.ai.cloudflare.com/v1/..."
```

## 코드에서 접근

```javascript
// 라우트 핸들러에서
const env = c.env.ENVIRONMENT;
const secret = c.env.JWT_SECRET;

// 서비스 클래스에서 (constructor 주입)
constructor(env) {
  this.apiKey = env.OPENAI_API_KEY;
  this.secret = env.JWT_SECRET;
}
```

**금지**: `process.env` 사용 — Cloudflare Workers에서 지원하지 않습니다.

## 환경별 설정 (`wrangler.toml`)

```toml
# 개발 환경
[env.dev]
name = "workers-template-dev"

# 프로덕션 환경
[env.production]
name = "workers-template-prod"
```

## 주요 명령어

```bash
npm run dev       # 로컬 개발 서버 (port 8787, .dev.vars 자동 로드)
npm run deploy    # 프로덕션 배포
```
