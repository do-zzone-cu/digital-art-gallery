/* ===================================================
   Public Gallery 페이지 - 모든 사용자의 작품 표시
   서버 컴포넌트에서 DB 조회 후 MasonryGrid에 전달
   =================================================== */

import prisma from "@/lib/prisma";
import SectionTitle from "@/components/SectionTitle";
import MasonryGrid from "@/components/MasonryGrid";
import { Artwork } from "@/types";

/* ISR: 10초마다 재검증 */
export const revalidate = 10;

export default async function GalleryPage() {
  /* DB에서 전체 작품 조회 (최신순) */
  const dbArtworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  /* Prisma 타입 → 프론트엔드 Artwork 타입 변환 */
  const artworks: Artwork[] = dbArtworks.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    imageUrl: a.imageUrl,
    width: a.width,
    height: a.height,
    createdAt: a.createdAt.toISOString(),
    userId: a.userId,
    user: a.user,
  }));

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionTitle
          subtitle="◆ Community Collection ◆"
          title="Public Gallery"
          description="Explore artworks from our community of digital artists. Every piece tells a unique story."
        />
        <MasonryGrid artworks={artworks} />
      </div>
    </section>
  );
}
