/* ===================================================
   Footer - 미니멀 푸터
   갤러리 정보 및 소셜 링크
   =================================================== */

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-museum-border/30">
      {/* 상단 장식 그래디언트 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-museum-accent/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* 브랜드 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="font-display text-2xl tracking-[0.3em] text-museum-white">
                ART
              </span>
              <span className="font-display text-2xl tracking-[0.3em] text-museum-accent">
                IUM
              </span>
            </div>
            <p className="text-museum-muted text-sm leading-relaxed max-w-xs">
              A curated digital art gallery dedicated to showcasing the finest
              works of contemporary digital artists from around the world.
            </p>
          </motion.div>

          {/* 빠른 링크 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-museum-white text-xs tracking-[0.2em] uppercase mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Gallery", "About", "Artists", "Submissions"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-museum-muted text-sm hover:text-museum-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {link}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 연락처 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-museum-white text-xs tracking-[0.2em] uppercase mb-6">
              Connect
            </h4>
            <ul className="space-y-3">
              {["Instagram", "Twitter / X", "Behance", "Dribbble"].map(
                (social) => (
                  <li key={social}>
                    <a
                      href="#"
                      className="text-museum-muted text-sm hover:text-museum-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      {social}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        </div>

        {/* 하단 카피라이트 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-museum-border/20 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-museum-muted/40 text-[11px] tracking-[0.15em]">
            © 2024 ARTIUM. All rights reserved.
          </p>
          <p className="text-museum-muted/30 text-[11px] tracking-[0.1em]">
            Crafted with precision and passion
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
