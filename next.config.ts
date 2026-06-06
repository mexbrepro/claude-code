import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Produce a self-contained server bundle (.next/standalone) so the app can be
  // shipped to a Node host over FTP without uploading the full node_modules.
  // See scripts/deploy-ftp.mjs and `npm run deploy:ftp`.
  output: "standalone",
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default withNextIntl(nextConfig);
