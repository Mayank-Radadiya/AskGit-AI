/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
   images: {
      domains: ["avatars.githubusercontent.com"],
   },
   typescript: {
      ignoreBuildErrors: false, // Ensure all TypeScript errors are caught
   },
   eslint: {
      ignoreDuringBuilds: true, // Avoid ESLint errors breaking the build
   },
};

export default config;


