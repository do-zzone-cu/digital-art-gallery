#!/bin/sh
# ===================================================
# Docker Entrypoint 스크립트
# 1. Prisma DB 마이그레이션 실행
# 2. Next.js 서버 시작
# ===================================================

echo "🎨 ARTIUM - Starting up..."

# Prisma 마이그레이션 (DB 스키마 동기화)
echo "📦 Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss

echo "✅ Database ready!"
echo "🚀 Starting Next.js server..."

# Next.js standalone 서버 실행
exec node server.js
