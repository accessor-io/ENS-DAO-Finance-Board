import React from 'react';
import { componentClasses } from '../../styles/designSystem';

const StandardButton = ({ 
  children, 
  variant = 'primary', // 'primary', 'secondary', 'success', 'warning', 'error'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const getVariantClass = () => {
    return componentClasses.button[variant] || componentClasses.button.primary;
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const baseClass = `${componentClasses.button.base} ${getVariantClass()} ${getSizeClass()}`;
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const finalClass = `${baseClass} ${disabledClass} ${className}`;

  return (
    <button 
      className={finalClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default StandardButton; 