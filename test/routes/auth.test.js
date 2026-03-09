import { env, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('POST /auth/login', () => {
  it('로그인 성공 시 토큰을 반환한다', async () => {
    const res = await SELF.fetch('http://localhost/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.token).toBeDefined();
    expect(body.user.role).toBe('admin');
  });

  it('잘못된 비밀번호는 401을 반환한다', async () => {
    const res = await SELF.fetch('http://localhost/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrong' }),
    });

    expect(res.status).toBe(401);
  });

  it('필수 필드 누락 시 400을 반환한다', async () => {
    const res = await SELF.fetch('http://localhost/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin' }),
    });

    expect(res.status).toBe(400);
  });
});
