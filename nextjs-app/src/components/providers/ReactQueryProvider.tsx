"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // 使用 useState 确保每个请求获得独立的 QueryClient (SSR 安全)
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // 窗口聚焦时自动重新获取数据
                        refetchOnWindowFocus: true,
                        // 避免过于频繁的重试
                        retry: 1,
                        // 数据在 5 分钟内被认为是新鲜的
                        staleTime: 5 * 60 * 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
