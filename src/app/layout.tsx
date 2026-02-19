/* ===================================================
   Root Layout - Museum Mode 갤러리 + NextAuth 세션
   Google Fonts를 Next.js Font로 최적화 로딩
   =================================================== */

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { auth } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

/* 본문 폰트 - 깔끔한 산세리프 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* 디스플레이 폰트 - 우아한 세리프 (제목용) */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARTIUM — Digital Art Gallery",
  description:
    "A curated multi-user digital art gallery. Upload, explore, and celebrate digital artistry.",
  keywords: ["digital art", "gallery", "photography", "3D art", "illustration", "upload"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} font-body bg-museum-bg text-museum-text antialiased noise-overlay`}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
