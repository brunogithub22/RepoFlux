import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll(); // ✅ read from request directly
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options) // ✅ write to response
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const admin = process.env.CMS_ADMIN_USER_ID!;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user || user.id !== admin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse; // ✅ must return this, not a plain NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
};