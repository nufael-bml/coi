import { type ClassValue, clsx } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AUTH_BASE = process.env.AUTH_SERVICE_URL || "http://localhost:3000";

export function buildAuthRedirectURL(
  req: NextRequest,
  redirectPath?: string
): URL;
export function buildAuthRedirectURL(
  headers: Headers,
  pathname: string,
  search: string
): URL;
export function buildAuthRedirectURL(
  source: NextRequest | Headers,
  pathnameOrRedirectPath?: string,
  search = ""
): URL {
  const headers = source instanceof Headers ? source : source.headers;
  const pathname =
    source instanceof Headers
      ? pathnameOrRedirectPath
      : source.nextUrl.pathname;
  const searchParams =
    source instanceof Headers ? search : source.nextUrl.search;

  const host =
    headers.get("x-forwarded-host") || headers.get("host") || "localhost";
  const proto =
    headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  const returnTo = `${proto}://${host}${
    pathnameOrRedirectPath || pathname
  }${searchParams}`;
  const authUrl = new URL("/api/auth/initiate-login", AUTH_BASE);

  authUrl.searchParams.set("auth_return_to", returnTo);
  authUrl.searchParams.set("origin", `${proto}://${host}`);

  return authUrl;
}
