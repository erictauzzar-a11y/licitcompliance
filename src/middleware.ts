import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas do dashboard requerem autenticação
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("licit_session")?.value;
    const supabaseAuthCookie = request.cookies.get("sb-access-token")?.value;

    const isAuthenticated = Boolean(sessionCookie || supabaseAuthCookie);

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
