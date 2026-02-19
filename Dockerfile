# ===================================================
# Dockerfile - Next.js 최적화 Multi-stage 빌드
# 1단계: 의존성 설치
# 2단계: 빌드
# 3단계: 프로덕션 실행 (최소 이미지)
# ===================================================

# ─── 1단계: 의존성 설치 ───
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─── 2단계: 빌드 ───
FROM node:18-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# Next.js 빌드 (standalone 모드)
RUN npm run build

# ─── 3단계: 프로덕션 실행 (최소 이미지) ───
FROM node:18-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안: non-root 사용자
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 퍼블릭 에셋 복사
COPY --from=builder /app/public ./public

# 업로드 디렉토리 생성 및 권한 설정
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Standalone 빌드 결과물 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma 관련 파일 복사 (마이그레이션 + 클라이언트)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 엔트리 스크립트 복사
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 엔트리포인트: DB 마이그레이션 → 서버 시작
ENTRYPOINT ["./docker-entrypoint.sh"]
