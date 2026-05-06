@AGENTS.md

## 기술 스택과 아키텍처

**현재 단계** — localStorage 기반 클라이언트 앱 (Supabase 미연동)

| 레이어 | 선택 |
|-------|------|
| 프레임워크 | Next.js 15 App Router + Turbopack |
| 스타일 | Tailwind CSS + shadcn/ui (base-ui 변형) |
| 배포 | Vercel |
| DB (예정) | Supabase Postgres |
| 인증 (예정) | Supabase Auth + Google OAuth (세션 쿠키) |
| 현재 영속성 | localStorage (`team-tasks-app` 키) |

**코드 작성 시 지켜야 할 규칙**
- `localStorage`에 인증 토큰·비밀번호 저장 금지 — 세션 쿠키만 허용
- 사용자 입력은 React JSX로만 렌더링 — `innerHTML` 직접 삽입 금지
- DB `status` 컬럼은 `check (status in ('todo', 'done'))` — ENUM 아님
- `PATCH /api/tasks/[id]`는 status 변경 전용 (전체 수정 엔드포인트 없음)
- MVP 범위: ≤5 기능, 단일 테이블 UI, 담당자 필터 버튼

**미결정 사항** — 상세는 `docs/user-stories.md` D-01~D-05 참조  
담당자 재배정 가능 여부, 역할별 상태 변경 권한, 완료 일감 숨기기 등 5개 항목 구현 전 결정 필요

상세 명세: `docs/architecture.md` · `docs/api.md` · `docs/db.md`

---

## 도메인 용어

| 용어 | 설명 |
|------|------|
| 일감 (Task) | 팀의 작업 단위. `title` / `assignee` / `status` / `dueDate` 보유 |
| 담당자 (Assignee) | 일감을 할당받은 팀원 |
| 상태 (Status) | `todo`(할 일) → `done`(완료). DB check 제약으로 관리 |
| 생성자 (created_by) | 일감을 등록한 사용자 (담당자와 다를 수 있음) |
