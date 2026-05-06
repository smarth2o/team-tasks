# API 엔드포인트

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 시작 | 불필요 |
| GET | /api/auth/callback | OAuth 콜백 처리 후 세션 발급 | 불필요 |
| DELETE | /api/auth/logout | 세션 종료 | 필요 |
| GET | /api/tasks | 전체 일감 목록 조회 | 필요 |
| POST | /api/tasks | 새 일감 생성 | 필요 |
| PATCH | /api/tasks/[id] | 일감 상태(status) 변경 | 필요 |
| DELETE | /api/tasks/[id] | 일감 삭제 | 필요 |
