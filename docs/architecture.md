# 아키텍처 패턴

## 레이어 구조

```
HTTP Request
    ↓
Middleware (logger → cors → auth)
    ↓
Route (입력 검증, 서비스 호출)
    ↓
Service (비즈니스 로직, 데이터 접근)
    ↓
Cloudflare Bindings (DB, KV, BUCKET)
    ↓
HTTP Response
```

## 서비스 레이어 패턴

모든 서비스는 **클래스 기반**으로 작성하며, `constructor(env)` 로 Cloudflare 바인딩을 주입받습니다.

```javascript
export class UserService {
  constructor(env) {
    this.env = env;
  }

  async getUser(userId) {
    // KV 캐시 확인
    const cached = await this.env.KV.get(`user:${userId}`, { type: 'json' });
    if (cached) return cached;

    // D1 조회
    const user = await this.env.DB
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    // 캐시 저장
    if (user) {
      await this.env.KV.put(`user:${userId}`, JSON.stringify(user), {
        expirationTtl: 3600
      });
    }

    return user;
  }
}
```

## 라우트 패턴

라우트는 **입력 검증만** 하고 비즈니스 로직은 서비스에 위임합니다.

```javascript
import { Hono } from 'hono';
import { UserService } from '../services/userService.js';

const users = new Hono();

users.get('/:id', async (c) => {
  const userId = c.req.param('id');
  const userService = new UserService(c.env);
  const user = await userService.getUser(userId);
  return c.json({ data: user });
});

export default users;
```

## 미들웨어 실행 순서

`src/index.js`에서 등록된 순서대로 실행됩니다:

1. `logger()` — 요청 로깅
2. `cors()` — CORS 헤더
3. `authMiddleware` — JWT 검증 (PUBLIC_PATHS 제외)
4. Route handler — 실제 요청 처리
5. `errorHandler` — 전역 에러 처리 (onError)

## 레이어별 책임 경계

| 레이어 | 해야 하는 것 | 하면 안 되는 것 |
|--------|------------|--------------|
| Route | 입력 검증, `c.json()` 응답, 서비스 호출 | DB 직접 접근, 비즈니스 로직 |
| Service | 비즈니스 로직, 바인딩(DB/KV/R2) 접근, 에러 throw | HTTP 응답 생성, `c` 컨텍스트 접근 |
| Middleware | 횡단 관심사 (인증, 로깅, CORS) | 비즈니스 로직 |
| Utils | 순수 헬퍼 함수 | 상태 보유, 바인딩 접근 |
