import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { aiService } from '../services/ai/AIService';

export const GhostText = Extension.create({
    name: 'ghostText',

    addOptions() {
        return {
            debounce: 1000,
        };
    },

    addStorage() {
        return {
            text: '',
            pos: null,
            active: false,
            streaming: false, // New: to indicate if a stream is active
        };
    },

    addCommands() {
        return {
            triggerGhostText: () => ({ editor, view }) => {
                this.trigger(view, true); // true = manual trigger
                return true;
            },
            acceptGhostText: () => ({ editor, view }) => {
                const text = editor.storage.ghostText.text;
                if (text) {
                    editor.commands.insertContent(text);
                    view.dispatch(view.state.tr.setMeta('ghostText', { clear: true }));
                    editor.storage.ghostText.text = '';
                    return true;
                }
                return false;
            },
            acceptGhostTextWord: () => ({ editor, view }) => {
                const text = editor.storage.ghostText.text;
                if (!text) return false;

                // Find next word boundary
                // Simple regex: run of non-whitespace followed by whitespace, or just run of non-whitespace
                const match = text.match(/^(\s*\S+\s*)/);
                let word = '';

                if (match) {
                    word = match[0];
                } else {
                    // Fallback: just first char if regex fails (unlikely)
                    word = text[0];
                }

                if (word) {
                    editor.commands.insertContent(word);

                    const remaining = text.slice(word.length);
                    editor.storage.ghostText.text = remaining;

                    if (remaining.length === 0) {
                        view.dispatch(view.state.tr.setMeta('ghostText', { clear: true }));
                    } else {
                        // Update decoration with remaining text
                        // We need to update the pos as well because cursor moved
                        // Actually, insertContent will move cursor.
                        // We need to re-add the decoration at the new position.
                        // Since `insertContent` happens, the doc changes.
                        // Our `apply` logic clears on change unless we handle it.

                        // Let's use a special meta to "update" instead of clear.
                        view.dispatch(view.state.tr.setMeta('ghostText', {
                            add: true,
                            text: remaining,
                            pos: view.state.selection.to + word.length // Predicted pos?
                        }));
                    }
                    return true;
                }
                return false;
            }
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-Space': () => this.editor.commands.triggerGhostText(),
            'Alt-\\': () => this.editor.commands.triggerGhostText(),
            'Tab': () => this.editor.commands.acceptGhostText(),
            'Control-ArrowRight': () => this.editor.commands.acceptGhostTextWord(),
            'Cmd-ArrowRight': () => this.editor.commands.acceptGhostTextWord(),
            'Alt-ArrowRight': () => this.editor.commands.acceptGhostTextWord(),
        };
    },

    addProseMirrorPlugins() {
        const { editor } = this;
        let debounceTimer = null;
        let streamController = null; // To abort previous streams

        const trigger = (view, manual = false) => {
            const { state } = view;
            const { selection } = state;

            if (!selection.empty) return;

            // Smart Filter for Auto-Trigger
            if (!manual) {
                // Don't trigger if typing in middle of word
                const charBefore = state.doc.textBetween(selection.from - 1, selection.from);
                const charAfter = state.doc.textBetween(selection.from, selection.from + 1);

                // If char after is a word character, we are likely editing mid-word
                if (charAfter && /\w/.test(charAfter)) return;

                // If char before is empty (start of doc) or space/newline, good.
                // If char before is a word char, good (end of word).
            }

            // Abort previous stream if active
            if (streamController) {
                streamController.abort();
                streamController = null;
            }

            // Show loading
            view.dispatch(view.state.tr.setMeta('ghostText', {
                loading: true,
                pos: selection.to
            }));

            const parent = selection.$from.parent;
            const textBefore = parent.textContent.slice(0, selection.$from.parentOffset);
            const start = Math.max(0, selection.from - 500);
            const context = state.doc.textBetween(start, selection.from, '\n', ' ');

            // Reset storage
            editor.storage.ghostText.text = '';
            editor.storage.ghostText.pos = selection.to;
            editor.storage.ghostText.streaming = true;

            let accumulatedText = '';
            streamController = new AbortController();

            aiService.streamCompletion(textBefore, context, (chunk) => {
                if (!view.hasFocus()) return;

                // Check if user moved cursor (abort)
                if (view.state.selection.to !== editor.storage.ghostText.pos) {
                    if (streamController) {
                        streamController.abort();
                    }
                    return;
                }

                accumulatedText += chunk;
                editor.storage.ghostText.text = accumulatedText;

                view.dispatch(view.state.tr.setMeta('ghostText', {
                    add: true,
                    pos: selection.to,
                    text: accumulatedText,
                    streaming: true
                }));
            }).then(() => {
                editor.storage.ghostText.streaming = false;
                streamController = null;
                if (!accumulatedText) {
                    view.dispatch(view.state.tr.setMeta('ghostText', { clear: true }));
                }
            }).catch(err => {
                if (err.name !== 'AbortError') {
                    console.error("AI Stream Error:", err);
                }
                editor.storage.ghostText.streaming = false;
                streamController = null;
                // Don't clear here if aborted, as the abort might be due to accept
            });
        };

        // Expose trigger to commands
        this.trigger = trigger;

        return [
            new Plugin({
                key: new PluginKey('ghostText'),
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(tr, set) {
                        set = set.map(tr.mapping, tr.doc);
                        const action = tr.getMeta('ghostText');

                        if (action) {
                            if (action.clear) return DecorationSet.empty;

                            if (action.loading) {
                                const widget = Decoration.widget(action.pos, () => {
                                    const span = document.createElement('span');
                                    span.className = 'text-gray-400 pointer-events-none select-none animate-pulse';
                                    span.textContent = '...';
                                    return span;
                                }, { side: 1 });
                                return DecorationSet.create(tr.doc, [widget]);
                            }

                            if (action.add) {
                                const widget = Decoration.widget(action.pos, () => {
                                    const span = document.createElement('span');
                                    span.className = 'text-slate-400 pointer-events-none select-none italic';
                                    span.dataset.ghost = 'true';
                                    span.textContent = action.text;
                                    return span;
                                }, { side: 1 });
                                return DecorationSet.create(tr.doc, [widget]);
                            }
                        }

                        // Prefix Matching & Typing Handling
                        if (tr.docChanged) {
                            const decorations = set.find();
                            if (decorations.length > 0) {
                                const ghostText = editor.storage.ghostText.text;
                                if (!ghostText) return DecorationSet.empty;

                                let keep = false;
                                let newText = '';

                                tr.steps.forEach(step => {
                                    if (step.slice) {
                                        const inserted = step.slice.content.textBetween(0, step.slice.content.size);
                                        if (ghostText.startsWith(inserted)) {
                                            keep = true;
                                            newText = ghostText.slice(inserted.length);
                                        }
                                    }
                                });

                                if (keep) {
                                    editor.storage.ghostText.text = newText;
                                    editor.storage.ghostText.pos = tr.selection.to;

                                    if (newText.length === 0) return DecorationSet.empty;

                                    const widget = Decoration.widget(tr.selection.to, () => {
                                        const span = document.createElement('span');
                                        span.className = 'text-slate-400 pointer-events-none select-none italic';
                                        span.dataset.ghost = 'true';
                                        span.textContent = newText;
                                        return span;
                                    }, { side: 1 });
                                    return DecorationSet.create(tr.doc, [widget]);
                                } else {
                                    // If user types something that doesn't match the ghost text, clear it.
                                    // Also clear if a stream is active, as typing should cancel it.
                                    if (editor.storage.ghostText.streaming && streamController) {
                                        streamController.abort();
                                        streamController = null;
                                        editor.storage.ghostText.streaming = false;
                                    }
                                    editor.storage.ghostText.text = '';
                                    return DecorationSet.empty;
                                }
                            }
                            // If doc changed but no decorations were present, ensure no ghost text is left.
                            editor.storage.ghostText.text = '';
                            return DecorationSet.empty;
                        }
                        return set;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                    handleKeyDown(view, event) {
                        if (event.key === 'Escape') {
                            // Clear both loading and ghost text
                            editor.view.dispatch(editor.state.tr.setMeta('ghostText', { clear: true }));
                            editor.storage.ghostText.text = '';
                            if (streamController) {
                                streamController.abort();
                                streamController = null;
                                editor.storage.ghostText.streaming = false;
                            }
                            return true;
                        }
                        return false;
                    }
                },
                view(view) {
                    return {
                        update: (view, prevState) => {
                            const { state } = view;
                            const { selection } = state;

                            // Aggressive Cancellation on Selection Change
                            if (!prevState.selection.eq(selection)) {
                                const ghostPos = editor.storage.ghostText.pos;
                                if (ghostPos !== null && selection.to !== ghostPos) {
                                    // Cursor moved away from ghost text anchor
                                    if (editor.storage.ghostText.text || editor.storage.ghostText.streaming) {
                                        view.dispatch(view.state.tr.setMeta('ghostText', { clear: true }));
                                        editor.storage.ghostText.text = '';
                                        editor.storage.ghostText.pos = null;

                                        if (streamController) {
                                            streamController.abort();
                                            streamController = null;
                                            editor.storage.ghostText.streaming = false;
                                        }
                                    }
                                }
                            }

                            if (!selection.empty) return;
                            if (view.composing) return; // Don't trigger while composing (e.g., IME input)

                            // Don't auto-trigger if a stream is already active or ghost text is present
                            if (editor.storage.ghostText.streaming || editor.storage.ghostText.text) {
                                if (debounceTimer) clearTimeout(debounceTimer);
                                return;
                            }

                            // Debounce Auto-Trigger
                            if (debounceTimer) clearTimeout(debounceTimer);

                            debounceTimer = setTimeout(() => {
                                if (view.hasFocus()) {
                                    trigger(view, false); // false = auto trigger
                                }
                            }, 750); // Adjust debounce time as needed
                        }
                    };
                },
            }),
        ];
    },
});
