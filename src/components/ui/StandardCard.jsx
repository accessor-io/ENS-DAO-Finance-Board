import React from 'react';
import { componentClasses } from '../../styles/designSystem';

const StandardCard = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  ...props 
}) => {
  return (
    <div className={`${componentClasses.card.base} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`${componentClasses.card.header} ${headerClassName}`}>
          {title && <h3 className={componentClasses.card.title}>{title}</h3>}
          {subtitle && <p className={componentClasses.card.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

export default StandardCard; 