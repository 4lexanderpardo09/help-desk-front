import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from './buttonVariants';

/**
 * Propiedades del componente Button.
 * Extiende los atributos nativos de HTMLButtonElement y las variantes de cva.
 */
export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

/**
 * Componente de Botón reutilizable.
 * Soporta variantes de estilo, tamaños y manejo de estados como disabled/loading.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
