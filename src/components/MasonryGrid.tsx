/* ===================================================
   MasonryGrid - DB 기반 메이슨리 그리드 갤러리
   서버에서 받은 작품 데이터를 Masonry 레이아웃으로 렌더
   Lightbox 모달 포함
   =================================================== */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Artwork } from "@/types";
import { Eye, X, Calendar, User, Trash2 } from "lucide-react";
import { deleteArtwork } from "@/actions/upload";
import { useRouter } from "next/navigation";

interface MasonryGridProps {
  artworks: Artwork[];
  showDelete?: boolean; /* My Gallery에서만 삭제 버튼 표시 */
}

export default function MasonryGrid({
  artworks,
  showDelete = false,
}: MasonryGridProps) {
  const router = useRouter();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openModal = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedArtwork(null);
    document.body.style.overflow = "auto";
  }, []);

  const handleDelete = async (e: React.MouseEvent, artworkId: string) => {
    e.stopPropagation();
    if (!confirm("Delete this artwork?")) return;
    setDeletingId(artworkId);
    const result = await deleteArtwork(artworkId);
    if (result.success) {
      router.refresh();
    }
    setDeletingId(null);
  };

  if (artworks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24"
      >
        <div className="w-16 h-16 rounded-full border border-museum-border/30 flex items-center justify-center mx-auto mb-6">
          <Eye size={24} className="text-museum-muted/30" />
        </div>
        <p className="text-museum-muted text-sm tracking-[0.15em]">
          No artworks yet.
        </p>
        <p className="text-museum-muted/50 text-xs mt-2">
          Be the first to share your work.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* 메이슨리 그리드 */}
      <div className="masonry-grid">
        <AnimatePresence mode="sync">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                opacity: { duration: 0.4, delay: index * 0.04 },
                y: { duration: 0.5, delay: index * 0.04, ease: "easeOut" },
                layout: { type: "spring", stiffness: 300, damping: 30 },
              }}
              className="masonry-item group cursor-pointer"
              onClick={() => openModal(artwork)}
            >
              <div className="relative overflow-hidden bg-museum-surface rounded-sm">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={artwork.width || 800}
                  height={artwork.height || 600}
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-museum-bg/90 via-museum-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-museum-accent/60 flex items-center justify-center backdrop-blur-sm bg-museum-bg/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Eye size={18} className="text-museum-accent" />
                    </div>
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="font-display text-lg text-museum-white leading-tight mb-1">
                      {artwork.title}
                    </h3>
                    {artwork.user && (
                      <p className="text-museum-muted text-xs tracking-wide">
                        by {artwork.user.name || artwork.user.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* 삭제 버튼 (My Gallery) */}
                {showDelete && (
                  <button
                    onClick={(e) => handleDelete(e, artwork.id)}
                    disabled={deletingId === artwork.id}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-museum-bg/70 backdrop-blur-sm border border-museum-border/50 text-museum-muted hover:text-red-400 hover:border-red-400/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox 모달 */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-museum-bg/85 backdrop-blur-xl" />

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center border border-museum-border hover:border-museum-accent/50 text-museum-muted hover:text-museum-white transition-all duration-300 bg-museum-bg/50 backdrop-blur-sm"
            >
              <X size={20} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex flex-col lg:flex-row gap-8 max-w-6xl w-full max-h-[90vh]"
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                <Image
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  width={selectedArtwork.width || 1200}
                  height={selectedArtwork.height || 800}
                  className="w-full h-auto object-contain max-h-[80vh] rounded-sm"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="lg:w-80 flex-shrink-0 flex flex-col justify-center"
              >
                <h2 className="font-display text-3xl md:text-4xl text-museum-white leading-tight mb-3">
                  {selectedArtwork.title}
                </h2>

                {selectedArtwork.user && (
                  <div className="flex items-center gap-2 text-museum-muted text-sm mb-6">
                    <User size={14} className="text-museum-accent/60" />
                    <span>
                      {selectedArtwork.user.name || selectedArtwork.user.email}
                    </span>
                  </div>
                )}

                <div className="w-12 h-px bg-museum-accent/40 mb-6" />

                {selectedArtwork.description && (
                  <p className="text-museum-muted/80 text-sm leading-relaxed mb-8">
                    {selectedArtwork.description}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={14} className="text-museum-accent/60" />
                    <span className="text-museum-muted/60 text-xs">Date</span>
                    <span className="text-museum-text ml-auto">
                      {new Date(selectedArtwork.createdAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>
                  {selectedArtwork.width > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <Eye size={14} className="text-museum-accent/60" />
                      <span className="text-museum-muted/60 text-xs">Size</span>
                      <span className="text-museum-text ml-auto">
                        {selectedArtwork.width} x {selectedArtwork.height}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-museum-border/30">
                  <p className="text-museum-muted/40 text-[10px] tracking-[0.2em] uppercase">
                    ARTIUM Digital Art Gallery
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
