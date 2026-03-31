import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: "REGIONAL" | "DIRETOR_DE_EXPANSAO";
  name: string;
  [key: string]: any;
}

export async function createToken(payload: JWTPayload) {
  const token = await new SignJWT(payload as Record<string, any>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch (err) {
    return null;
  }
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function clearTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function getCurrentUser() {
  const token = await getTokenFromCookie();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return payload;
}
