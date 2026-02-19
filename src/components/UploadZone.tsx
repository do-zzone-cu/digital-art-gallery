/* ===================================================
   UploadZone - React Dropzone 기반 이미지 업로드 UI
   Drag & Drop + 미리보기 + 제목 입력 + 다중 업로드
   =================================================== */

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { uploadArtworks } from "@/actions/upload";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";

/* 업로드 파일 미리보기 타입 */
interface PreviewFile {
  file: File;
  preview: string;
  title: string;
  description: string;
}

export default function UploadZone() {
  const router = useRouter();
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  /* Dropzone 설정: 이미지 파일만 허용, 최대 10개 */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setUploadResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  /* 파일 제거 */
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  /* 제목 변경 */
  const updateTitle = (index: number, title: string) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title };
      return updated;
    });
  };

  /* 설명 변경 */
  const updateDescription = (index: number, description: string) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], description };
      return updated;
    });
  };

  /* 업로드 실행 */
  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    files.forEach(({ file, title, description }) => {
      formData.append("files", file);
      formData.append("titles", title);
      formData.append("descriptions", description);
    });

    const result = await uploadArtworks(formData);

    if (result.success) {
      setUploadResult({
        success: true,
        message: `${files.length} artwork${files.length > 1 ? "s" : ""} uploaded successfully!`,
      });
      /* 미리보기 URL 해제 */
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      /* 2초 후 갤러리로 이동 */
      setTimeout(() => {
        router.push("/my-gallery");
        router.refresh();
      }, 2000);
    } else {
      setUploadResult({
        success: false,
        message: result.error || "Upload failed. Please try again.",
      });
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-8">
      {/* 드롭존 영역 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-museum-accent bg-museum-accent/5"
              : "border-museum-border/40 hover:border-museum-accent/40 hover:bg-museum-surface/30"
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full border border-museum-accent/30 flex items-center justify-center">
              <ImagePlus
                size={24}
                className={`transition-colors ${
                  isDragActive ? "text-museum-accent" : "text-museum-muted"
                }`}
              />
            </div>
            <div>
              <p className="text-museum-white text-sm mb-1">
                {isDragActive
                  ? "Drop your artworks here..."
                  : "Drag & drop images here"}
              </p>
              <p className="text-museum-muted text-xs">
                or click to browse. JPEG, PNG, WebP, GIF up to 10MB each. Max 10 files.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 파일 미리보기 목록 */}
      <AnimatePresence mode="sync">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-museum-muted text-xs tracking-[0.15em] uppercase">
                {files.length} file{files.length > 1 ? "s" : ""} ready
              </p>
              <button
                onClick={() => {
                  files.forEach((f) => URL.revokeObjectURL(f.preview));
                  setFiles([]);
                }}
                className="text-museum-muted text-xs hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear all
              </button>
            </div>

            {files.map((file, index) => (
              <motion.div
                key={`${file.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 bg-museum-surface/50 border border-museum-border/20 p-4"
              >
                {/* 미리보기 이미지 */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-museum-bg overflow-hidden">
                  <Image
                    src={file.preview}
                    alt={file.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* 제목 + 설명 입력 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="text"
                    value={file.title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                    placeholder="Artwork title"
                    className="w-full bg-transparent border-b border-museum-border/30 text-museum-white text-sm pb-1 focus:outline-none focus:border-museum-accent/50 transition-colors placeholder:text-museum-muted/30"
                  />
                  <input
                    type="text"
                    value={file.description}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full bg-transparent border-b border-museum-border/20 text-museum-muted text-xs pb-1 focus:outline-none focus:border-museum-accent/30 transition-colors placeholder:text-museum-muted/20"
                  />
                  <p className="text-museum-muted/40 text-[10px]">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => removeFile(index)}
                  className="text-museum-muted/40 hover:text-red-400 transition-colors self-start"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 결과 메시지 */}
      <AnimatePresence>
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 flex items-center gap-3 ${
              uploadResult.success
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {uploadResult.success ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <p className="text-sm">{uploadResult.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 업로드 버튼 */}
      {files.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: isUploading ? 1 : 1.02 }}
          whileTap={{ scale: isUploading ? 1 : 0.98 }}
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-museum-accent text-museum-bg py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-museum-highlight transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload {files.length} Artwork{files.length > 1 ? "s" : ""}
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
