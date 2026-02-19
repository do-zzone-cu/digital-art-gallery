/* 데모 시드 스크립트 - 미리보기용 데이터 삽입 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // 데모 사용자 생성
  const password = await bcrypt.hash("demo1234", 12);

  const user1 = await prisma.user.create({
    data: {
      email: "elena@artium.gallery",
      password,
      name: "Elena Vasquez",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "marcus@artium.gallery",
      password,
      name: "Marcus Chen",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "demo@artium.gallery",
      password,
      name: "Demo User",
    },
  });

  // 데모 작품 삽입 (Unsplash 이미지 URL 사용)
  const artworks = [
    { title: "Ethereal Horizons", desc: "A meditative exploration of light and shadow across an infinite landscape.", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", w: 800, h: 533, user: user1.id },
    { title: "Neon Genesis", desc: "Futuristic urban architecture bathed in neon light.", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80", w: 600, h: 800, user: user2.id },
    { title: "Whispers of Color", desc: "An abstract composition where colors dance and interweave.", url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80", w: 800, h: 800, user: user1.id },
    { title: "Solitude in Blue", desc: "The vast ocean stretches endlessly, a mirror reflecting the sky.", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80", w: 800, h: 533, user: user2.id },
    { title: "Flora Mechanica", desc: "Where organic life meets mechanical precision.", url: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80", w: 600, h: 900, user: user1.id },
    { title: "Digital Reverie", desc: "Layers of digital paint converge into a dreamscape.", url: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&q=80", w: 800, h: 533, user: user3.id },
    { title: "Geometric Bloom", desc: "Sacred geometry meets natural forms.", url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", w: 600, h: 600, user: user2.id },
    { title: "Cosmic Drift", desc: "A journey through the cosmic void.", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", w: 800, h: 533, user: user1.id },
    { title: "The Last Garden", desc: "A lush botanical illustration capturing endangered plant species.", url: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80", w: 600, h: 900, user: user3.id },
    { title: "Silent Architecture", desc: "Minimalist architectural forms revealing pure poetry of space.", url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", w: 800, h: 533, user: user2.id },
    { title: "Chrome Dreams", desc: "Reflective chrome surfaces twist into impossible organic shapes.", url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80", w: 600, h: 800, user: user1.id },
    { title: "Velvet Dusk", desc: "The moment between day and night captured in velvety tones.", url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", w: 800, h: 533, user: user3.id },
  ];

  for (const a of artworks) {
    await prisma.artwork.create({
      data: {
        title: a.title,
        description: a.desc,
        imageUrl: a.url,
        width: a.w,
        height: a.h,
        userId: a.user,
      },
    });
  }

  console.log("Seeded 3 users + 12 artworks");
  console.log("Demo login: demo@artium.gallery / demo1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
