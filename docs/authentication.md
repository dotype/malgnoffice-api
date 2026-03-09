# 인증 및 보안

## JWT 인증 흐름

```
Client → Authorization: Bearer <token> → authMiddleware → Route Handler
```

- **알고리즘**: HS256
- **라이브러리**: jose (`jwtVerify`, `SignJWT`)
- **토큰 만료**: 24시간

## 공개 경로 (인증 불필요)

`src/index.js`의 `PUBLIC_PATHS`에 정의합니다:

```javascript
const PUBLIC_PATHS = ['/health', '/docs', '/auth'];
```

- `/health` — 헬스 체크
- `/docs` — Swagger UI
- `/openapi.json` — OpenAPI 스펙
- `/auth` — 로그인 등 인증 엔드포인트

새 공개 경로를 추가하려면 이 배열에 추가하세요.

## 인증된 사용자 정보 접근

`authMiddleware`가 JWT 페이로드에서 추출하여 Hono 컨텍스트에 설정합니다:

```javascript
router.get('/profile', async (c) => {
  const userId = c.get('userId');       // JWT sub 또는 userId
  const userEmail = c.get('userEmail'); // JWT email
  const userRole = c.get('userRole');   // JWT role
  const jwtPayload = c.get('jwtPayload'); // 전체 페이로드
});
```

## 토큰 생성

```javascript
import { AuthService } from '../services/authService.js';

const authService = new AuthService(c.env);
const token = await authService.generateToken(user);
// → { sub: user.id, email: user.email, role: user.role, exp: 24h }
```

## 비밀 키 관리

- **로컬**: `.dev.vars`에 `JWT_SECRET=...` 설정
- **프로덕션**: `wrangler secret put JWT_SECRET --env production`

## 테스트 계정

| 아이디 | 비밀번호 | 역할 |
|--------|----------|------|
| admin | admin123 | admin |
| user | user123 | user |
