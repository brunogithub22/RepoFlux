// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/superbase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();
    // This line actually saves the session into the cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Now that the cookie is definitely saved, go to admin
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  // If something goes wrong, go back home
  return NextResponse.redirect(`${origin}/`);
}