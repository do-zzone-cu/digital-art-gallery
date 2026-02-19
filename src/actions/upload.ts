/* ===================================================
   Upload Actions - 이미지 업로드 서버 액션
   파일을 /public/uploads에 저장 후 DB에 기록
   sharp로 이미지 메타데이터(가로/세로) 추출
   =================================================== */

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

/* ===================== 타입 정의 ===================== */

interface UploadResult {
  success: boolean;
  error?: string;
  artworkId?: string;
}

interface BulkUploadResult {
  success: boolean;
  results: UploadResult[];
  error?: string;
}

/* ===================== 단일 이미지 업로드 ===================== */

async function saveImageToDisk(
  file: File
): Promise<{ filePath: string; width: number; height: number }> {
  /* 업로드 디렉토리 확인 및 생성 */
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  /* 파일 이름 생성: UUID + 확장자 */
  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  /* 파일 버퍼 읽기 */
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  /* sharp로 이미지 메타데이터 추출 */
  let width = 800;
  let height = 600;
  try {
    const metadata = await sharp(buffer).metadata();
    width = metadata.width || 800;
    height = metadata.height || 600;
  } catch {
    // 메타데이터 추출 실패 시 기본값 사용
  }

  /* 파일 저장 */
  await writeFile(filePath, buffer);

  return {
    filePath: `/uploads/${fileName}`,
    width,
    height,
  };
}

/* ===================== 다중 이미지 업로드 ===================== */

export async function uploadArtworks(formData: FormData): Promise<BulkUploadResult> {
  /* 인증 확인: 로그인한 사용자만 업로드 가능 */
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, results: [], error: "You must be signed in to upload." };
  }

  const files = formData.getAll("files") as File[];
  const titles = formData.getAll("titles") as string[];
  const descriptions = formData.getAll("descriptions") as string[];

  if (files.length === 0) {
    return { success: false, results: [], error: "No files provided." };
  }

  /* 파일 타입 검증 */
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        results: [],
        error: `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, GIF allowed.`,
      };
    }
    /* 파일 크기 제한: 10MB */
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        results: [],
        error: `File too large: ${file.name}. Maximum size is 10MB.`,
      };
    }
  }

  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      const title = titles[i] || file.name.replace(/\.[^/.]+$/, "");
      const description = descriptions[i] || "";

      /* 파일 저장 */
      const { filePath, width, height } = await saveImageToDisk(file);

      /* DB에 기록 */
      const artwork = await prisma.artwork.create({
        data: {
          title,
          description,
          imageUrl: filePath,
          width,
          height,
          userId: session.user.id,
        },
      });

      results.push({ success: true, artworkId: artwork.id });
    } catch {
      results.push({
        success: false,
        error: `Failed to upload ${files[i].name}`,
      });
    }
  }

  const allSuccess = results.every((r) => r.success);
  return { success: allSuccess, results };
}

/* ===================== 작품 삭제 ===================== */

export async function deleteArtwork(artworkId: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated." };
  }

  try {
    /* 본인 작품인지 확인 후 삭제 */
    const artwork = await prisma.artwork.findFirst({
      where: { id: artworkId, userId: session.user.id },
    });

    if (!artwork) {
      return { success: false, error: "Artwork not found or unauthorized." };
    }

    await prisma.artwork.delete({ where: { id: artworkId } });

    /* 파일 시스템에서도 삭제 (선택사항) */
    try {
      const fs = await import("fs/promises");
      const filePath = path.join(process.cwd(), "public", artwork.imageUrl);
      await fs.unlink(filePath);
    } catch {
      // 파일 삭제 실패는 무시 (DB 레코드는 이미 삭제됨)
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete artwork." };
  }
}
