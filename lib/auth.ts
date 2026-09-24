import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getAdminPasswordValue, getAuthSecret } from "@/lib/secrets";

const SESSION_COOKIE = "pcvezde_session";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

const USER_COOKIE = "pcvezde_user";

function getSecret() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function createSession() {
  const token = await new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function checkAdminPassword(input: string) {
  const adminPassword = getAdminPasswordValue();
  if (!adminPassword || !input) return false;

  if (/^\$(2a|2b|2y)\$/.test(adminPassword)) {
    return bcrypt.compare(input, adminPassword);
  }

  const a = Buffer.from(input);
  const b = Buffer.from(adminPassword);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---- Сессии для зарегистрированных клиентов ----

export async function getUserSessionId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "user") return null;
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function createUserSession(userId: string) {
  const token = await new SignJWT({ role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(USER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearUserSession() {
  const store = await cookies();
  store.delete(USER_COOKIE);
}

export async function requireUser() {
  const userId = await getUserSessionId();
  if (!userId) {
    redirect("/cabinet/login");
  }
  return userId;
}