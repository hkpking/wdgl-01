/**
 * 查找替换扩展
 * 基于 Prosemirror 实现查找高亮和替换功能
 */
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const SearchReplacePluginKey = new PluginKey('searchReplace');

export const SearchReplaceExtension = Extension.create({
    name: 'searchReplace',

    addOptions() {
        return {
            searchResultClass: 'search-result',
            currentResultClass: 'search-result-current',
        };
    },

    addStorage() {
        return {
            searchTerm: '',
            replaceTerm: '',
            results: [],
            currentIndex: 0,
            caseSensitive: false,
        };
    },

    addCommands() {
        return {
            setSearchTerm: (searchTerm) => ({ editor }) => {
                editor.storage.searchReplace.searchTerm = searchTerm;
                editor.storage.searchReplace.currentIndex = 0;
                return true;
            },

            setReplaceTerm: (replaceTerm) => ({ editor }) => {
                editor.storage.searchReplace.replaceTerm = replaceTerm;
                return true;
            },

            setCaseSensitive: (caseSensitive) => ({ editor }) => {
                editor.storage.searchReplace.caseSensitive = caseSensitive;
                return true;
            },

            nextSearchResult: () => ({ editor }) => {
                const { results, currentIndex } = editor.storage.searchReplace;
                if (results.length === 0) return false;

                const newIndex = (currentIndex + 1) % results.length;
                editor.storage.searchReplace.currentIndex = newIndex;

                // 滚动到当前结果
                const result = results[newIndex];
                if (result) {
                    editor.commands.setTextSelection(result.from);
                    // 触发视图更新
                    editor.view.dispatch(editor.state.tr);
                }
                return true;
            },

            previousSearchResult: () => ({ editor }) => {
                const { results, currentIndex } = editor.storage.searchReplace;
                if (results.length === 0) return false;

                const newIndex = (currentIndex - 1 + results.length) % results.length;
                editor.storage.searchReplace.currentIndex = newIndex;

                const result = results[newIndex];
                if (result) {
                    editor.commands.setTextSelection(result.from);
                    editor.view.dispatch(editor.state.tr);
                }
                return true;
            },

            replaceCurrentResult: () => ({ editor, tr }) => {
                const { results, currentIndex, replaceTerm } = editor.storage.searchReplace;
                if (results.length === 0) return false;

                const result = results[currentIndex];
                if (!result) return false;

                tr.insertText(replaceTerm, result.from, result.to);
                return true;
            },

            replaceAllResults: () => ({ editor, tr }) => {
                const { results, replaceTerm } = editor.storage.searchReplace;
                if (results.length === 0) return false;

                // 从后往前替换，避免位置偏移
                const sortedResults = [...results].sort((a, b) => b.from - a.from);
                sortedResults.forEach(result => {
                    tr.insertText(replaceTerm, result.from, result.to);
                });

                editor.storage.searchReplace.results = [];
                editor.storage.searchReplace.currentIndex = 0;
                return true;
            },

            clearSearch: () => ({ editor }) => {
                editor.storage.searchReplace.searchTerm = '';
                editor.storage.searchReplace.replaceTerm = '';
                editor.storage.searchReplace.results = [];
                editor.storage.searchReplace.currentIndex = 0;
                return true;
            },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-f': () => {
                // 触发外部搜索框打开
                if (this.options.onOpenSearch) {
                    this.options.onOpenSearch();
                }
                return true;
            },
            'Mod-h': () => {
                // 触发外部替换框打开
                if (this.options.onOpenReplace) {
                    this.options.onOpenReplace();
                }
                return true;
            },
            'Escape': () => {
                this.editor.commands.clearSearch();
                if (this.options.onCloseSearch) {
                    this.options.onCloseSearch();
                }
                return true;
            },
        };
    },

    addProseMirrorPlugins() {
        const editor = this.editor;
        const options = this.options;

        return [
            new Plugin({
                key: SearchReplacePluginKey,
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(tr, oldState) {
                        const { searchTerm, caseSensitive, currentIndex } = editor.storage.searchReplace;

                        if (!searchTerm) {
                            editor.storage.searchReplace.results = [];
                            return DecorationSet.empty;
                        }

                        const decorations = [];
                        const results = [];
                        const doc = tr.doc;

                        doc.descendants((node, pos) => {
                            if (!node.isText) return;

                            const text = node.text;
                            const searchText = caseSensitive ? searchTerm : searchTerm.toLowerCase();
                            const nodeText = caseSensitive ? text : text.toLowerCase();

                            let index = 0;
                            while ((index = nodeText.indexOf(searchText, index)) !== -1) {
                                const from = pos + index;
                                const to = from + searchTerm.length;

                                results.push({ from, to });
                                index += searchTerm.length;
                            }
                        });

                        editor.storage.searchReplace.results = results;

                        results.forEach((result, idx) => {
                            const className = idx === currentIndex
                                ? `${options.searchResultClass} ${options.currentResultClass}`
                                : options.searchResultClass;

                            decorations.push(
                                Decoration.inline(result.from, result.to, {
                                    class: className,
                                })
                            );
                        });

                        return DecorationSet.create(doc, decorations);
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
        ];
    },
});

export default SearchReplaceExtension;
