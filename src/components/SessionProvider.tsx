/* ===================================================
   SessionProvider 래퍼
   클라이언트 컴포넌트에서 useSession 사용을 위한
   NextAuth SessionProvider 래핑
   =================================================== */

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
