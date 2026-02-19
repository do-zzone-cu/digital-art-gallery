/* ===================================================
   Auth Actions - 회원가입 / 로그인 서버 액션
   Server Actions를 사용하여 API Route 없이 서버 로직 처리
   =================================================== */

"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";

/* ===================== 타입 정의 ===================== */

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ===================== 회원가입 ===================== */

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  /* 유효성 검사 */
  if (!email || !password || !name) {
    return { success: false, error: "All fields are required." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  try {
    /* 이메일 중복 확인 */
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    /* 비밀번호 해싱 (salt rounds: 12) */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* 사용자 생성 */
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/* ===================== 로그인 ===================== */

export async function loginUser(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password." };
        default:
          return { success: false, error: "Authentication failed." };
      }
    }
    throw error;
  }
}
