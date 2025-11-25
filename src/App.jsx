import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Mock 模式下暂时不使用认证
// import { AuthProvider } from './contexts/AuthContext';
// import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ProcessViewer from './pages/ProcessViewer';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Mock 模式下直接访问,不需要登录 */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/editor/:id" element={<Editor />} />
                <Route path="/view/:id" element={<ProcessViewer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
