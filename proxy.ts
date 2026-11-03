import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// same values the backend returns in user.role
type Role = "admin" | "agent" | "client";

const STAFF_PREFIXES = ["/dashboard"];               
const ADMIN_ONLY_PREFIXES = ["/dashboard/users", "/dashboard/webhooks"];
const CLIENT_PREFIXES = ["/account"];
const GUEST_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password"];

const ROLE_HOME: Record<Role, string> = {
  admin: "/dashboard",
  agent: "/dashboard",
  client: "/account",
};

const isStaff = (role: Role) => role === "admin" || role === "agent";
const isRole = (v: string | undefined): v is Role =>
  v === "admin" || v === "agent" || v === "client";

/** Split "/ar/dashboard/x" into { locale: "ar", path: "/dashboard/x" }. */
function splitLocale(pathname: string) {
  const segments = pathname.split("/");
  const first = segments[1];

  if (first && (routing.locales as readonly string[]).includes(first)) {
    const path = "/" + segments.slice(2).join("/");
    return { locale: first, path: path === "/" ? "/" : path.replace(/\/$/, "") };
  }
  return { locale: null as string | null, path: pathname.replace(/\/$/, "") || "/" };
}

function matches(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { locale, path } = splitLocale(pathname);

  const token = request.cookies.get("dealora_token")?.value;
  const roleCookie = request.cookies.get("dealora_user_role")?.value;
  const role: Role | null = isRole(roleCookie) ? roleCookie : null;

  const isAuthenticated = Boolean(token);

  const isStaffRoute = matches(path, STAFF_PREFIXES);
  const isAdminOnlyRoute = matches(path, ADMIN_ONLY_PREFIXES);
  const isClientRoute = matches(path, CLIENT_PREFIXES);
  const isGuestRoute = matches(path, GUEST_PREFIXES);
  const isProtected = isStaffRoute || isClientRoute;

  // Keep the locale prefix (if the URL had one) on every redirect.
  const redirectTo = (target: string, keepNext = false) => {
    const url = request.nextUrl.clone();
    url.pathname = locale ? `/${locale}${target}` : target;
    url.search = keepNext ? `?next=${encodeURIComponent(pathname + search)}` : "";
    return NextResponse.redirect(url);
  };

  // 1. Not logged in -> protected pages go to login (remember where they were going).
  if (!isAuthenticated && isProtected) {
    return redirectTo("/login", true);
  }

  if (isAuthenticated) {
    // 2. Logged in but role cookie missing/invalid -> treat as logged out.
    if (!role && isProtected) {
      const res = redirectTo("/login", true);
      res.cookies.delete("dealora_token");
      res.cookies.delete("dealora_user_role");
      return res;
    }

    if (role) {
      // 3. Logged-in users shouldn't see login/register/etc.
      if (isGuestRoute) return redirectTo(ROLE_HOME[role]);

      // 4. Role separation.
      if (role === "client" && isStaffRoute) return redirectTo(ROLE_HOME.client);
      if (isStaff(role) && isClientRoute) return redirectTo(ROLE_HOME[role]);

      // 5. Agents can't open admin-only pages (users, webhook logs ...).
      if (role === "agent" && isAdminOnlyRoute) return redirectTo(ROLE_HOME.agent);
    }
  }

  // Everything else goes through next-intl.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|mjs|json|xml|txt|webmanifest|woff2?|ttf|map)$).*)",
  ],
};