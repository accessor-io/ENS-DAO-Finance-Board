import React, { useEffect, useRef, useState } from 'react';

const DataHexbin = ({ 
  children, 
  className = '', 
  width = '100%', 
  height = '100%',
  hexSize = 20,
  dataPoints = [],
  colorScale = 'viridis',
  maxDensity = 50,
  opacity = 0.4
}) => {
  const canvasRef = useRef(null);
  const [hexbins, setHexbins] = useState(new Map());
  const animationRef = useRef(null);

  // Generate sample data points if none provided
  const generateSampleData = () => {
    const points = [];
    const numPoints = 100; // Reduced for performance
    
    for (let i = 0; i < numPoints; i++) {
      // Create clusters of data points
      const cluster = Math.floor(Math.random() * 4);
      let x, y;
      
      switch (cluster) {
        case 0: // Top-left cluster
          x = Math.random() * 0.4;
          y = Math.random() * 0.4;
          break;
        case 1: // Top-right cluster
          x = 0.6 + Math.random() * 0.4;
          y = Math.random() * 0.4;
          break;
        case 2: // Bottom-left cluster
          x = Math.random() * 0.4;
          y = 0.6 + Math.random() * 0.4;
          break;
        case 3: // Bottom-right cluster
          x = 0.6 + Math.random() * 0.4;
          y = 0.6 + Math.random() * 0.4;
          break;
      }
      
      points.push({ x, y, value: Math.random() * 100 });
    }
    
    return points;
  };

  // Simplified hexbin calculation
  const calculateHexbins = (points, canvasWidth, canvasHeight) => {
    const bins = new Map();
    const gridSize = hexSize * 2;
    
    points.forEach(point => {
      // Convert to canvas coordinates
      const canvasX = point.x * canvasWidth;
      const canvasY = point.y * canvasHeight;
      
      // Simple grid-based binning
      const gridX = Math.floor(canvasX / gridSize);
      const gridY = Math.floor(canvasY / gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!bins.has(key)) {
        bins.set(key, {
          x: gridX * gridSize + gridSize / 2,
          y: gridY * gridSize + gridSize / 2,
          count: 0,
          sum: 0
        });
      }
      
      const bin = bins.get(key);
      bin.count++;
      bin.sum += point.value || 1;
    });
    
    return bins;
  };

  // Simplified color scale
  const getColor = (density, maxDensity) => {
    const normalized = Math.min(density / maxDensity, 1);
    
    // Simple viridis-like color scale
    if (normalized < 0.25) {
      return `rgba(68, 1, 84, ${opacity})`; // Dark purple
    } else if (normalized < 0.5) {
      return `rgba(59, 82, 139, ${opacity})`; // Blue
    } else if (normalized < 0.75) {
      return `rgba(33, 145, 140, ${opacity})`; // Teal
    } else {
      return `rgba(122, 209, 81, ${opacity})`; // Green
    }
  };

  // Draw hexbin
  const drawHexbin = (ctx, x, y, size, density, maxDensity) => {
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

    const color = getColor(density, maxDensity);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add subtle stroke
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  // Update visualization
  const updateVisualization = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Use provided data or generate sample data
    const points = dataPoints.length > 0 ? dataPoints : generateSampleData();
    
    // Calculate hexbins
    const bins = calculateHexbins(points, canvas.width, canvas.height);
    
    // Find maximum density
    let maxCount = 1;
    bins.forEach(bin => {
      maxCount = Math.max(maxCount, bin.count);
    });

    // Draw hexbins
    bins.forEach((bin, key) => {
      drawHexbin(ctx, bin.x, bin.y, hexSize, bin.count, maxCount);
    });
    
    setHexbins(bins);
  };

  // Single update instead of animation loop
  useEffect(() => {
    const timer = setTimeout(() => {
      updateVisualization();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dataPoints, hexSize, colorScale, maxDensity, opacity]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      updateVisualization();
    };

    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {/* Hexbin Canvas */}
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

export default DataHexbin; 