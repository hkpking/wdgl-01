import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Loader, Command, Settings, Key, Wand2, Languages, CheckCheck, FileText, GripHorizontal } from 'lucide-react';
import { aiService } from '../../services/ai/AIService';
import { PromptRegistry } from '../../services/ai/PromptRegistry';

const MagicCommand = ({ isOpen, onClose, onInsert, editor }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    // Selection State
    const [selectionText, setSelectionText] = useState('');
    const [hasSelection, setHasSelection] = useState(false);

    // Drag State
    const [position, setPosition] = useState({ x: 0, y: 100 }); // Initial offset from top-center
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const modalRef = useRef(null);

    const inputRef = useRef(null);



    useEffect(() => {
        if (isOpen) {
            // Check for selection
            if (editor) {
                const { from, to, empty } = editor.state.selection;
                if (!empty) {
                    const text = editor.state.doc.textBetween(from, to, ' ');
                    if (text.trim().length > 0) {
                        setSelectionText(text);
                        setHasSelection(true);
                    } else {
                        setHasSelection(false);
                        setSelectionText('');
                    }
                } else {
                    setHasSelection(false);
                    setSelectionText('');
                }
            }

            if (inputRef.current) {
                inputRef.current.focus();
            }
            setInput('');
            setResult('');
            // Reset position on open? Or keep last position? 
            // Let's keep it centered initially or last position if we want persistence.
            // For now, reset to default if closed.
            // setPosition({ x: 0, y: 100 }); 
        }
    }, [isOpen, editor]);

    // Drag Handlers
    const handleMouseDown = (e) => {
        if (e.target.closest('button') || e.target.closest('input')) return; // Don't drag if clicking controls
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    const handleKeyDown = async (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!input.trim()) return;
            await executeCommand(input);
        }
    };

    const executeCommand = async (commandText, promptTemplate = null) => {
        setIsLoading(true);
        setResult('');
        try {
            let prompt = commandText;

            // 1. Use Template if provided (Quick Actions)
            if (promptTemplate) {
                prompt = promptTemplate(selectionText || commandText);
            }
            // 2. Heuristics for typed commands
            else {
                const lowerInput = commandText.toLowerCase();
                if (hasSelection) {
                    // If selection exists, treat input as instruction for selection
                    prompt = PromptRegistry.CONTEXTUAL_INSTRUCTION(selectionText, commandText);
                } else {
                    // No selection, generation mode
                    if (lowerInput.includes('outline') || lowerInput.includes('大纲')) {
                        prompt = PromptRegistry.GENERATE_OUTLINE(commandText);
                    } else if (lowerInput.includes('flowchart') || lowerInput.includes('流程图')) {
                        prompt = PromptRegistry.GENERATE_MERMAID(commandText);
                    } else if (lowerInput.includes('table') || lowerInput.includes('表格')) {
                        prompt = PromptRegistry.GENERATE_TABLE(commandText);
                    }
                }
            }

            // Stream response
            await aiService.streamText(prompt, (chunk) => {
                setResult(prev => prev + chunk);
            });
        } catch (error) {
            console.error(error);
            setResult(`Error: ${error.message || 'Failed to generate content'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (actionType) => {
        if (!hasSelection) return;

        switch (actionType) {
            case 'polish':
                executeCommand('', PromptRegistry.POLISH);
                break;
            case 'grammar':
                executeCommand('', PromptRegistry.FIX_GRAMMAR);
                break;
            case 'translate':
                executeCommand('', (text) => PromptRegistry.TRANSLATE(text, 'English')); // Default to English for now
                break;
            case 'summarize':
                executeCommand('', PromptRegistry.SUMMARIZE);
                break;
            default:
                break;
        }
    };

    const handleInsert = () => {
        // Check for structured content (Mermaid/Table)
        if (result.includes('```mermaid')) {
            // Extract mermaid code
            const match = result.match(/```mermaid([\s\S]*?)```/);
            if (match && match[1]) {
                // Insert Mermaid Node
                if (editor) {
                    editor.chain().focus().insertContent({
                        type: 'mermaid',
                        attrs: { code: match[1].trim() }
                    }).run();
                }
            } else {
                onInsert(result);
            }
        } else {
            onInsert(result);
        }
        onClose();
    };



    if (!isOpen) return null;

    return (
        // Overlay - transparent and non-blocking for clicks outside if we want, 
        // but standard modal UX usually blocks. 
        // User asked to move it because it blocks content. 
        // Let's make the overlay transparent but still catch clicks to close?
        // Or better: Remove backdrop-blur and allow seeing through.
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 pointer-events-none">
            {/* Backdrop click handler - invisible layer */}
            <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

            <div
                ref={modalRef}
                className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Drag Handle & Header */}
                <div
                    className="h-6 bg-gray-50 border-b border-gray-100 flex items-center justify-center cursor-move hover:bg-gray-100 transition-colors"
                    onMouseDown={handleMouseDown}
                >
                    <GripHorizontal size={16} className="text-gray-300" />
                </div>

                {/* Input Area */}
                <div className="flex flex-col border-b border-gray-100">
                    {hasSelection && (
                        <div className="px-4 py-2 bg-blue-50 text-xs text-blue-700 border-b border-blue-100 flex items-center gap-2">
                            <FileText size={12} />
                            <span className="font-medium">Selected Context:</span>
                            <span className="truncate max-w-md opacity-75">"{selectionText}"</span>
                        </div>
                    )}

                    <div className="flex items-center p-4">
                        <Sparkles className="text-purple-500 mr-3 animate-pulse" size={24} />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 text-lg outline-none placeholder:text-gray-400"
                            placeholder={hasSelection ? "Ask AI to edit, rewrite, or translate selection..." : "Ask AI to write, summarize, or outline..."}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        {isLoading ? (
                            <Loader className="animate-spin text-gray-400" size={20} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-200 font-mono">
                                    ↵ Enter
                                </kbd>
                            </div>
                        )}
                        <button
                            className="ml-3 text-gray-300 cursor-not-allowed transition"
                            title="Settings moved to global settings"
                        >
                            <Settings size={18} />
                        </button>
                    </div>

                    {/* Quick Actions (Only when selection exists and no input yet) */}
                    {hasSelection && !input && !result && !isLoading && (
                        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                            <button onClick={() => handleQuickAction('polish')} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition border border-purple-100">
                                <Wand2 size={14} /> 润色
                            </button>
                            <button onClick={() => handleQuickAction('grammar')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition border border-green-100">
                                <CheckCheck size={14} /> 纠错
                            </button>
                            <button onClick={() => handleQuickAction('translate')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition border border-blue-100">
                                <Languages size={14} /> 翻译
                            </button>
                            <button onClick={() => handleQuickAction('summarize')} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm hover:bg-orange-100 transition border border-orange-100">
                                <FileText size={14} /> 总结
                            </button>
                        </div>
                    )}
                </div>



                {/* Result Area */}
                {result && (
                    <div className="p-4 bg-gray-50 max-h-[60vh] overflow-y-auto">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {result}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setResult('')}
                                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleInsert}
                                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center gap-1"
                            >
                                {hasSelection ? 'Replace Selection' : 'Insert'} <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Suggestions / Empty State */}
                {!result && !isLoading && !hasSelection && (
                    <div className="p-2 bg-gray-50 text-xs text-gray-500 flex justify-between px-4">
                        <span>Try: "Create an outline", "Generate flowchart", "Make a table"</span>
                        <span className="flex items-center gap-1"><Command size={10} /> + K to open</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MagicCommand;
