
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoModal } from './InfoModal';
import { describe, it, expect, vi } from 'vitest';

describe('InfoModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Info Title',
        message: 'Info Message'
    };

    it('should not render when isOpen is false', () => {
        render(<InfoModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Info Title')).toBeNull();
    });

    it('should render correct title and message when isOpen is true', () => {
        render(<InfoModal {...defaultProps} />);
        expect(screen.getByText('Info Title')).toBeDefined();
        expect(screen.getByText('Info Message')).toBeDefined();
    });

    it('should call onClose when button is clicked', () => {
        render(<InfoModal {...defaultProps} />);
        const button = screen.getByText('Entendido');
        fireEvent.click(button);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should render success variant correctly', () => {
        render(<InfoModal {...defaultProps} variant="success" />);
        // We can check for the check_circle icon text content as a proxy for the icon being present
        expect(screen.getByText('check_circle')).toBeDefined();
    });

    it('should render error variant correctly', () => {
        render(<InfoModal {...defaultProps} variant="error" />);
        expect(screen.getByText('error')).toBeDefined();
    });
});
