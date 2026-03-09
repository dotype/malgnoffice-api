# 에러 처리

## 에러 처리 흐름

```
Service (에러 throw) → Route (전파) → errorHandler 미들웨어 (HTTP 응답 변환)
```

## 에러명 → HTTP 상태코드 매핑

| error.name | HTTP 상태코드 | 용도 |
|------------|-------------|------|
| `ValidationError` | 400 Bad Request | 입력값 검증 실패 |
| `UnauthorizedError` | 401 Unauthorized | 인증 실패 |
| `NotFoundError` | 404 Not Found | 리소스 미존재 |
| 기타 | 500 Internal Server Error | 예상치 못한 에러 |

## 서비스에서 에러 throw

```javascript
export class UserService {
  async getUser(userId) {
    if (!userId) {
      const error = new Error('User ID is required');
      error.name = 'ValidationError';
      throw error;
    }

    const user = await this.env.DB
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return user;
  }
}
```

## 라우트에서 에러 전파

라우트는 에러를 catch하지 않고 그대로 throw합니다. 글로벌 에러 핸들러가 처리합니다.

```javascript
router.get('/:id', async (c) => {
  const userService = new UserService(c.env);
  const user = await userService.getUser(c.req.param('id'));
  return c.json({ data: user });
  // 에러 발생 시 자동으로 errorHandler가 처리
});
```

## 글로벌 에러 핸들러

`src/middleware/errorHandler.js`에서 모든 에러를 일관된 JSON 응답으로 변환합니다:

```javascript
// 응답 형식
{
  "error": "ValidationError",
  "message": "User ID is required"
}
```

## 새로운 에러 유형 추가

1. `src/middleware/errorHandler.js`의 에러 매핑에 추가
2. 서비스에서 해당 `error.name`으로 throw

```javascript
// errorHandler.js에 추가
case 'ForbiddenError':
  return c.json({ error: 'ForbiddenError', message: err.message }, 403);

// 서비스에서 사용
const error = new Error('Permission denied');
error.name = 'ForbiddenError';
throw error;
```
