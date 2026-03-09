import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { AuthService } from '../../src/services/authService.js';

describe('AuthService', () => {
  const service = new AuthService(env);

  describe('authenticateUser', () => {
    it('올바른 자격증명으로 사용자를 반환한다', async () => {
      const user = await service.authenticateUser('admin', 'admin123');

      expect(user).not.toBeNull();
      expect(user.username).toBe('admin');
      expect(user.role).toBe('admin');
    });

    it('잘못된 비밀번호는 null을 반환한다', async () => {
      const user = await service.authenticateUser('admin', 'wrong');
      expect(user).toBeNull();
    });

    it('존재하지 않는 사용자는 null을 반환한다', async () => {
      const user = await service.authenticateUser('unknown', 'pass');
      expect(user).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('JWT 토큰을 생성한다', async () => {
      const user = { id: '1', email: 'admin@example.com', role: 'admin' };
      const token = await service.generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT 형식: header.payload.signature
    });
  });
});
