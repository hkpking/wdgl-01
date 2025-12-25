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
    const isWdglPage = pathname.startsWith('/wdgl')

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
            // 受保护页面 -> 重定向到门户登录
            return NextResponse.redirect(new URL('/portal/login', request.url))
        }

        // 公开页面处理
        if (isPublicPage) {
            // 已登录用户访问登录页 -> 重定向到门户首页
            if (user) {
                return NextResponse.redirect(new URL('/', request.url))
            }
            return response
        }

        // 未登录用户访问受保护页面 -> 重定向到门户登录页
        if (!user && (isWdglPage || isPortalPage || pathname === '/')) {
            return NextResponse.redirect(new URL('/portal/login', request.url))
        }

        return response
    } catch (err) {
        console.error('[Middleware] Unexpected error:', err)
        // 发生错误时的处理
        if (isPublicPage) {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/portal/login', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/wdgl/:path*',
        '/portal/:path*',
        '/login',
    ],
}
