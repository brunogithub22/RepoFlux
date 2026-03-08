import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/superbase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin; // ✅ explicitly declare it

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(`${origin}/?error=${error.message}`);
    }

    return NextResponse.redirect(`${origin}/admin`);
  }

  return NextResponse.redirect(`${origin}/`);
}