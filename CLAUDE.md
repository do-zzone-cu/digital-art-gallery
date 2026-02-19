# CLAUDE.md — Project Context for AI Assistants

This file provides context for AI coding assistants working on the ARTIUM Digital Art Gallery project.

---

## Project Overview

**ARTIUM** is a multi-user digital art gallery built with Next.js 14 (App Router). It combines an Awwwards-quality frontend experience with full-stack functionality: user authentication, image upload, and community gallery.

**Repository**: https://github.com/do-zzone-cu/digital-art-gallery
**Branch**: `genspark_ai_developer` (development) -> `main` (production)
**PR**: https://github.com/do-zzone-cu/digital-art-gallery/pull/1

---

## Quick Reference

### Commands

```bash
# Development
npm run dev            # Start dev server on port 3000
npm run build          # Production build
npm run start          # Start production server
npm run lint           # ESLint check

# Database
npx prisma generate    # Generate Prisma client
npx prisma db push     # Sync schema to DB (no migration files)
npx prisma studio      # Visual DB browser
node prisma/seed.js    # Seed demo data (3 users + 12 artworks)

# Docker
docker-compose up --build   # Full stack (app + PostgreSQL)
docker-compose down -v      # Tear down with volumes
```

### Demo Credentials
- **Email**: `demo@artium.gallery`
- **Password**: `demo1234`

---

## Architecture

### Route Groups

The app uses Next.js route groups for layout separation:

- `(auth)` group: `/login`, `/register` — centered minimal layout, no header/footer
- `(main)` group: `/gallery`, `/my-gallery`, `/upload` — shared Header + Footer layout
- Root: `/` — standalone layout with its own Header/Footer

### Data Flow

```
[Client Component] --(Server Action)--> [Server] --(Prisma)--> [PostgreSQL]
                                            |
                                      [File System: /public/uploads]
```

- **No API routes** for data mutation — all CRUD uses Server Actions (`src/actions/`)
- **NextAuth API route** (`/api/auth/[...nextauth]`) handles auth protocol only
- **Server Components** fetch data directly with Prisma in page-level components

### Auth Flow

1. User submits login form -> `loginUser` Server Action -> NextAuth `signIn("credentials")`
2. NextAuth validates credentials (bcrypt compare) -> issues JWT
3. Middleware (`src/middleware.ts`) checks JWT for protected routes (`/upload`, `/my-gallery`)
4. Session available in Server Components via `auth()` from `@/lib/auth`

### Upload Flow

1. User drops files in `UploadZone` (React Dropzone) -> client-side preview via `URL.createObjectURL`
2. Form submission sends `FormData` to `uploadArtworks` Server Action
3. Server Action: validates file type/size -> generates UUID filename -> extracts metadata with `sharp` -> saves to `/public/uploads` -> creates `Artwork` DB record
4. On success, redirect to `/my-gallery`

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth v5 configuration — Credentials provider, JWT callbacks, Prisma Adapter |
| `src/lib/prisma.ts` | Prisma client singleton (prevents hot-reload connection exhaustion) |
| `src/middleware.ts` | Auth guard for `/upload` and `/my-gallery` routes |
| `src/actions/auth.ts` | `registerUser` (bcrypt hash + create user) and `loginUser` (NextAuth signIn) |
| `src/actions/upload.ts` | `uploadArtworks` (file save + DB record) and `deleteArtwork` (ownership check + delete) |
| `src/components/MasonryGrid.tsx` | Masonry layout + embedded lightbox modal — the core gallery view |
| `src/components/UploadZone.tsx` | Drag-and-drop upload UI with preview, title/description inputs |
| `src/components/HeroSection.tsx` | Parallax hero — the most animation-heavy component |
| `prisma/schema.prisma` | Database models: User, Artwork, Account, Session, VerificationToken |
| `docker-entrypoint.sh` | Container startup: run Prisma migration then start Next.js |

