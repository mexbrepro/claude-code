import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, static files, and the standalone
  // immersive-storytelling section (its own dark-themed, locale-free world).
  matcher: ["/((?!api|_next|_vercel|story|.*\\..*).*)"],
};
