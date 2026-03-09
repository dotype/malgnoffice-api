# Route 템플릿

## 기본 구조

```javascript
import { Hono } from 'hono';
import { ExampleService } from '../services/exampleService.js';

const router = new Hono();

// 목록 조회
router.get('/', async (c) => {
  const service = new ExampleService(c.env);
  const items = await service.getAll();
  return c.json({ data: items });
});

// 단일 조회
router.get('/:id', async (c) => {
  const id = c.req.param('id');
  const service = new ExampleService(c.env);
  const item = await service.getById(id);
  return c.json({ data: item });
});

// 생성
router.post('/', async (c) => {
  const body = await c.req.json();

  // 입력 검증 (라우트의 책임)
  if (!body.name) {
    const error = new Error('Name is required');
    error.name = 'ValidationError';
    throw error;
  }

  const service = new ExampleService(c.env);
  const item = await service.create(body);
  return c.json({ data: item }, 201);
});

// 수정
router.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const service = new ExampleService(c.env);
  const item = await service.update(id, body);
  return c.json({ data: item });
});

// 삭제
router.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const service = new ExampleService(c.env);
  await service.delete(id);
  return c.json({ message: 'Deleted successfully' });
});

export default router;
```

## 인증된 사용자 정보 접근

```javascript
router.get('/me', async (c) => {
  const userId = c.get('userId');
  const userEmail = c.get('userEmail');
  const userRole = c.get('userRole');

  const service = new ExampleService(c.env);
  const data = await service.getByUserId(userId);
  return c.json({ data });
});
```

