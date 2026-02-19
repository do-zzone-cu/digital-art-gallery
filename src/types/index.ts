/* ===================================================
   Artwork 타입 정의 (업그레이드)
   DB 모델과 프론트엔드 공유 타입
   =================================================== */

export interface Artwork {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: Date | string;
  userId: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export type Category = "All" | "Photography" | "3D Art" | "Illustration" | "Digital Painting" | "Abstract";
