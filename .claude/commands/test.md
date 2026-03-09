# 테스트 작성

요청된 기능에 대한 테스트를 프로젝트 컨벤션에 맞게 작성합니다.

## 작업 순서

1. `.claude/templates/test.md` 템플릿을 참고하여 테스트를 작성합니다.
2. 테스트 파일 위치는 소스 구조를 미러링합니다:
   - 라우트 테스트: `test/routes/{name}.test.js`
   - 서비스 테스트: `test/services/{name}Service.test.js`
   - 유틸 테스트: `test/utils/{name}.test.js`
3. 라우트는 `SELF.fetch()`로 통합 테스트, 서비스는 `new Service(env)`로 단위 테스트합니다.
4. `npm run test`로 테스트를 실행하여 통과를 확인합니다.

## 테스트 대상

$ARGUMENTS
