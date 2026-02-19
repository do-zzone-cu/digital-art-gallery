/* ===================================================
   Main Layout - 인증 필요 없는 페이지 공통 레이아웃
   Header + Footer 포함
   =================================================== */

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-museum-bg flex flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
