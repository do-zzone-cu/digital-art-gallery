/* ===================================================
   Auth Layout - 로그인/회원가입 페이지 공통 레이아웃
   Museum 테마의 중앙 정렬 폼
   =================================================== */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-museum-bg flex items-center justify-center p-6">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-museum-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-museum-accent/3 rounded-full blur-3xl" />
      </div>
      {children}
    </div>
  );
}
