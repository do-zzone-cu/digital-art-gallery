/* ===================================================
   Hero Section - 시선을 사로잡는 인트로 섹션
   패럴랙스 효과, 타이포그래피 애니메이션,
   스크롤 유도 인디케이터 포함
   =================================================== */

"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

/* 커스텀 이징 커브 (cubic-bezier) */
const cubicEase = [0.22, 1, 0.36, 1] as const;

/* 텍스트 한 글자씩 등장하는 애니메이션 Variant */
const letterAnimation: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.04 + 0.5,
      duration: 0.8,
      ease: cubicEase as unknown as [number, number, number, number],
    },
  }),
};

/* Fade-in 블록 애니메이션 */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* 패럴랙스: 스크롤 시 요소들이 다른 속도로 이동 */
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const title = "ARTIUM";
  const subtitle = "Digital Art Gallery";

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      {/* 배경 이미지 - 패럴랙스 레이어 */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&q=80')",
          }}
        />
        {/* 다크 그래디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-museum-bg/70 via-museum-bg/50 to-museum-bg" />
        {/* 비네트 효과 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.6)_100%)]" />
      </motion.div>

      {/* 좌측 장식 라인 */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "30%" }}
        transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
        className="absolute left-12 top-1/2 -translate-y-1/2 w-px bg-gradient-to-b from-transparent via-museum-accent/50 to-transparent hidden lg:block"
      />

      {/* 우측 장식 라인 */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "30%" }}
        transition={{ delay: 1.7, duration: 1.2, ease: "easeOut" }}
        className="absolute right-12 top-1/2 -translate-y-1/2 w-px bg-gradient-to-b from-transparent via-museum-accent/50 to-transparent hidden lg:block"
      />

      {/* 메인 콘텐츠 - 패럴랙스 레이어 */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6"
      >
        {/* 작은 상단 태그 */}
        <motion.p
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-museum-accent text-xs tracking-[0.4em] uppercase mb-8"
        >
          ◆ Curated Collection 2024 ◆
        </motion.p>

        {/* 메인 타이틀 - 글자별 애니메이션 */}
        <h1 className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold leading-none mb-4">
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={letterAnimation}
              className="inline-block text-gradient"
              style={{ transformOrigin: "bottom" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* 서브타이틀 */}
        <motion.div className="overflow-hidden mb-8">
          <motion.p
            custom={1.2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="font-body text-lg md:text-xl tracking-[0.3em] uppercase text-museum-muted"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* 구분선 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeInOut" }}
          className="h-px bg-museum-accent mx-auto mb-8"
        />

        {/* 설명 텍스트 */}
        <motion.p
          custom={1.6}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-md mx-auto text-museum-muted/80 text-sm leading-relaxed tracking-wide"
        >
          A curated space where digital artistry meets immersive experience.
          <br />
          Explore works that transcend the boundaries of imagination.
        </motion.p>

        {/* CTA 버튼 */}
        <motion.a
          href="#gallery"
          custom={2.0}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-10 px-10 py-4 border border-museum-accent/40 text-museum-accent text-xs tracking-[0.3em] uppercase hover:bg-museum-accent/10 transition-all duration-500 backdrop-blur-sm"
        >
          Explore Gallery
        </motion.a>
      </motion.div>

      {/* 스크롤 유도 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-museum-muted/50 text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-museum-accent/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
