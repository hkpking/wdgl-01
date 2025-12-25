import { createMiddlewareClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Dev/Test 环境下允许绕过鉴权
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'

// 公开页面（无需登录即可访问）
const PUBLIC_PATHS = ['/login', '/portal/login']

export async function middleware(request: NextRequest) {
    // 绕过模式下直接放行
    if (BYPASS_AUTH) {
        return NextResponse.next()
    }

    const pathname = request.nextUrl.pathname
    const isPublicPage = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))
    const isPortalLoginPage = pathname === '/portal/login'
    const isMainLoginPage = pathname === '/login'
    const isPortalPage = pathname.startsWith('/portal') && !isPortalLoginPage

    try {
        const { supabase, response } = createMiddlewareClient(request)

        // 获取当前用户状态
        const { data: { user }, error } = await supabase.auth.getUser()

        // 如果获取用户失败（token 无效等），清除状态，当作未登录处理
        if (error) {
            console.warn('[Middleware] Auth error:', error.message)
            // 公开页面放行
            if (isPublicPage) {
                return response
            }
            // 门户页面 -> 重定向到门户登录
            if (isPortalPage) {
                return NextResponse.redirect(new URL('/portal/login', request.url))
            }
            // 其他受保护页面 -> 重定向到普通登录页
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // 公开页面处理
        if (isPublicPage) {
            // 已登录用户访问门户登录页 -> 重定向到门户
            if (user && isPortalLoginPage) {
                return NextResponse.redirect(new URL('/portal', request.url))
            }
            // 已登录用户访问普通登录页 -> 重定向到 Dashboard
            if (user && isMainLoginPage) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
            return response
        }

        // 未登录用户访问门户 -> 重定向到门户登录页
        if (!user && isPortalPage) {
            return NextResponse.redirect(new URL('/portal/login', request.url))
        }

        // 未登录用户访问其他受保护页面 -> 重定向到登录页
        if (!user && pathname !== '/') {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // 未登录用户访问首页 -> 重定向到登录页
        if (!user && pathname === '/') {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // 已登录用户访问首页 -> 重定向到门户
        if (user && pathname === '/') {
            return NextResponse.redirect(new URL('/portal', request.url))
        }

        // 统一路由：/ask-ai 重定向到 /dashboard
        if (pathname.startsWith('/ask-ai')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        return response
    } catch (err) {
        console.error('[Middleware] Unexpected error:', err)
        // 发生错误时的处理
        if (isPublicPage) {
            return NextResponse.next()
        }
        if (isPortalPage) {
            return NextResponse.redirect(new URL('/portal/login', request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/', '/ask-ai/:path*', '/dashboard/:path*', '/editor/:path*', '/login', '/portal/:path*'],
}
