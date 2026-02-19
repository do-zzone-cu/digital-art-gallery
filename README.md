# ARTIUM — Digital Art Gallery

A multi-user digital art gallery web application with museum-like immersion, built for an Awwwards-worthy experience. Users can create accounts, upload artworks via drag-and-drop, and browse a community-driven gallery with smooth animations and a dark "Museum Mode" theme.

> **Live Preview**: Run `docker-compose up --build` and open [http://localhost:3000](http://localhost:3000)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Docker (Recommended)](#docker-recommended)
  - [Local Development](#local-development)
- [Database Schema](#database-schema)
- [Routes & Pages](#routes--pages)
- [Environment Variables](#environment-variables)
- [Architecture Decisions](#architecture-decisions)
- [Demo Data](#demo-data)
- [Development Status](#development-status)

---

## Features

### Frontend & UX
- **Hero Section** with parallax scrolling, per-letter stagger animation ("ARTIUM"), and scroll-based opacity/transform
- **Masonry Grid** (Pinterest-style) gallery using CSS `column-count` with responsive breakpoints (1-4 columns)
- **Lightbox Modal** with blur backdrop, animated entrance, artwork metadata display (title, artist, date, dimensions)
- **Framer Motion** throughout: page transitions, hover micro-interactions, `AnimatePresence` for mount/unmount, layout animations
- **Dark "Museum Mode"** theme (`#0a0a0a` background, `#c8a97e` gold accents)
- **Glassmorphism Header** with backdrop blur and scroll-aware background transition
- **Noise Texture Overlay** via SVG filter for visual depth
- **Custom Scrollbar** and gold accent text selection
- **Google Fonts**: Inter (body) + Playfair Display (headings)

### Backend & Auth
- **NextAuth v5** (beta) with Credentials provider, JWT session strategy, Prisma Adapter
- **Email/Password Authentication**: bcrypt-hashed passwords (12 salt rounds)
- **Protected Routes**: `/upload` and `/my-gallery` guarded by NextAuth middleware
- **Server Actions**: No API routes needed for auth and upload logic — uses Next.js Server Actions
- **Image Upload**: Multi-file drag-and-drop via React Dropzone, saved to `/public/uploads` with UUID filenames
- **Image Metadata**: `sharp` extracts width/height for proper masonry layout sizing
- **File Validation**: Type-checked (JPEG, PNG, WebP, GIF) and size-limited (10MB per file, max 10 files)
- **Artwork CRUD**: Create (upload) and Delete with ownership verification

### Infrastructure
- **Multi-stage Dockerfile**: deps -> build -> production runner (node:18-alpine, ~150MB final image)
- **Docker Compose**: Next.js app + PostgreSQL 16 with health checks, persistent volumes for DB data and uploads
- **Prisma ORM**: Type-safe database queries, auto-migration on container startup
- **ISR** (Incremental Static Regeneration): Gallery pages revalidate every 10-30 seconds

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.35 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| Animation | Framer Motion | ^12.34.0 |
| Icons | Lucide React | ^0.564.0 |
| Database | PostgreSQL | 16 (Alpine) |
| ORM | Prisma | ^5.22.0 |
| Authentication | NextAuth.js v5 | ^5.0.0-beta.25 |
| Auth Adapter | @auth/prisma-adapter | ^1.6.0 |
| Upload UI | react-dropzone | ^15.0.0 |
| Image Processing | sharp | ^0.34.5 |
| Password Hashing | bcryptjs | ^3.0.3 |
| UUID | uuid | ^13.0.0 |
| Containerization | Docker + Docker Compose | — |

---

## Project Structure

```
webapp/
├── Dockerfile                    # Multi-stage build (deps → build → runner)
├── docker-compose.yml            # App + PostgreSQL orchestration
├── docker-entrypoint.sh          # DB migration + server startup script
├── .env.example                  # Environment variable template
├── package.json
├── tailwind.config.ts            # Museum theme colors, animations, fonts
├── tsconfig.json
├── next.config.mjs               # Remote image domains (Unsplash, Picsum)
├── postcss.config.mjs
│
├── prisma/
│   ├── schema.prisma             # User, Artwork, Account, Session, VerificationToken
│   └── seed.js                   # Demo data: 3 users + 12 artworks
│
├── public/
│   └── uploads/                  # User-uploaded images (Docker volume mount)
│       └── .gitkeep
│
└── src/
    ├── app/
    │   ├── layout.tsx            # Root layout: fonts, metadata, dark theme
    │   ├── page.tsx              # Landing: Hero + latest 6 artworks + stats
    │   ├── globals.css           # CSS variables, masonry utilities, custom scrollbar
    │   │
    │   ├── (auth)/               # Auth route group (centered layout)
    │   │   ├── layout.tsx        # Minimal centered layout for auth pages
    │   │   ├── login/page.tsx    # Login form with Framer Motion
    │   │   └── register/page.tsx # Registration form with password confirmation
    │   │
    │   ├── (main)/               # Main route group (Header + Footer layout)
    │   │   ├── layout.tsx        # Shared Header/Footer wrapper
    │   │   ├── gallery/page.tsx  # Public gallery: all artworks (ISR 10s)
    │   │   ├── my-gallery/page.tsx # Personal gallery with delete (auth required)
    │   │   └── upload/page.tsx   # Upload page with UploadZone (auth required)
    │   │
    │   └── api/auth/
    │       └── [...nextauth]/route.ts  # NextAuth API route handler
    │
    ├── actions/
    │   ├── auth.ts               # Server Actions: registerUser, loginUser
    │   └── upload.ts             # Server Actions: uploadArtworks, deleteArtwork
    │
    ├── components/
    │   ├── Header.tsx            # Glassmorphism nav, mobile menu, scroll-aware
    │   ├── HeroSection.tsx       # Parallax hero with per-letter animation
    │   ├── SectionTitle.tsx      # Reusable animated section header
    │   ├── MasonryGrid.tsx       # DB-backed masonry layout + lightbox modal
    │   ├── UploadZone.tsx        # React Dropzone: drag-drop, preview, bulk upload
    │   ├── SessionProvider.tsx   # NextAuth session provider wrapper
    │   └── Footer.tsx            # Footer with links and social media
    │
    ├── lib/
    │   ├── auth.ts               # NextAuth v5 config: Credentials + Prisma Adapter
    │   └── prisma.ts             # Prisma client singleton (hot-reload safe)
    │
    ├── middleware.ts              # Auth guard for /upload, /my-gallery
    │
    └── types/
        ├── index.ts              # Artwork type definition
        └── next-auth.d.ts        # NextAuth session type augmentation
```

---

## Getting Started

### Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/do-zzone-cu/digital-art-gallery.git
cd digital-art-gallery

# 2. Create environment file
cp .env.example .env

# 3. Build and start all services
docker-compose up --build

# 4. Open in browser
open http://localhost:3000
```

Docker Compose will:
- Start PostgreSQL 16 with health checks
- Build the Next.js app (multi-stage, ~150MB)
- Run Prisma migrations automatically via `docker-entrypoint.sh`
- Mount persistent volumes for database data and uploaded images

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env: change DATABASE_URL to point to your local PostgreSQL

# 3. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 4. (Optional) Seed demo data
node prisma/seed.js

# 5. Start development server
npm run dev
```

---

## Database Schema

```
User
├── id            String  (cuid, PK)
├── email         String  (unique)
├── password      String  (bcrypt hash)
├── name          String?
├── image         String?
├── createdAt     DateTime
├── updatedAt     DateTime
└── artworks      Artwork[]

Artwork
├── id            String  (cuid, PK)
├── title         String
├── description   String?
├── imageUrl      String  (/uploads/uuid.ext)
├── width         Int     (from sharp metadata)
├── height        Int     (from sharp metadata)
├── createdAt     DateTime
├── updatedAt     DateTime
└── userId        String  (FK → User.id, CASCADE delete)

+ Account, Session, VerificationToken (NextAuth adapter models)
```

---

## Routes & Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Landing page: Hero section + latest 6 artworks + community stats |
| `/gallery` | Public | Full public gallery: all users' artworks in masonry grid (ISR 10s) |
| `/login` | Public | Email/password login with Framer Motion animations |
| `/register` | Public | Account creation with password confirmation |
| `/upload` | Protected | Drag-and-drop multi-image upload with preview and metadata input |
| `/my-gallery` | Protected | Personal gallery with artwork management (delete) |
| `/api/auth/*` | — | NextAuth API routes (handled automatically) |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://artium:artium_secret_2024@localhost:5432/artium_gallery` |
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT signing secret (use `openssl rand -base64 32`) | dev placeholder |
| `AUTH_TRUST_HOST` | Trust proxy headers in Docker | `true` |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Server Components for DB queries, Server Actions for mutations, route groups for layout separation |
| **NextAuth v5 + JWT** | Credentials provider requires JWT strategy (not DB sessions); Prisma Adapter for user model compatibility |
| **Server Actions** (no API routes) | Simplified data flow — `registerUser`, `loginUser`, `uploadArtworks`, `deleteArtwork` are all Server Actions |
| **CSS Columns for Masonry** | Native CSS masonry via `column-count` — no JavaScript layout calculation, responsive with Tailwind breakpoints |
| **sharp for metadata** | Extracts image width/height at upload time so the masonry grid renders correctly without CLS |
| **Multi-stage Dockerfile** | Separates deps, build, and runtime stages for minimal production image size |
| **Docker volumes** | `postgres_data` for DB persistence, `upload_data` for user-uploaded images across container restarts |
| **ISR (revalidate)** | Gallery pages use incremental static regeneration (10-30s) for near-real-time updates without SSR overhead |

---

## Demo Data

The seed script (`prisma/seed.js`) creates:

| User | Email | Password |
|------|-------|----------|
| Elena Vasquez | elena@artium.gallery | demo1234 |
| Marcus Chen | marcus@artium.gallery | demo1234 |
| Demo User | demo@artium.gallery | demo1234 |

Plus 12 artworks with Unsplash images distributed across the three users.

```bash
# Run seed
node prisma/seed.js
```

---

## Development Status

### Completed

- [x] Project scaffolding (Next.js 14, TypeScript, Tailwind CSS, App Router)
- [x] Museum-mode dark theme with custom color palette and typography
- [x] Hero Section with parallax scroll and per-letter stagger animation
- [x] Glassmorphism Header with mobile responsive menu
- [x] Masonry grid gallery (CSS columns, responsive 1-4 columns)
- [x] Lightbox modal with blur backdrop and metadata display
- [x] Framer Motion micro-interactions throughout
- [x] Noise texture overlay, custom scrollbar, gold accent selection
- [x] Prisma schema (User, Artwork + NextAuth adapter models)
- [x] NextAuth v5 integration (Credentials provider, JWT, Prisma Adapter)
- [x] Auth Server Actions (register with bcrypt, login)
- [x] Login and Register pages with Framer Motion animations
- [x] NextAuth middleware protecting `/upload` and `/my-gallery`
- [x] Image upload Server Action with sharp metadata extraction
- [x] UploadZone component (React Dropzone, preview, bulk upload)
- [x] Public gallery page (all artworks, ISR)
- [x] Personal gallery page (own artworks, delete functionality)
- [x] Multi-stage Dockerfile (deps -> build -> runner)
- [x] Docker Compose (App + PostgreSQL 16 with health checks)
- [x] Docker entrypoint with auto-migration
- [x] Persistent Docker volumes (DB data + uploads)
- [x] Seed script with 3 demo users and 12 artworks
- [x] Production build verification (all 10 routes compile)

### Build Output

```
Route (app)                          Size     First Load JS
/                                    5.49 kB  157 kB
/_not-found                          873 B    88.2 kB
/api/auth/[...nextauth]              0 B      0 kB
/gallery                             473 B    139 kB
/login                               1.98 kB  139 kB
/my-gallery                          485 B    147 kB
/register                            2.18 kB  139 kB
/upload                              19.5 kB  155 kB
+ Middleware                         101 kB
```

---

## License

MIT
