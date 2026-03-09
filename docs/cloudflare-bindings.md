# Cloudflare 바인딩 사용

Cloudflare 바인딩은 **직접 사용**합니다. 별도의 헬퍼 함수 없이 공식 API를 그대로 사용하세요.

## 접근 방법

```javascript
// 라우트에서
c.env.DB      // D1 Database
c.env.KV      // KV Namespace
c.env.BUCKET  // R2 Bucket

// 서비스에서 (constructor 주입)
this.env.DB
this.env.KV
this.env.BUCKET
```

## KV (Key-Value Storage)

```javascript
// 값 저장 (1시간 TTL)
await c.env.KV.put('key', 'value', { expirationTtl: 3600 });

// 값 조회
const value = await c.env.KV.get('key');

// JSON 저장/조회
await c.env.KV.put('data', JSON.stringify({ foo: 'bar' }));
const data = await c.env.KV.get('data', { type: 'json' });

// 삭제
await c.env.KV.delete('key');
```

**참고**: [KV 공식 문서](https://developers.cloudflare.com/kv/api/)

## D1 (SQLite Database)

```javascript
// 단일 행 조회
const user = await c.env.DB
  .prepare('SELECT * FROM users WHERE id = ?')
  .bind(userId)
  .first();

// 여러 행 조회
const { results } = await c.env.DB
  .prepare('SELECT * FROM users')
  .all();

// INSERT/UPDATE/DELETE
const result = await c.env.DB
  .prepare('INSERT INTO users (name, email) VALUES (?, ?)')
  .bind(name, email)
  .run();
```

**참고**: [D1 공식 문서](https://developers.cloudflare.com/d1/api/)

## R2 (Object Storage)

```javascript
// 파일 업로드
await c.env.BUCKET.put('file.txt', 'Hello World');

// 파일 다운로드
const object = await c.env.BUCKET.get('file.txt');
const text = await object.text();

// 파일 삭제
await c.env.BUCKET.delete('file.txt');

// 메타데이터만 조회
const metadata = await c.env.BUCKET.head('file.txt');
```

**참고**: [R2 공식 문서](https://developers.cloudflare.com/r2/api/)

## wrangler.toml 바인딩 설정

```toml
# KV Namespace
[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "your-db-name"
database_id = "your-db-id"

# R2 Bucket
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "your-bucket-name"
```
