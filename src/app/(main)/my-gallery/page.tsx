/* ===================================================
   My Gallery 페이지 - 로그인한 사용자 본인 작품만 표시
   미인증 시 로그인 페이지로 리다이렉트
   =================================================== */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SectionTitle from "@/components/SectionTitle";
import MasonryGrid from "@/components/MasonryGrid";
import { Artwork } from "@/types";
import Link from "next/link";

export const revalidate = 0; /* 항상 최신 데이터 */

export default async function MyGalleryPage() {
  const session = await auth();

  /* 미인증 → 로그인 리다이렉트 */
  if (!session?.user?.id) {
    redirect("/login");
  }

  /* 본인 작품만 조회 */
  const dbArtworks = await prisma.artwork.findMany({
    where: { userId: session.user.id },
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

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionTitle
          subtitle={`◆ ${session.user.name || "Your"} Collection ◆`}
          title="My Gallery"
          description="Manage your uploaded artworks. Click the trash icon to remove a piece."
        />

        {/* 업로드 CTA */}
        <div className="flex justify-center mb-12">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-8 py-3 border border-museum-accent/40 text-museum-accent text-xs tracking-[0.2em] uppercase hover:bg-museum-accent/10 transition-all duration-300"
          >
            Upload New Artwork
          </Link>
        </div>

        <MasonryGrid artworks={artworks} showDelete />
      </div>
    </section>
  );
}
