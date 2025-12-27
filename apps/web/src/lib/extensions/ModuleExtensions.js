import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import RiskNodeView from '../components/nodes/RiskNodeView';
import RuleNodeView from '../components/nodes/RuleNodeView';
import ProcessLinkNodeView from '../components/nodes/ProcessLinkNodeView';
import ProcessCardNodeView from '../components/nodes/ProcessCardNodeView';
import ArchitectureMatrixNodeView from '../components/nodes/ArchitectureMatrixNodeView';

export const RiskNode = Node.create({
    name: 'risk',
    group: 'block',
    content: 'inline*', // Allow text inside
    draggable: true,

    addAttributes() {
        return {
            level: {
                default: 'medium',
            },
        };
    },

    parseHTML() {
        return [
            { tag: 'div[data-type="risk"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'risk' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(RiskNodeView);
    },
});

export const RuleNode = Node.create({
    name: 'rule',
    group: 'block',
    content: 'inline*',
    draggable: true,

    parseHTML() {
        return [
            { tag: 'div[data-type="rule"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'rule' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(RuleNodeView);
    },
});

export const ProcessLinkNode = Node.create({
    name: 'processLink',
    group: 'block',
    atom: true, // No content, just the link
    draggable: true,

    addAttributes() {
        return {
            processId: { default: null },
            processName: { default: '关联流程' },
        };
    },

    parseHTML() {
        return [
            { tag: 'div[data-type="process-link"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'process-link' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ProcessLinkNodeView);
    },
});

export const ProcessCardNode = Node.create({
    name: 'processCard',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            fields: {
                default: {
                    name: '', level: '', code: '',
                    definition: '', purpose: '',
                    owner: '', parent: '',
                    children: '', input: '',
                    output: '', start: '',
                    end: '', kpi: ''
                }
            }
        };
    },

    parseHTML() {
        return [
            { tag: 'div[data-type="process-card"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'process-card' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ProcessCardNodeView);
    },
});

export const ArchitectureMatrixNode = Node.create({
    name: 'architectureMatrix',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            root: {
                default: null
            }
        };
    },

    parseHTML() {
        return [
            { tag: 'div[data-type="architecture-matrix"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'architecture-matrix' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ArchitectureMatrixNodeView);
    },
});
