/* ===================================================
   회원가입 페이지
   Framer Motion 애니메이션 + Server Action 회원가입
   =================================================== */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    /* 비밀번호 확인 */
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const result = await registerUser(formData);

    if (result.success) {
      router.push("/login?registered=true");
    } else {
      setError(result.error || "Registration failed.");
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md"
    >
      {/* 로고 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <Link href="/">
          <span className="font-display text-3xl tracking-[0.3em] text-museum-white">
            ART
          </span>
          <span className="font-display text-3xl tracking-[0.3em] text-museum-accent">
            IUM
          </span>
        </Link>
        <p className="text-museum-muted text-xs tracking-[0.2em] uppercase mt-3">
          Join the Gallery
        </p>
      </motion.div>

      {/* 폼 카드 */}
      <div className="bg-museum-surface/50 backdrop-blur-sm border border-museum-border/30 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <UserPlus size={18} className="text-museum-accent" />
          <h1 className="font-display text-2xl text-museum-white">
            Create Account
          </h1>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 이름 */}
          <div>
            <label className="text-museum-muted text-xs tracking-[0.1em] uppercase block mb-2">
              Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-museum-muted/50"
              />
              <input
                type="text"
                name="name"
                required
                className="w-full bg-museum-bg/50 border border-museum-border/50 text-museum-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-museum-accent/50 transition-colors placeholder:text-museum-muted/30"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label className="text-museum-muted text-xs tracking-[0.1em] uppercase block mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-museum-muted/50"
              />
              <input
                type="email"
                name="email"
                required
                className="w-full bg-museum-bg/50 border border-museum-border/50 text-museum-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-museum-accent/50 transition-colors placeholder:text-museum-muted/30"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-museum-muted text-xs tracking-[0.1em] uppercase block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-museum-muted/50"
              />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full bg-museum-bg/50 border border-museum-border/50 text-museum-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-museum-accent/50 transition-colors placeholder:text-museum-muted/30"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-museum-muted text-xs tracking-[0.1em] uppercase block mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-museum-muted/50"
              />
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full bg-museum-bg/50 border border-museum-border/50 text-museum-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-museum-accent/50 transition-colors placeholder:text-museum-muted/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-museum-accent text-museum-bg py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-museum-highlight transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-museum-border/20 text-center">
          <p className="text-museum-muted text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-museum-accent hover:text-museum-highlight transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
