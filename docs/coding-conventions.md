# 코딩 컨벤션

## 파일명

모든 파일은 **camelCase**로 작성합니다.

| 유형 | 패턴 | 예시 |
|------|------|------|
| 서비스 | `{name}Service.js` | `authService.js`, `userService.js` |
| 라우트 | `{name}.js` | `users.js`, `auth.js`, `products.js` |
| 미들웨어 | `{name}.js` | `auth.js`, `errorHandler.js` |
| 유틸리티 | `utils.js` | `utils.js` |

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수 | `camelCase` | `userId`, `tokenData` |
| 함수 | `camelCase` | `getUser()`, `formatResponse()` |
| 클래스 | `PascalCase` | `UserService`, `AuthService` |
| 상수 | `UPPER_SNAKE_CASE` | `PUBLIC_PATHS`, `JWT_SECRET` |

## Export 패턴

```javascript
// ✅ 서비스: named class export
export class UserService {
  constructor(env) { ... }
}

// ✅ 라우트: default export (Hono 라우터)
const router = new Hono();
export default router;

// ✅ 유틸리티: named function export
export const formatResponse = (data) => { ... };

// ❌ 서비스에 default export 사용 금지
export default class UserService { ... }  // 하지 마세요
```

## 코드 스타일

- `async/await` 사용 (Promise 체이닝 지양)
- Cloudflare Workers 호환 API만 사용 (`process.env` 금지)
- 불필요한 추상화 금지 — Cloudflare 바인딩은 직접 사용
