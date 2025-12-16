"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 首页重定向组件
 * 
 * 实际的认证逻辑由 middleware.ts 处理：
 * - 未登录用户 -> /login
 * - 已登录用户 -> /dashboard
 * 
 * 这个页面只是一个后备方案，正常情况下不会被渲染。
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 作为后备方案，如果 middleware 未生效，则手动重定向
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">正在跳转...</p>
      </div>
    </div>
  );
}

