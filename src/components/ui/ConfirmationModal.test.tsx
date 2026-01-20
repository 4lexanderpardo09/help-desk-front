
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationModal } from './ConfirmationModal';
import { describe, it, expect, vi } from 'vitest';

describe('ConfirmationModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        title: 'Confirm Title',
        message: 'Confirm Message'
    };

    it('should not render when isOpen is false', () => {
        render(<ConfirmationModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Confirm Title')).toBeNull();
    });

    it('should render correct title and message when isOpen is true', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Confirm Title')).toBeDefined();
        expect(screen.getByText('Confirm Message')).toBeDefined();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(<ConfirmationModal {...defaultProps} />);
        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onConfirm when confirm button is clicked', () => {
        render(<ConfirmationModal {...defaultProps} />);
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
        expect(defaultProps.onConfirm).toHaveBeenCalled();
    });

    it('should show custom text for buttons', () => {
        render(
            <ConfirmationModal
                {...defaultProps}
                confirmText="Yes, delete it"
                cancelText="No, keep it"
            />
        );
        expect(screen.getByText('Yes, delete it')).toBeDefined();
        expect(screen.getByText('No, keep it')).toBeDefined();
    });
});
