import React from 'react';
import Image from 'next/image';

export default function LctmrLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative text-white font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://vip.123pan.cn/1812596934/ymjew503t0n000d7w32y6qda6xz9e97hDIYPDqJ2AqrwAcxvAqa2AF==.jpg"
                    alt="LCTMR Background"
                    fill
                    className="object-cover pointer-events-none"
                    priority
                />
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 min-h-screen flex flex-col">
                {/* Navigation / Header could go here */}
                <header className="p-6 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
                            L
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 tracking-wider">
                            流程天命人
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Profile placeholder */}
                        <div className="text-sm text-cyan-100/80">
                            Hi, 流程行者
                        </div>
                    </div>
                </header>

                <div className="flex-1 container mx-auto p-6 md:p-12">
                    {children}
                </div>

                <footer className="p-4 text-center text-white/30 text-xs">
                    © 2025 流程天命人 · LCTMR Legacy (Refactored)
                </footer>
            </main>
        </div>
    );
}
