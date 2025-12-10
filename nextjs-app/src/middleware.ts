import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('wdgl_auth_token')
    const isAuthPage = request.nextUrl.pathname.startsWith('/login')

    if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow root to redirect to dashboard logic (or login) in page.tsx effectively
    // But usually root is protected too?
    if (!token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/editor/:path*', '/login'],
}
