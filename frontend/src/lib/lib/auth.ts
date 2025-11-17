// lib/auth.ts
import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value ?? null;
}
