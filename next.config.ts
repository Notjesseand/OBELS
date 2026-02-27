import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Force Webpack instead of Turbopack for CSS processing */
  turbopack: {
    // Ensure PostCSS is respected
  },
};

export default nextConfig;
