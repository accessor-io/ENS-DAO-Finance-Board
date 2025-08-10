import React from 'react';
import { componentClasses } from '../../styles/designSystem';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendType = 'neutral', // 'positive', 'negative', 'neutral'
  className = '',
  ...props 
}) => {
  const getTrendColor = () => {
    switch (trendType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`${componentClasses.statsCard.base} ${className}`} {...props}>
      <h3 className={componentClasses.statsCard.title}>{title}</h3>
      <p className={componentClasses.statsCard.value}>{value}</p>
      {subtitle && (
        <p className={`${componentClasses.statsCard.subtitle} ${getTrendColor()}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard; 