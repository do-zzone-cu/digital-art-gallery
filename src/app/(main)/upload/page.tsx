/* ===================================================
   Upload 페이지 - 작품 업로드 (인증 필수)
   미인증 시 로그인 페이지로 리다이렉트
   =================================================== */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SectionTitle from "@/components/SectionTitle";
import UploadZone from "@/components/UploadZone";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <SectionTitle
          subtitle="◆ Share Your Art ◆"
          title="Upload Artworks"
          description="Drag and drop your digital artworks to share them with the world."
        />
        <UploadZone />
      </div>
    </section>
  );
}
