import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StorageProvider, useStorage } from './contexts/StorageContext';

import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/shared/OfflineIndicator';
import PWAUpdatePrompt from './components/shared/PWAUpdatePrompt';

// Lazy load components for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Editor = lazy(() => import('./pages/Editor'));
const ProcessViewer = lazy(() => import('./pages/ProcessViewer'));
const DrawIOEditor = lazy(() => import('./components/DrawIO/DrawIOEditor'));
const Login = lazy(() => import('./pages/Login'));

// 路由保护组件
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useStorage();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// 登录页路由（已登录则跳转首页）
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useStorage();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            {/* 公开路由 */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* 受保护路由 */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/editor/:id"
                element={
                    <ProtectedRoute>
                        <Editor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/view/:id"
                element={
                    <ProtectedRoute>
                        <ProcessViewer />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/drawio"
                element={
                    <ProtectedRoute>
                        <DrawIOEditor />
                    </ProtectedRoute>
                }
            />

            {/* 未匹配路由 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <StorageProvider>
            <ErrorBoundary>
                <Router>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                        <AppRoutes />
                    </Suspense>
                </Router>
                {/* PWA 组件 */}
                <OfflineIndicator />
                <PWAUpdatePrompt />
            </ErrorBoundary>
        </StorageProvider>
    );
}

export default App;

