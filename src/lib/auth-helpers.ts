import { cookies } from "next/headers";
import { verifyToken, AuthTokenPayload } from "./auth";

export function getAuthTokenFromCookies(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get("nsumate_token")?.value;
  return token ?? null;
}

export function getCurrentUserFromRequest(): AuthTokenPayload | null {
  const token = getAuthTokenFromCookies();
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

