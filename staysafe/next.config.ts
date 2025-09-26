import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Only apply basePath and assetPrefix for production builds
  ...(process.env.NODE_ENV === "production" && {
    basePath: "/static",
    assetPrefix: "/static",
  }),
};

export default nextConfig;
