// lib/actions/theme.ts
"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { getCurrentUserID } from "./auth";

const API_URL = process.env.GO_APPS_API_URL || "http://localhost:3004/api";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemePreferences {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

const DEFAULT_THEME: ThemePreferences = {
  mode: "system",
  primaryColor: "#3b82f6",
  accentColor: "#8b5cf6",
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const key = `${userId}:theme`;
  const userLimit = rateLimitMap.get(key);

  if (userLimit && now > userLimit.resetAt) {
    rateLimitMap.delete(key);
  }

  const current = rateLimitMap.get(key);

  if (!current) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60000 });
    return { allowed: true };
  }

  if (current.count >= 10) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  current.count++;
  return { allowed: true };
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    next: { revalidate: options?.method === "GET" ? 300 : undefined },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Failed with status ${res.status}`);
  }

  return res.json();
}

const getCachedTheme = unstable_cache(
  async (userId: string): Promise<ThemePreferences> => {
    const data = await fetchAPI<{ theme: ThemePreferences }>(
      `/user/${userId}/preferences`
    );
    return data.theme;
  },
  ["theme-preferences"],
  { tags: ["user-preferences"], revalidate: 300 }
);

export async function getUserTheme(): Promise<ThemePreferences> {
  const userId = await getCurrentUserID();
  if (!userId) return DEFAULT_THEME;

  try {
    return await getCachedTheme(userId);
  } catch (error) {
    console.error("Failed to fetch theme preferences:", error);
    return DEFAULT_THEME;
  }
}

export async function updateTheme(updates: Partial<ThemePreferences>): Promise<{
  success: boolean;
  error?: string;
  retryAfter?: number;
}> {
  const userId = await getCurrentUserID();
  if (!userId) return { success: false, error: "Authentication required" };

  const rateLimit = checkRateLimit(userId);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rateLimit.retryAfter}s`,
      retryAfter: rateLimit.retryAfter,
    };
  }

  try {
    const currentTheme = await getCachedTheme(userId);
    const newTheme = { ...currentTheme, ...updates };

    await fetchAPI(`/user/${userId}/preferences/theme`, {
      method: "PUT",
      body: JSON.stringify({
        mode: newTheme.mode === "system" ? "auto" : newTheme.mode, // Convert system to auto for API
        primaryColor: newTheme.primaryColor,
        accentColor: newTheme.accentColor,
      }),
    });

    revalidateTag("user-preferences", "default");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update theme",
    };
  }
}

export async function setThemeMode(mode: ThemeMode): Promise<{
  success: boolean;
  error?: string;
  retryAfter?: number;
}> {
  return updateTheme({ mode });
}

export async function setThemeColors(
  primaryColor: string,
  accentColor: string
): Promise<{
  success: boolean;
  error?: string;
  retryAfter?: number;
}> {
  return updateTheme({ primaryColor, accentColor });
}
