/* ===================================================
   NextAuth API Route Handler
   App Router에서 NextAuth v5 엔드포인트 노출
   =================================================== */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
