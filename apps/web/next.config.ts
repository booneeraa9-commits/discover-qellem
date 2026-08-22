import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Issue #68: the dev server refuses chunks for origins other than the
  // configured ones; allow access via 127.0.0.1 (QA harness + local tooling).
  allowedDevOrigins: ["http://127.0.0.1:3000"],
};

export default nextConfig;
