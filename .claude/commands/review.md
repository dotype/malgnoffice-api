# 코드 리뷰

현재 변경 사항을 프로젝트 컨벤션 기준으로 리뷰합니다.

## 리뷰 절차

1. `git diff`로 변경 사항을 확인합니다.
2. 다음 체크리스트를 기준으로 검사합니다:

### 체크리스트

- [ ] **파일명**: camelCase 준수 여부
- [ ] **서비스 패턴**: 클래스 기반, `constructor(env)` 패턴 사용 여부
- [ ] **라우트 패턴**: 비즈니스 로직 없이 서비스에 위임하는지
- [ ] **에러 처리**: 서비스에서 `error.name` 지정 후 throw 하는지
- [ ] **Cloudflare 바인딩**: `c.env` / `this.env` 통해 접근하는지 (`process.env` 사용 금지)
- [ ] **Node.js 전용 API**: Workers 비호환 API 사용 여부
- [ ] **인증**: 새 공개 경로가 `PUBLIC_PATHS`에 등록되었는지
- [ ] **OpenAPI**: 새 엔드포인트가 `src/openapi.js`에 반영되었는지
- [ ] **Export 패턴**: 서비스는 named export, 라우트는 default export

3. 위반 사항이 있으면 구체적인 수정 방법을 제안합니다.

$ARGUMENTS
