import type { NextConfig } from "next";

/**
 * Built as plain files for GitHub Pages (`next build` → `out/`).
 * The deploy workflow sets PAGES_BASE_PATH to "/<repo-name>" because
 * project sites live at https://<user>.github.io/<repo-name>/.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
