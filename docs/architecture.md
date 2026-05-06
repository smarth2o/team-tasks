# Team-Tasks 아키텍처

```
  [Browser]
      │  Google OAuth
      ▼
┌─────────────────────┐        ┌──────────────────────┐
│  Next.js on Vercel  │◄──────►│  Supabase            │
│  (UI + API Routes)  │  HTTPS │  (Postgres + Auth)   │
└─────────────────────┘        └──────────────────────┘
```
