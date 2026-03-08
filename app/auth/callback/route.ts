import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/superbase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // 1. Get the real origin from headers
  const host = request.headers.get('host'); // e.g., your-app.vercel.app
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const realOrigin = `${protocol}://${host}`;

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    // Add this 👇
    if (error) {
      console.error('Auth callback error:', error.message, error);
      return NextResponse.redirect(`${origin}/?error=${error.message}`);
    }

    return NextResponse.redirect(`${origin}/admin`);
  }

  return NextResponse.redirect(`${realOrigin}/`);
}