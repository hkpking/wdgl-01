import { useEffect } from 'react';

/**
 * Hook to handle global keyboard shortcuts
 * @param {Object} handlers - Map of action names to handler functions
 * @param {Function} handlers.onSave - Handler for Save (Ctrl+S)
 * @param {Function} handlers.onPrint - Handler for Print (Ctrl+P)
 * @param {Function} handlers.onHistory - Handler for Version History (Ctrl+Alt+Shift+H)
 */
export function useKeyboardShortcuts(handlers) {
    const { onSave, onPrint, onHistory, onWordCount, onClearFormat } = handlers;
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check for Modifier keys (Ctrl or Command)
            const isMod = e.ctrlKey || e.metaKey;

            // Save: Ctrl+S
            if (isMod && e.key === 's') {
                e.preventDefault();
                if (onSave) {
                    console.log('[Shortcut] Save triggered');
                    onSave();
                }
            }

            // Print: Ctrl+P
            if (isMod && e.key === 'p') {
                e.preventDefault();
                if (onPrint) {
                    console.log('[Shortcut] Print triggered');
                    onPrint();
                }
            }

            // Version History: Ctrl+Alt+Shift+H
            if (isMod && e.altKey && e.shiftKey && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                if (onHistory) {
                    console.log('[Shortcut] Version History triggered');
                    onHistory();
                }
            }

            // Word Count: Ctrl+Shift+C
            if (isMod && e.shiftKey && e.key.toLowerCase() === 'c') {
                // Note: Ctrl+Shift+C is also Inspect Element in some browsers (dev tools), 
                // but usually only when dev tools are open or if not prevented.
                // Google Docs uses this.
                e.preventDefault();
                if (onWordCount) {
                    console.log('[Shortcut] Word Count triggered');
                    onWordCount();
                }
            }

            // Clear Formatting: Ctrl+\
            if (isMod && e.key === '\\') {
                e.preventDefault();
                if (handlers.onClearFormat) {
                    console.log('[Shortcut] Clear Format triggered');
                    handlers.onClearFormat();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSave, onPrint, onHistory, onWordCount]);
}
