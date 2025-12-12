import { createMiddlewareClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Dev/Test 环境下允许绕过鉴权
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'

export async function middleware(request: NextRequest) {
    // 绕过模式下直接放行
    if (BYPASS_AUTH) {
        return NextResponse.next()
    }

    const { supabase, response } = createMiddlewareClient(request)
    const isAuthPage = request.nextUrl.pathname.startsWith('/login')

    // 获取当前用户状态
    const { data: { user } } = await supabase.auth.getUser()

    // 未登录用户访问受保护页面 -> 重定向到登录页
    if (!user && !isAuthPage && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 未登录用户访问首页 -> 重定向到登录页
    if (!user && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 已登录用户访问登录页 -> 重定向到 Dashboard
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/editor/:path*', '/login'],
}
