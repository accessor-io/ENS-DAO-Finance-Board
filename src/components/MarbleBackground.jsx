import React from 'react';
import MarbleTexture from './MarbleTexture';
import DataHexbin from './DataHexbin';

import { getSectionDataPoints } from '../data/hexbinData';

const MarbleBackground = ({ 
  children, 
  primaryColor = 'blue', 
  secondaryColor = 'purple',
  tertiaryColor = 'green',
  className = '',
  style = {},
  section = 'overview'
}) => {
  return (
    <DataHexbin 
      className={className} 
      style={style}
      hexSize={25}
      colorScale="viridis"
      maxDensity={30}
      opacity={0.3}
      dataPoints={getSectionDataPoints(section)}
    >
      <div className="relative w-full h-full">
        {/* Deepest background layer - tertiary marble */}
        <div className="absolute inset-0 -z-10">
          <MarbleTexture 
            color={tertiaryColor} 
            className="w-full h-full opacity-20"
            width={200}
            height={200}
          />
        </div>
        
        {/* Middle background layer - secondary marble */}
        <div className="absolute inset-0 -z-5">
          <MarbleTexture 
            color={secondaryColor} 
            className="w-full h-full opacity-40"
            width={150}
            height={150}
          />
        </div>
        
        {/* Front background layer - primary marble */}
        <div className="absolute inset-0 -z-1">
          <MarbleTexture 
            color={primaryColor} 
            className="w-full h-full opacity-60"
            width={100}
            height={100}
          />
        </div>
        
        {/* Content layer with glass panels */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </DataHexbin>
  );
};

export default MarbleBackground; 