---

## Type Definitions

### Artwork (src/types/index.ts)

```typescript
export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;      // ISO string (serialized from Date)
  userId: string;
  user?: {                // Included via Prisma relation
    id: string;
    name: string | null;
    email: string;
  };
}
```

### NextAuth Session Augmentation (src/types/next-auth.d.ts)

The session type is extended to include `user.id` (string) — set via JWT callback in `src/lib/auth.ts`.

---

## Styling System

### Theme Colors (tailwind.config.ts)

```
museum-bg:        #0a0a0a   (deepest black)
museum-surface:   #141414   (card backgrounds)
museum-card:      #1a1a1a   (elevated surfaces)
museum-border:    #2a2a2a   (subtle borders)
museum-muted:     #888888   (secondary text)
museum-text:      #e5e5e5   (primary text)
museum-white:     #fafafa   (headings)
museum-accent:    #c8a97e   (gold accent)
museum-highlight: #d4b896   (gold hover state)
```

### Fonts
- **Display** (`font-display`): Playfair Display — headings, logo
- **Body** (`font-body`): Inter — body text, UI elements

### CSS Utilities (globals.css)
- `.masonry-grid` / `.masonry-item` — responsive column-count masonry (1/2/3/4 columns)
- `.text-gradient` — generic gradient text
- `.text-gradient-gold` — gold gradient text
- `.noise-overlay` — SVG noise texture overlay

---

## Database Notes

### Provider Flexibility
- **Production** (Docker): PostgreSQL 16 via `docker-compose.yml`
- **Local dev**: Can use SQLite by changing `provider = "sqlite"` and `url = "file:./dev.db"` in `prisma/schema.prisma`
  - Note: Remove `@db.Text` annotations from Account model when using SQLite

### Important: Schema changes
After modifying `prisma/schema.prisma`:
```bash
npx prisma generate   # Regenerate client types
npx prisma db push    # Sync to database (dev)
```

---

## Common Patterns

### Adding a New Page

1. Create `src/app/(main)/new-page/page.tsx` (inherits Header/Footer)
2. If protected, add path to `matcher` in `src/middleware.ts`
3. Use `auth()` from `@/lib/auth` to get session in Server Components
4. Query Prisma directly in the page component (Server Component)

### Adding a New Server Action

1. Create function in `src/actions/` with `"use server"` directive
2. Import `auth` from `@/lib/auth` for auth checks
3. Import `prisma` from `@/lib/prisma` for DB operations
4. Return typed result object (`{ success: boolean; error?: string }`)

### Adding a New Component

1. Create in `src/components/`
2. Add `"use client"` if it uses hooks, event handlers, or Framer Motion
3. Use `museum-*` Tailwind colors for theme consistency
4. Use Framer Motion for animations (follow existing patterns)

---

## Known Considerations

1. **NextAuth v5 is in beta** (`^5.0.0-beta.25`) — API may change in stable release
2. **Build-time Prisma error** is expected when building without a running database (static pages still generate correctly)
3. **Image domains**: External images (Unsplash, Picsum) are configured in `next.config.mjs` `images.remotePatterns`
4. **Upload directory**: In Docker, `/public/uploads` is mounted as a named volume (`upload_data`) for persistence
5. **No image optimization for uploads**: User-uploaded images served directly from `/public/uploads` — consider adding Next.js Image optimization or CDN in production
6. **ESLint**: `@typescript-eslint/no-explicit-any` is disabled in `.eslintrc.json` for NextAuth compatibility

---

## Git Workflow

- **Development branch**: `genspark_ai_developer`
- **Production branch**: `main`
- **PR flow**: All changes go through PR from `genspark_ai_developer` -> `main`
- **Commit convention**: `type(scope): description` (e.g., `feat: add upload page`, `fix: resolve auth redirect`)
- **Before pushing**: Always squash commits into one clean commit per feature
