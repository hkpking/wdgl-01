import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer, CheckCircle, XCircle, Send, Archive, Calendar, AlertTriangle } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { getTextContent, isPlainText, plainTextToHtml } from '../utils/editor';
import * as mockStorage from '../services/mockStorage';
import { DOC_STATUS, STATUS_LABELS, STATUS_COLORS, LIFECYCLE_STEPS } from '../utils/constants';

export default function ProcessViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Use useMemo to ensure currentUser reference is stable across renders
    const currentUser = React.useMemo(() => mockStorage.getCurrentUser(), []);

    const [doc, setDoc] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const loadDoc = React.useCallback(() => {
        if (!currentUser) return;
        const document = mockStorage.getDocument(currentUser.uid, id);
        if (document) {
            setDoc(document);
            let loadedContent = document.content || '';
            if (isPlainText(loadedContent)) {
                loadedContent = plainTextToHtml(loadedContent);
            }
            setContent(loadedContent);
        } else {
            navigate('/');
        }
        setLoading(false);
    }, [currentUser, id, navigate]);

    useEffect(() => {
        if (!id || !currentUser) return;
        loadDoc();
    }, [id, currentUser, loadDoc]);

    const handleStatusChange = (newStatus) => {
        if (!doc || !currentUser) return;

        let updates = {
            status: newStatus,
            updatedAt: new Date().toISOString()
        };

        // ServiceNow Best Practice: Set Validity Period on Publish
        if (newStatus === DOC_STATUS.PUBLISHED) {
            // Default to 1 year from now
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            const defaultDate = nextYear.toISOString().split('T')[0];

            const validTo = window.prompt("请确认该制度的有效期至 (YYYY-MM-DD):", defaultDate);
            if (validTo === null) return; // Cancelled

            updates.validTo = validTo;
            updates.publishedAt = new Date().toISOString();
        }

        if (newStatus === DOC_STATUS.ARCHIVED) {
            if (!window.confirm("确定要废止该制度吗？废止后将存档且不再生效。")) return;
        } else if (newStatus !== DOC_STATUS.PUBLISHED) {
            // For other transitions (like Reject), just confirm
            if (!window.confirm(`确定要将状态变更为"${STATUS_LABELS[newStatus]}"吗?`)) return;
        }

        mockStorage.saveDocument(currentUser.uid, doc.id, {
            ...doc,
            ...updates
        });
        loadDoc();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
    }

    if (!doc) return null;

    // Calculate current step index
    const currentStepIndex = LIFECYCLE_STEPS.findIndex(step => step.id === doc.status);

    // Check expiration
    const isExpired = doc.validTo && new Date(doc.validTo) < new Date();
    const isExpiringSoon = doc.validTo && !isExpired && new Date(doc.validTo) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10 print:hidden">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">{doc.title || '无标题文档'}</h1>
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[doc.status] || 'bg-gray-200'}`}>
                            {STATUS_LABELS[doc.status] || doc.status}
                        </span>

                        {/* Validity Badge */}
                        {doc.status === DOC_STATUS.PUBLISHED && doc.validTo && (
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${isExpired ? 'bg-red-50 text-red-600 border-red-200' :
                                isExpiringSoon ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                    'bg-green-50 text-green-600 border-green-200'
                                }`}>
                                <Calendar size={12} />
                                <span>有效期至: {doc.validTo}</span>
                                {isExpired && <span className="font-bold">(已过期)</span>}
                                {isExpiringSoon && <span className="font-bold">(即将过期)</span>}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.print()}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                            title="打印"
                        >
                            <Printer size={20} />
                        </button>

                        {/* Workflow Actions */}
                        {doc.status === DOC_STATUS.DRAFT && (
                            <button
                                onClick={() => handleStatusChange(DOC_STATUS.REVIEW)}
                                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                <Send size={18} />
                                提交审核
                            </button>
                        )}

                        {doc.status === DOC_STATUS.REVIEW && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusChange(DOC_STATUS.DRAFT)}
                                    className="flex items-center gap-2 bg-red-100 text-red-700 py-2 px-4 rounded-lg font-semibold hover:bg-red-200 transition"
                                >
                                    <XCircle size={18} />
                                    驳回
                                </button>
                                <button
                                    onClick={() => handleStatusChange(DOC_STATUS.PUBLISHED)}
                                    className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    <CheckCircle size={18} />
                                    批准发布
                                </button>
                            </div>
                        )}

                        {doc.status === DOC_STATUS.PUBLISHED && (
                            <button
                                onClick={() => handleStatusChange(DOC_STATUS.ARCHIVED)}
                                className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition"
                            >
                                <Archive size={18} />
                                废止
                            </button>
                        )}

                        {/* Edit button only visible for Draft or if we allow editing published docs (revision) */}
                        {(doc.status === DOC_STATUS.DRAFT || doc.status === DOC_STATUS.REVIEW) && (
                            <button
                                onClick={() => navigate(`/editor/${id}`)}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                <Edit size={18} />
                                编辑
                            </button>
                        )}
                    </div>
                </div>

                {/* Lifecycle Stepper */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between relative">
                        {/* Progress Bar Background */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>

                        {/* Active Progress Bar */}
                        <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-500"
                            style={{ width: `${(currentStepIndex / (LIFECYCLE_STEPS.length - 1)) * 100}%` }}
                        ></div>

                        {LIFECYCLE_STEPS.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle size={16} /> : <span>{index + 1}</span>}
                                    </div>
                                    <span className={`text-xs mt-1 font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expiration Alert Banner */}
                {isExpired && (
                    <div className="max-w-4xl mx-auto mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-red-700">
                        <AlertTriangle size={20} />
                        <span className="font-medium">该制度已过期，请立即进行复审或废止。</span>
                    </div>
                )}
            </header>

            {/* Content Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-8 print:p-0">
                <div className="bg-white shadow-sm rounded-lg p-8 min-h-[calc(100vh-8rem)] print:shadow-none">
                    <RichTextEditor
                        content={content}
                        editable={false}
                        onChange={() => { }}
                    />
                </div>
            </main>
        </div>
    );
}
