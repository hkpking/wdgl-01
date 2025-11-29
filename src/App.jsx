import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StorageProvider } from './contexts/StorageContext';

import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Editor = lazy(() => import('./pages/Editor'));
const ProcessViewer = lazy(() => import('./pages/ProcessViewer'));

function App() {
    return (
        <StorageProvider>
            <ErrorBoundary>
                <Router>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                        <Routes>
                            {/* Mock 模式下直接访问,不需要登录 */}
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/editor/:id" element={<Editor />} />
                            <Route path="/view/:id" element={<ProcessViewer />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </Router>
            </ErrorBoundary>
        </StorageProvider>
    );
}

export default App;
