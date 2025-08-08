import React, { useEffect, useRef } from 'react';
import { marbleGenerator } from '../utils/marbleTexture';

const MarbleTexture = ({ 
  children, 
  color = 'blue', 
  className = '', 
  style = {}, 
  width = 100, 
  height = 100,
  regenerateOnMount = true 
}) => {
  const elementRef = useRef(null);
  const textureRef = useRef(null);

  const applyMarbleTexture = () => {
    if (!elementRef.current) return;

    const texture = marbleGenerator.generateMarbleTexture(color, width, height);
    
    // Apply background texture
    elementRef.current.style.background = texture.background;
    
    // Create or update overlay element
    if (!textureRef.current) {
      textureRef.current = document.createElement('div');
      textureRef.current.style.position = 'absolute';
      textureRef.current.style.top = '0';
      textureRef.current.style.left = '0';
      textureRef.current.style.right = '0';
      textureRef.current.style.bottom = '0';
      textureRef.current.style.pointerEvents = 'none';
      textureRef.current.style.zIndex = '1';
      elementRef.current.appendChild(textureRef.current);
    }
    
    textureRef.current.style.background = texture.overlay;
  };

  useEffect(() => {
    if (regenerateOnMount) {
      applyMarbleTexture();
    }
  }, [color, width, height, regenerateOnMount]);

  const regenerateTexture = () => {
    applyMarbleTexture();
  };

  return (
    <div 
      ref={elementRef}
      className={`marble-texture ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      onClick={regenerateTexture}
      title="Click to regenerate texture"
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default MarbleTexture; 