# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Object Storage**: Replit Object Storage (GCS-backed) via `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Patent App (artifacts/patent-app)

Hebrew-language social tip-sharing mobile app built with Expo SDK 54.

### Features
- Dark mode only, Hebrew RTL default, multi-language i18n (30+ languages)
- Personalized feed with 3 tabs (For You, Following, Popular)
- Follow system (local + API-backed)
- Media upload with cloud storage (via API server + GCS)
- Auto-translate tips/questions using Google Translate API
- Onboarding flow with language selection
- Real Google authentication via Clerk
- Feed pagination (PAGE_SIZE=15)
- Staggered card entrance animations
- Share button using native Share API
- Public user profiles
- User search
- Privacy Policy / Terms of Service screen
- Offline mode indicator (detects connectivity, shows banner)
- Push notifications via expo-notifications (native only)
- Comments (local + API-backed)
- EAS build config for APK + AAB

### Architecture
- **State management**: React Context (FeedContext, AuthContext, SocialContext, SettingsContext, ToastContext)
- **Local persistence**: AsyncStorage
- **API**: Connects to API server at `/api-server/api`
- **Auth**: Clerk (Google OAuth via SSO)
- **Design tokens**: bg `#0a0a0f`, surface `#13131a`, primary/yellow `#f0e040`, cyan `#40e0f0`
- **Icons**: @expo/vector-icons (Feather only, no emojis)

### Key Files
- `app/_layout.tsx` — root layout with providers, push notifications, offline banner
- `app/(tabs)/index.tsx` — main feed with pagination
- `app/(tabs)/search.tsx` — search with content/users tabs
- `app/profile/[userId].tsx` — public profile (API + mock data)
- `context/FeedContext.tsx` — feed state, pagination, local CRUD
- `context/AuthContext.tsx` — Clerk auth + DB user sync
- `utils/api.ts` — API client (posts, users, comments)
- `utils/upload.ts` — image upload to GCS via API server
- `hooks/useNetworkStatus.ts` — online/offline detection
- `hooks/usePushNotifications.ts` — push token registration

## API Server (artifacts/api-server)

Express server with PostgreSQL + Drizzle ORM backend for Patent app.

### Database Tables
- `users` — user profiles
- `posts` — tips and questions
- `post_likes`, `post_saves`, `post_votes` — engagement
- `comments` — comments on posts
- `follows` — follow relationships

### API Endpoints
- `GET/POST /api/posts` — list/create posts
- `POST /api/posts/:id/like|save|vote|share` — engagement
- `GET/POST /api/users` — list/upsert users
- `POST /api/users/:id/follow` — follow/unfollow
- `GET/POST /api/comments` — comments CRUD
- `POST /api/upload/presigned` — GCS presigned upload URL
- `POST /api/upload/complete` — make uploaded file public
