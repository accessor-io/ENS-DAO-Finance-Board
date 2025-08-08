import React, { useEffect, useRef, useState } from 'react';

const HexbinHeatmap = ({ 
  children, 
  className = '', 
  width = '100%', 
  height = '100%',
  hexSize = 30,
  heatRadius = 150,
  maxHeat = 1.0,
  fadeSpeed = 0.98
}) => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heatMap, setHeatMap] = useState(new Map());
  const animationRef = useRef(null);

  // Convert point to hex coordinates
  const pointToHex = (x, y, size) => {
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size;
    const r = (2 / 3 * y) / size;
    return hexRound(q, r);
  };

  // Round to nearest hex
  const hexRound = (q, r) => {
    let s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  };

  // Convert hex to pixel coordinates
  const hexToPixel = (q, r, size) => {
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
    const y = size * (3 / 2 * r);
    return { x, y };
  };

  // Calculate distance between two points
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Generate heat value based on distance from mouse
  const getHeatValue = (hexX, hexY, mouseX, mouseY) => {
    const dist = distance(hexX, hexY, mouseX, mouseY);
    if (dist > heatRadius) return 0;
    return Math.max(0, 1 - dist / heatRadius) * maxHeat;
  };

  // Handle mouse movement
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  // Update heatmap
  const updateHeatmap = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate visible hex grid
    const cols = Math.ceil(canvas.width / (hexSize * Math.sqrt(3))) + 2;
    const rows = Math.ceil(canvas.height / (hexSize * 2)) + 2;

    // Update heat values
    const newHeatMap = new Map();
    
    for (let col = -cols/2; col < cols/2; col++) {
      for (let row = -rows/2; row < rows/2; row++) {
        const hex = { q: col, r: row };
        const pixel = hexToPixel(hex.q, hex.r, hexSize);
        
        // Adjust for canvas center
        const hexX = pixel.x + canvas.width / 2;
        const hexY = pixel.y + canvas.height / 2;
        
        // Get heat value from mouse position
        const heatValue = getHeatValue(hexX, hexY, mousePos.x, mousePos.y);
        
        // Get existing heat value and apply fade
        const existingHeat = heatMap.get(`${hex.q},${hex.r}`) || 0;
        const newHeat = Math.max(heatValue, existingHeat * fadeSpeed);
        
        if (newHeat > 0.01) {
          newHeatMap.set(`${hex.q},${hex.r}`, newHeat);
          
          // Draw hex with heat color
          drawHex(ctx, hexX, hexY, hexSize, newHeat);
        }
      }
    }
    
    setHeatMap(newHeatMap);
  };

  // Draw a single hexagon
  const drawHex = (ctx, x, y, size, heat) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hexX = x + size * Math.cos(angle);
      const hexY = y + size * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(hexX, hexY);
      } else {
        ctx.lineTo(hexX, hexY);
      }
    }
    ctx.closePath();

    // Create gradient based on heat
    const intensity = Math.min(heat, 1);
    const alpha = intensity * 0.3; // Max 30% opacity
    
    // Color gradient from cool to warm
    const hue = 200 + intensity * 60; // Blue (200) to Orange (260)
    const saturation = 80 + intensity * 20; // 80% to 100%
    const lightness = 50 + intensity * 30; // 50% to 80%
    
    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    ctx.fill();
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateHeatmap();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, heatMap]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
    >
      {/* Heatmap Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HexbinHeatmap; 