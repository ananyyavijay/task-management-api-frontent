import { NextResponse } from "next/server";

// Kept in sync with lib/auth-token.js's AUTH_COOKIE_NAME. Not imported directly
// because that module pulls in js-cookie, which assumes a `document` global
// that doesn't exist in the middleware/edge runtime.
const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "taskflow_token";

const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // No token on a protected route → bounce to /login, remembering where they came from.
  if (!token && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Already have a token but landed on /login or /register → send to the dashboard.
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
