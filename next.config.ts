import type { NextConfig } from "next";

// Skip TLS verification in development or when explicitly disabled
if (
  process.env.VERIFY_SSL === "false" ||
  (process.env.NODE_ENV === "development" && !process.env.VERIFY_SSL)
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
};

export default nextConfig;
