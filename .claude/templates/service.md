# Service 템플릿

## 기본 구조

```javascript
import { formatResponse } from '../utils/utils.js';

export class ExampleService {
  constructor(env) {
    this.env = env;
  }

  async getAll() {
    const { results } = await this.env.DB
      .prepare('SELECT * FROM examples ORDER BY created_at DESC')
      .all();
    return formatResponse(results);
  }

  async getById(id) {
    if (!id) {
      const error = new Error('ID is required');
      error.name = 'ValidationError';
      throw error;
    }

    const item = await this.env.DB
      .prepare('SELECT * FROM examples WHERE id = ?')
      .bind(id)
      .first();

    if (!item) {
      const error = new Error('Item not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return formatResponse(item);
  }

  async create(data) {
    const result = await this.env.DB
      .prepare('INSERT INTO examples (name, description) VALUES (?, ?)')
      .bind(data.name, data.description)
      .run();

    return formatResponse({ id: result.meta.last_row_id, ...data });
  }

  async update(id, data) {
    const existing = await this.env.DB
      .prepare('SELECT * FROM examples WHERE id = ?')
      .bind(id)
      .first();

    if (!existing) {
      const error = new Error('Item not found');
      error.name = 'NotFoundError';
      throw error;
    }

    await this.env.DB
      .prepare('UPDATE examples SET name = ?, description = ? WHERE id = ?')
      .bind(data.name, data.description, id)
      .run();

    return formatResponse({ id, ...data });
  }

  async delete(id) {
    await this.env.DB
      .prepare('DELETE FROM examples WHERE id = ?')
      .bind(id)
      .run();
  }
}
```

## KV 캐시 적용 패턴

```javascript
async getById(id) {
  // 1. KV 캐시 확인
  const cached = await this.env.KV.get(`example:${id}`, { type: 'json' });
  if (cached) return cached;

  // 2. D1 조회
  const item = await this.env.DB
    .prepare('SELECT * FROM examples WHERE id = ?')
    .bind(id)
    .first();

  if (!item) {
    const error = new Error('Item not found');
    error.name = 'NotFoundError';
    throw error;
  }

  // 3. KV에 캐시 저장 (1시간 TTL)
  const response = formatResponse(item);
  await this.env.KV.put(`example:${id}`, JSON.stringify(response), {
    expirationTtl: 3600
  });

  return response;
}
```

