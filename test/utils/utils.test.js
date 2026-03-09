import { describe, it, expect } from 'vitest';
import { formatResponse, isValidEmail, generateId } from '../../src/utils/utils.js';

describe('formatResponse', () => {
  it('formattedAt 타임스탬프를 추가한다', () => {
    const result = formatResponse({ name: 'test' });

    expect(result.name).toBe('test');
    expect(result.formattedAt).toBeDefined();
  });

  it('plain object가 아니면 TypeError를 던진다', () => {
    expect(() => formatResponse(null)).toThrow(TypeError);
    expect(() => formatResponse([1, 2])).toThrow(TypeError);
  });

  it('불변 객체를 반환한다', () => {
    const result = formatResponse({ name: 'test' });
    expect(Object.isFrozen(result)).toBe(true);
  });
});

describe('isValidEmail', () => {
  it('유효한 이메일을 인식한다', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('잘못된 이메일을 거부한다', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('문자열이 아니면 false를 반환한다', () => {
    expect(isValidEmail(123)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('generateId', () => {
  it('고유 ID를 생성한다', () => {
    const id = generateId();
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('prefix를 붙일 수 있다', () => {
    const id = generateId('user');
    expect(id.startsWith('user-')).toBe(true);
  });

  it('prefix가 문자열이 아니면 TypeError를 던진다', () => {
    expect(() => generateId(123)).toThrow(TypeError);
  });
});
