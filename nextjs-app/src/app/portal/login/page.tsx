/**
 * 门户登录页面
 * 参考 Jeecg Boot 风格的企业级登录界面
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/contexts/StorageContext';
import { User, Lock, Loader2, Github, MessageCircle, Globe, ShieldCheck } from 'lucide-react';

// 模拟验证码组件（仅 UI）
function CaptchaCode() {
    return (
        <div className="h-10 w-24 bg-gray-100 flex items-center justify-center border border-gray-300 rounded cursor-pointer select-none text-lg font-mono font-bold text-gray-600 tracking-wider">
            Ae3K
        </div>
    );
}

export default function PortalLoginPage() {
    const [loginType, setLoginType] = useState<'account' | 'mobile'>('account');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 动画状态
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const { signIn, currentUser, loading } = useStorage() as any;

    useEffect(() => {
        setMounted(true);
        if (!loading && currentUser) {
            router.replace('/portal');
        }
    }, [currentUser, loading, router]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (loginType === 'mobile') {
            setError('手机登录暂未开放，请使用账号登录');
            return;
        }

        if (!email || !password) {
            setError('请输入账号和密码');
            return;
        }

        setSubmitting(true);
        try {
            await signIn(email, password);
            window.location.href = '/portal';
        } catch (err: any) {
            console.error('[Portal Login] 登录失败:', err);
            if (err.message?.includes('Invalid login credentials')) {
                setError('账号或密码错误');
            } else {
                setError(err.message || '登录失败，请重试');
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] relative overflow-hidden font-sans">
            {/* 背景装饰圆 */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e6f7ff] rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e6fffb] rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

            {/* 登录卡片容器 */}
            <div className={`w-[1000px] h-[600px] bg-white rounded-xl shadow-2xl flex overflow-hidden transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                {/* 左侧：品牌展示区 */}
                <div className="w-5/12 bg-gradient-to-br from-[#1890ff] to-[#096dd9] relative p-10 flex flex-col justify-between text-white overflow-hidden">
                    {/* 背景纹理 */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    {/* 分子结构装饰动画 */}
                    <div className="absolute top-20 right-[-50px] w-40 h-40 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute bottom-40 left-[-30px] w-20 h-20 border border-white/20 rounded-full animate-[spin_8s_linear_infinite]"></div>

                    {/* Logo */}
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1890ff] shadow-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-wide">统一门户平台</span>
                    </div>

                    {/* 中间 Slogan */}
                    <div className="relative z-10 my-auto">
                        <h2 className="text-3xl font-bold mb-6">WDGL Portal</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[2px] bg-white/60"></div>
                                <p className="text-sm font-light text-white/90">企业级文档协作平台</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[2px] bg-white/60"></div>
                                <p className="text-sm font-light text-white/90">标准化的制度学习系统</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[2px] bg-white/60"></div>
                                <p className="text-sm font-light text-white/90">高效的流程管理引擎</p>
                            </div>
                        </div>
                    </div>

                    {/* 底部版权 */}
                    <div className="relative z-10 text-xs text-white/60">
                        &copy; 2024 WDGL Unified Portal System
                    </div>
                </div>

                {/* 右侧：登录表单区 */}
                <div className="w-7/12 bg-white p-12 flex flex-col justify-center relative">
                    {/* 顶部标题 */}
                    <div className="absolute top-8 right-8 flex items-center gap-2 cursor-pointer text-gray-400 hover:text-[#1890ff] transition-colors">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">简体中文</span>
                    </div>

                    <div className="w-full max-w-sm mx-auto">
                        {/* Tab 切换 */}
                        <div className="flex mb-8 border-b border-gray-100">
                            <button
                                onClick={() => setLoginType('account')}
                                className={`pb-3 text-lg font-medium transition-all relative px-4 ${loginType === 'account' ? 'text-[#1890ff]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                账号登录
                                {loginType === 'account' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#1890ff]"></div>}
                            </button>
                            <button
                                onClick={() => setLoginType('mobile')}
                                className={`pb-3 text-lg font-medium transition-all relative px-4 ${loginType === 'mobile' ? 'text-[#1890ff]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                手机登录
                                {loginType === 'mobile' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#1890ff]"></div>}
                            </button>
                        </div>

                        {/* 错误提示 */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            {loginType === 'account' ? (
                                <>
                                    {/* 账号输入 */}
                                    <div className="group">
                                        <div className="relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1890ff] transition-colors pl-1">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="请输入账号 / 邮箱"
                                                className="w-full py-2.5 pl-9 pr-4 text-gray-700 border-b border-gray-300 focus:border-[#1890ff] focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* 密码输入 */}
                                    <div className="group">
                                        <div className="relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1890ff] transition-colors pl-1">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="请输入密码"
                                                className="w-full py-2.5 pl-9 pr-4 text-gray-700 border-b border-gray-300 focus:border-[#1890ff] focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* 验证码（模拟） */}
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1 group">
                                            <div className="relative">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1890ff] transition-colors pl-1">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="请输入验证码"
                                                    className="w-full py-2.5 pl-9 pr-4 text-gray-700 border-b border-gray-300 focus:border-[#1890ff] focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                                                />
                                            </div>
                                        </div>
                                        <CaptchaCode />
                                    </div>
                                </>
                            ) : (
                                <div className="py-10 text-center text-gray-500 text-sm bg-gray-50 rounded border border-dashed border-gray-300">
                                    手机验证码登录功能开发中...
                                </div>
                            )}

                            {/* 辅助功能 */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]" />
                                    自动登录
                                </label>
                                <a href="#" className="text-[#1890ff] hover:text-[#40a9ff] transition-colors">忘记密码？</a>
                            </div>

                            {/* 登录按钮 */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded font-medium shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '登 录'}
                            </button>
                        </form>

                        {/* 第三方登录 - 美化版 */}
                        <div className="mt-10">
                            <div className="relative flex justify-center text-xs text-gray-400 mb-6">
                                <span className="bg-white px-2 z-10">其他登录方式</span>
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-8">
                                <button className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all mb-2" title="GitHub">
                                    <Github className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-200 hover:bg-green-50 transition-all mb-2" title="WeChat">
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all mb-2" title="DingTalk">
                                    <Globe className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 页面底部装饰 */}
            <div className="absolute bottom-6 text-gray-400 text-xs font-light text-center w-full">
                Powered by WDGL Technology &copy; 2024
            </div>
        </div>
    );
}
