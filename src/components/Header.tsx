/* ===================================================
   Header - 네비게이션 바 (인증 통합)
   로그인/로그아웃 버튼, 업로드 버튼,
   스크롤 시 배경이 변하는 글래스모피즘 헤더
   =================================================== */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, Upload, LogIn, LogOut, User, ImageIcon } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Gallery", href: "/gallery", icon: ImageIcon },
    ...(session
      ? [
          { label: "My Gallery", href: "/my-gallery", icon: User },
          { label: "Upload", href: "/upload", icon: Upload },
        ]
      : []),
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-museum-bg/80 backdrop-blur-xl border-b border-museum-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <nav className="flex items-center justify-between h-20">
          {/* 로고 */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="relative z-10">
              <span className="font-display text-2xl tracking-[0.3em] text-museum-white">
                ART
              </span>
              <span className="font-display text-2xl tracking-[0.3em] text-museum-accent">
                IUM
              </span>
            </Link>
          </motion.div>

          {/* 데스크톱 네비게이션 */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm tracking-[0.15em] uppercase text-museum-muted hover:text-museum-white transition-colors duration-300 relative group flex items-center gap-2"
                >
                  <link.icon size={14} />
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-museum-accent group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}

            {/* 인증 버튼 */}
            <li>
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-xs text-museum-muted tracking-wide hidden lg:block">
                    {session.user?.name || session.user?.email}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.1em] uppercase border border-museum-border text-museum-muted hover:text-museum-white hover:border-museum-accent/50 transition-all duration-300"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase border border-museum-accent/40 text-museum-accent hover:bg-museum-accent/10 transition-all duration-300"
                  >
                    <LogIn size={14} />
                    Sign In
                  </motion.span>
                </Link>
              )}
            </li>
          </ul>

          {/* 모바일 메뉴 토글 */}
          <button
            className="md:hidden relative z-10 text-museum-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* 모바일 풀스크린 메뉴 */}
      <motion.div
        initial={false}
        animate={
          isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
        }
        transition={{ duration: 0.3 }}
        className={`md:hidden fixed inset-0 bg-museum-bg/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {navLinks.map((link, index) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isMobileMenuOpen
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
          >
            <Link
              href={link.href}
              className="font-display text-2xl tracking-[0.2em] text-museum-white hover:text-museum-accent transition-colors flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          </motion.div>
        ))}

        {/* 모바일 인증 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-4"
        >
          {session ? (
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-6 py-3 border border-museum-border text-museum-muted text-lg"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-6 py-3 border border-museum-accent/40 text-museum-accent text-lg"
            >
              <LogIn size={18} />
              Sign In
            </Link>
          )}
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
