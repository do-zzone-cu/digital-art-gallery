/* ===================================================
   메인 페이지 - 랜딩 + 최신 작품 미리보기
   Hero Section + 최근 업로드된 작품 6개 표시
   =================================================== */

import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import MasonryGrid from "@/components/MasonryGrid";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Artwork } from "@/types";

export const revalidate = 30;

export default async function Home() {
  /* 최신 작품 6개 미리보기용 조회 */
  const dbArtworks = await prisma.artwork.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

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

  /* 전체 통계 */
  const [artworkCount, userCount] = await Promise.all([
    prisma.artwork.count(),
    prisma.user.count(),
  ]);

  return (
    <main className="min-h-screen bg-museum-bg">
      <Header />
      <HeroSection />

      {/* 최신 작품 섹션 */}
      <section id="gallery" className="relative py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-museum-accent/20" />

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionTitle
            subtitle="◆ Latest Artworks ◆"
            title="The Collection"
            description="Discover the most recent additions to our growing community of digital artists."
          />

          {artworks.length > 0 ? (
            <MasonryGrid artworks={artworks} />
          ) : (
            <div className="text-center py-16">
              <p className="text-museum-muted text-sm mb-4">
                No artworks uploaded yet. Be the first!
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3 border border-museum-accent/40 text-museum-accent text-xs tracking-[0.2em] uppercase hover:bg-museum-accent/10 transition-all duration-300"
              >
                Join & Upload
              </Link>
            </div>
          )}

          {/* 전체 보기 버튼 */}
          {artworks.length > 0 && (
            <div className="flex justify-center mt-16">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-10 py-4 border border-museum-accent/40 text-museum-accent text-xs tracking-[0.3em] uppercase hover:bg-museum-accent/10 transition-all duration-500"
              >
                View Full Gallery
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 통계 섹션 */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionTitle
            subtitle="◆ Community ◆"
            title="About ARTIUM"
            description="ARTIUM is a digital sanctuary where technology meets aesthetics. Upload, explore, and celebrate digital artistry."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12">
            {[
              { number: String(artworkCount), label: "Artworks" },
              { number: String(userCount), label: "Artists" },
              { number: "Free", label: "To Join" },
              { number: "∞", label: "Inspiration" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 border border-museum-border/20 hover:border-museum-accent/30 transition-colors duration-500 group"
              >
                <p className="font-display text-3xl md:text-4xl text-museum-white group-hover:text-museum-accent transition-colors duration-500 mb-2">
                  {stat.number}
                </p>
                <p className="text-museum-muted text-xs tracking-[0.15em] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
