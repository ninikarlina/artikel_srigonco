import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
      secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-500',
      danger: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500',
      ghost: 'border-2 border-transparent text-gray-600 hover:border-gray-300 focus:ring-gray-500'
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg'
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
