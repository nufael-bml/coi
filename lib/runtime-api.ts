// runtime-api.ts
// Helper to determine API base URL at runtime.
// Uses `NEXT_PUBLIC_API_URL` if available, but in the browser will override
// to the hosted API when the app is served from the hosted domain, allowing
// one build artifact to work both locally and in hosted dev.

export function getApiBaseUrl(): string {
  const envUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  ).replace(/\/+$/g, "");

  if (typeof window === "undefined") {
    // Server-side: use env value (build-time)
    return envUrl;
  }

  // Client-side: prefer a runtime mapping for hosted dev domain
  try {
    const host = window.location.host || window.location.hostname;
    const protocol = window.location.protocol;

    // If running on the hosted dev domain, use the hosted API
    if (
      host.endsWith("oneui-dev.bml.com.mv") ||
      host.endsWith("oneui-dev.bml.com")
    ) {
      return "https://brdcr-tracker-api.oneui-dev.bml.com.mv/api";
    }

    // If we're on HTTPS and not localhost, assume we're in production
    // and the API is on the same domain with /api suffix
    if (protocol === "https:" && !host.includes("localhost")) {
      console.log(
        "[runtime-api] Detected hosted environment, using relative API URL"
      );
      return "/api"; // Use relative URL, will work with proxy or same-origin API
    }
  } catch (e) {
    console.error("[runtime-api] Error detecting host:", e);
  }

  // Fallback to env / localhost
  return envUrl;
}
