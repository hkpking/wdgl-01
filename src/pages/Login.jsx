import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../contexts/StorageContext';
import { Mail, Lock, User, LogIn, UserPlus, Loader2 } from 'lucide-react';

/**
 * 统一登录/注册页面
 * 所有用户都通过 Supabase 认证登录
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const navigate = useNavigate();

    const storage = useStorage();

    // 如果已登录，直接跳转到 Dashboard
    useEffect(() => {
        if (!storage.loading && storage.currentUser) {
            navigate('/');
        }
    }, [storage.loading, storage.currentUser, navigate]);

    // 处理登录
    async function handleLogin(e) {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('请填写邮箱和密码');
            return;
        }

        setLoading(true);
        try {
            await storage.signIn(email, password);
            navigate('/');
        } catch (err) {
            console.error('登录失败:', err);
            setError(getErrorMessage(err));
        }
        setLoading(false);
    }

    // 处理注册
    async function handleRegister(e) {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('请填写邮箱和密码');
            return;
        }

        if (password.length < 6) {
            setError('密码至少需要 6 个字符');
            return;
        }

        setLoading(true);
        try {
            await storage.signUp(email, password, displayName || email.split('@')[0]);
            // 提示用户检查邮箱验证（如果启用了邮箱验证）
            setError('');
            // 尝试自动登录
            try {
                await storage.signIn(email, password);
                navigate('/');
            } catch {
                // 如果需要邮箱验证，显示提示
                setError('注册成功！请检查邮箱完成验证后登录。');
                setIsRegisterMode(false);
            }
        } catch (err) {
            console.error('注册失败:', err);
            setError(getErrorMessage(err));
        }
        setLoading(false);
    }

    // 错误信息转换
    function getErrorMessage(err) {
        const message = err.message || '';
        if (message.includes('Invalid login credentials')) {
            return '邮箱或密码错误';
        }
        if (message.includes('Email not confirmed')) {
            return '邮箱未验证，请检查您的邮箱';
        }
        if (message.includes('User already registered')) {
            return '该邮箱已被注册';
        }
        if (message.includes('Password should be')) {
            return '密码至少需要 6 个字符';
        }
        return err.message || '操作失败，请稍后重试';
    }

    // 显示加载状态
    if (storage.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">W</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">制度管理系统</h1>
                    <p className="text-gray-500 mt-2">
                        {isRegisterMode ? '创建新账号' : '登录您的账号'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${error.includes('成功')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
                    {/* Display Name (Register only) */}
                    {isRegisterMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                显示名称
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="您的名称（可选）"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            邮箱
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            密码
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="至少 6 个字符"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${isRegisterMode
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isRegisterMode ? (
                            <>
                                <UserPlus className="w-5 h-5" />
                                注册
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                登录
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegisterMode(!isRegisterMode);
                            setError('');
                        }}
                        className="text-sm text-gray-500 hover:text-blue-600 transition"
                    >
                        {isRegisterMode ? '已有账号？返回登录' : '没有账号？立即注册'}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        ☁️ 数据安全存储在云端，支持多设备同步
                    </p>
                </div>
            </div>
        </div>
    );
}
