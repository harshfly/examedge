import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url === 'YOUR_SUPABASE_URL' || !key || key === 'YOUR_SUPABASE_ANON_KEY') {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        // Updating the response ensures cookies are sent back to the client
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: Do not use supabase.auth.getSession() as it's less secure than getUser()
  // and can be spoofed. always use getUser() to verify the user.
  const { data: { user } } = await supabase.auth.getUser()

  // 1. If user is trying to access admin pages (except admin login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      // Redirect to ADMIN login, not the student one
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 2. Optional: Redirect logged-in users away from login pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/admin/login')) {
    const redirectUrl = request.nextUrl.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
