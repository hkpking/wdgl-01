import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClauseBlock from '../Editor/ClauseBlock';

// Mock Tiptap components
vi.mock('@tiptap/react', () => ({
    NodeViewWrapper: ({ children, className }) => <div className={className} data-testid="node-view-wrapper">{children}</div>,
    NodeViewContent: ({ className }) => <div className={className} data-testid="node-view-content">Content</div>,
}));

describe('ClauseBlock', () => {
    const defaultProps = {
        node: {
            attrs: {
                id: '123',
                type: 'standard',
                responsibility: '',
                dept: ''
            }
        },
        updateAttributes: vi.fn(),
        getPos: vi.fn(),
        editor: {}
    };

    it('renders standard clause correctly', () => {
        render(<ClauseBlock {...defaultProps} />);

        expect(screen.getByTestId('node-view-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('node-view-content')).toBeInTheDocument();
        // Standard clause shouldn't have type badge or ID if no responsibility
        expect(screen.queryByText('#123')).not.toBeInTheDocument();
        expect(screen.queryByText('强制')).not.toBeInTheDocument();
    });

    it('renders mandatory clause with correct badge', () => {
        const props = {
            ...defaultProps,
            node: {
                attrs: {
                    ...defaultProps.node.attrs,
                    type: 'mandatory'
                }
            }
        };
        render(<ClauseBlock {...props} />);

        expect(screen.getByText('强制')).toBeInTheDocument();
    });

    it('renders risk clause with correct badge', () => {
        const props = {
            ...defaultProps,
            node: {
                attrs: {
                    ...defaultProps.node.attrs,
                    type: 'risk'
                }
            }
        };
        render(<ClauseBlock {...props} />);

        expect(screen.getByText('风险')).toBeInTheDocument();
    });

    it('renders responsibility badge when provided', () => {
        const props = {
            ...defaultProps,
            node: {
                attrs: {
                    ...defaultProps.node.attrs,
                    responsibility: 'John Doe'
                }
            }
        };
        render(<ClauseBlock {...props} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
});
