import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/teacher": ["TEACHER", "ADMIN"],
  "/admin": ["ADMIN"],
};

export default auth(function middleware(req: NextRequest & { auth: { user?: { role?: string } } | null }) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtected = Object.keys(ROLE_ROUTES).some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      const userRole = session?.user?.role ?? "";
      if (!roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/courses", req.url));
      }
    }
  }

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL("/courses", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
