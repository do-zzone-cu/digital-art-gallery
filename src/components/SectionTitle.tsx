/* ===================================================
   SectionTitle - 재사용 가능한 섹션 타이틀 컴포넌트
   스크롤 시 시야에 들어올 때 애니메이션 트리거
   =================================================== */

"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      {/* 상단 서브타이틀 */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-museum-accent text-[10px] tracking-[0.4em] uppercase mb-4"
      >
        {subtitle}
      </motion.p>

      {/* 메인 타이틀 */}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-museum-white mb-4">
        {title}
      </h2>

      {/* 장식 구분선 */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 60 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
        className="h-px bg-museum-accent mx-auto mb-6"
      />

      {/* 설명 텍스트 */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-museum-muted text-sm max-w-xl mx-auto leading-relaxed tracking-wide"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
