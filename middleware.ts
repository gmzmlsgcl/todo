import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const AUTH_PAGES = ["/"];

const isAuthPages = (url: any) => AUTH_PAGES.includes(url);

export async function middleware(req: NextRequest) {
  const { url, nextUrl, cookies } = req;

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    if (isAuthPages(nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", url));
    }

    return NextResponse.next();
  } else {
    if (isAuthPages(nextUrl.pathname)) {
      return NextResponse.next();
    } else {
      const searchParams = new URLSearchParams(nextUrl.searchParams);
      searchParams.set("next", nextUrl.pathname);
      return NextResponse.redirect(new URL("/", url));
    }
  }
}

export const config = {
  matcher: ["/todo"],
};
