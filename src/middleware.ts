import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Diagnostic header to trace environment variables
  response.headers.set('x-middleware-config', (!url || url === 'YOUR_SUPABASE_URL') ? 'missing' : 'present');

  if (!url || url === 'YOUR_SUPABASE_URL' || !key || key === 'YOUR_SUPABASE_ANON_KEY') {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Update request cookies for subsequent use in the same request
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        
        // Ensure response cookies are set too
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: Do not use supabase.auth.getSession() as it's less secure than getUser()
  const { data: { user } } = await supabase.auth.getUser()

  // Diagnostic header for auth status
  response.headers.set('x-middleware-auth-status', user ? 'authenticated' : 'unauthenticated');
  if (user) {
    response.headers.set('x-middleware-user-id', user.id);
  }

  const pathname = request.nextUrl.pathname;

  // 1. If user is trying to access admin pages (except admin login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      // Redirect to ADMIN login, not the student one
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Role check: Only allow users with 'admin' role in their profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      // Redirect unauthorized users to the student dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Redirect logged-in users away from login pages to prevent confusion
  if (user && (pathname === '/login' || pathname === '/admin/login')) {
    const redirectUrl = pathname.startsWith('/admin') ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
