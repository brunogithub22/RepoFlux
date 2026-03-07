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
    
    if (!error) {
      // 2. Use the realOrigin instead of the local 'origin'
      return NextResponse.redirect(`${realOrigin}/admin`);
    }
  }

  return NextResponse.redirect(`${realOrigin}/`);
}