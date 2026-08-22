"use server";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  parseAuthUsers,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve parola gerekli." };
  }

  if (!process.env.AUTH_SECRET) {
    return { error: "AUTH_SECRET yapılandırılmamış." };
  }

  const user = parseAuthUsers().find((u) => u.email === email);
  if (!user || !passwordsMatch(password, user.password)) {
    return { error: "E-posta veya parola hatalı." };
  }

  const token = await createSessionToken({
    email: user.email,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());

  redirect("/");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  redirect("/giris");
}
