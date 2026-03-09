# 새로운 기능 추가 가이드

## 새 엔드포인트 추가 순서

### 1. 서비스 생성

```javascript
// src/services/productService.js
import { formatResponse } from '../utils/utils.js';

export class ProductService {
  constructor(env) {
    this.env = env;
  }

  async getProducts() {
    const { results } = await this.env.DB
      .prepare('SELECT * FROM products')
      .all();
    return formatResponse(results);
  }

  async getProductById(id) {
    const product = await this.env.DB
      .prepare('SELECT * FROM products WHERE id = ?')
      .bind(id)
      .first();

    if (!product) {
      const error = new Error('Product not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return formatResponse(product);
  }
}
```

### 2. 라우트 생성

```javascript
// src/routes/products.js
import { Hono } from 'hono';
import { ProductService } from '../services/productService.js';

const products = new Hono();

products.get('/', async (c) => {
  const service = new ProductService(c.env);
  const data = await service.getProducts();
  return c.json({ data });
});

products.get('/:id', async (c) => {
  const service = new ProductService(c.env);
  const data = await service.getProductById(c.req.param('id'));
  return c.json({ data });
});

export default products;
```

### 3. index.js에 라우트 등록

```javascript
// src/index.js
import productsRoutes from './routes/products.js';
app.route('/products', productsRoutes);
```

### 4. OpenAPI 스펙 업데이트

`src/openapi.js`의 `paths`에 새 엔드포인트를 추가합니다.

### 5. (선택) 공개 경로 등록

인증이 불필요한 경우 `PUBLIC_PATHS`에 추가합니다:

```javascript
const PUBLIC_PATHS = ['/health', '/docs', '/auth', '/products'];
```

## 새 유틸리티 함수 추가

`src/utils/utils.js`에 named export로 추가합니다:

```javascript
export const slugify = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-');
};
```

## DB 스키마 변경

`schema.sql`에 테이블 정의를 추가합니다:

```sql
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 체크리스트

- [ ] 서비스 클래스 생성 (`constructor(env)`)
- [ ] 라우트 핸들러 생성 (`export default router`)
- [ ] `src/index.js`에 라우트 등록
- [ ] `src/openapi.js`에 스펙 추가
- [ ] 인증 불필요 시 `PUBLIC_PATHS` 추가
- [ ] DB 사용 시 `schema.sql` 업데이트
