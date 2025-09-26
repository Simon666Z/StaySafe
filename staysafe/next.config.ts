import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/static",
  assetPrefix: "/static",
};

export default nextConfig;
