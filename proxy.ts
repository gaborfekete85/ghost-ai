import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// Public routes come from the existing Clerk sign-in / sign-up env vars.
const publicPaths = [
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
].filter((path): path is string => Boolean(path));

function isPublicRoute(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
