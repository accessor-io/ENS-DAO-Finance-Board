import React from 'react';
import { componentClasses } from '../../styles/designSystem';

const StandardBadge = ({ 
  children, 
  variant = 'primary', // 'primary', 'success', 'warning', 'error', 'gray'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  ...props 
}) => {
  const getVariantClass = () => {
    return componentClasses.badge[variant] || componentClasses.badge.primary;
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  const baseClass = `${componentClasses.badge.base} ${getVariantClass()} ${getSizeClass()}`;
  const finalClass = `${baseClass} ${className}`;

  return (
    <span className={finalClass} {...props}>
      {children}
    </span>
  );
};

export default StandardBadge; 