/**
 * Supabase Server-Side Client
 * 用于 Middleware 和 Server Components 的 Supabase 客户端
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Supabase 配置
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw'

/**
 * 创建用于 Middleware 的 Supabase 客户端
 * 处理 cookie 的读写操作
 */
export function createMiddlewareClient(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
                // 设置 cookie 到 request 和 response
                request.cookies.set({
                    name,
                    value,
                    ...options,
                })
                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                })
                response.cookies.set({
                    name,
                    value,
                    ...options,
                })
            },
            remove(name: string, options: CookieOptions) {
                request.cookies.set({
                    name,
                    value: '',
                    ...options,
                })
                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                })
                response.cookies.set({
                    name,
                    value: '',
                    ...options,
                })
            },
        },
    })

    return { supabase, response }
}
