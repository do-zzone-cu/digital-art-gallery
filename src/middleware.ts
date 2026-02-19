/* ===================================================
   Middleware - 인증 보호 라우트
   /upload, /my-gallery 접근 시 로그인 필요
   =================================================== */

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/upload", "/my-gallery"],
};
