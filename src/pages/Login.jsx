import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('登录失败: ' + err.message);
        }
        setLoading(false);
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('注册失败: ' + err.message);
        }
        setLoading(false);
    }

    async function handleAnonymousLogin() {
        setError('');
        setLoading(true);
        try {
            await signInAnonymously(auth);
            navigate('/');
        } catch (err) {
            setError('匿名登录失败: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">欢迎登录</h2>
                <p className="text-center text-gray-500 mt-2">请输入您的凭据</p>

                {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

                <form className="mt-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">邮箱</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">密码</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                        >
                            登录
                        </button>
                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-white border border-blue-200 text-blue-700 py-2 px-4 rounded-md font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                        >
                            注册新账号
                        </button>
                        <button
                            type="button"
                            onClick={handleAnonymousLogin}
                            disabled={loading}
                            className="w-full text-gray-500 text-sm hover:text-gray-700"
                        >
                            暂不注册，匿名试用 &rarr;
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
