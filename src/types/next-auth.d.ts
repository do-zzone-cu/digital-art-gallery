/* ===================================================
   NextAuth 타입 확장
   세션 user 객체에 id 필드 추가
   =================================================== */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
