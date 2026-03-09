# Test 템플릿

## 라우트 통합 테스트

```javascript
import { env, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('GET /examples', () => {
  it('목록을 반환한다', async () => {
    const res = await SELF.fetch('http://localhost/examples');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});

describe('POST /examples', () => {
  it('새 항목을 생성한다', async () => {
    const res = await SELF.fetch('http://localhost/examples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test' }),
    });

    expect(res.status).toBe(201);
  });

  it('필수 필드 누락 시 400을 반환한다', async () => {
    const res = await SELF.fetch('http://localhost/examples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });
});
```

## 서비스 단위 테스트

```javascript
import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { ExampleService } from '../../src/services/exampleService.js';

describe('ExampleService', () => {
  const service = new ExampleService(env);

  it('항목을 생성하고 조회한다', async () => {
    const created = await service.create({ name: 'test' });
    expect(created).toBeDefined();

    const found = await service.getById(created.id);
    expect(found.name).toBe('test');
  });

  it('존재하지 않는 항목 조회 시 NotFoundError를 던진다', async () => {
    await expect(service.getById('nonexistent'))
      .rejects.toThrow('not found');
  });
});
```

## 인증이 필요한 라우트 테스트

```javascript
import { env, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

// 토큰을 먼저 발급받는 헬퍼
async function getAuthToken() {
  const res = await SELF.fetch('http://localhost/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const { token } = await res.json();
  return token;
}

describe('GET /protected-resource', () => {
  it('토큰 없이 접근하면 401을 반환한다', async () => {
    const res = await SELF.fetch('http://localhost/protected-resource');
    expect(res.status).toBe(401);
  });

  it('유효한 토큰으로 접근하면 성공한다', async () => {
    const token = await getAuthToken();
    const res = await SELF.fetch('http://localhost/protected-resource', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
  });
});
```
