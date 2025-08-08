// Sample data points for hexbin visualization
export const generateENSDataPoints = () => {
  const points = [];
  
  // Working Group activities
  const workingGroupPoints = [
    // Ecosystem Working Group activities
    { x: 0.2, y: 0.3, value: 85, category: 'ecosystem' },
    { x: 0.25, y: 0.35, value: 92, category: 'ecosystem' },
    { x: 0.18, y: 0.28, value: 78, category: 'ecosystem' },
    { x: 0.22, y: 0.32, value: 88, category: 'ecosystem' },
    { x: 0.19, y: 0.31, value: 81, category: 'ecosystem' },
    
    // Meta-Governance activities
    { x: 0.7, y: 0.25, value: 95, category: 'meta-governance' },
    { x: 0.75, y: 0.28, value: 89, category: 'meta-governance' },
    { x: 0.72, y: 0.22, value: 91, category: 'meta-governance' },
    { x: 0.68, y: 0.26, value: 87, category: 'meta-governance' },
    { x: 0.73, y: 0.24, value: 93, category: 'meta-governance' },
    
    // Public Goods activities
    { x: 0.3, y: 0.7, value: 76, category: 'public-goods' },
    { x: 0.35, y: 0.72, value: 82, category: 'public-goods' },
    { x: 0.28, y: 0.68, value: 79, category: 'public-goods' },
    { x: 0.32, y: 0.71, value: 85, category: 'public-goods' },
    { x: 0.29, y: 0.69, value: 77, category: 'public-goods' },
    
    // Treasury activities
    { x: 0.8, y: 0.75, value: 98, category: 'treasury' },
    { x: 0.85, y: 0.78, value: 94, category: 'treasury' },
    { x: 0.82, y: 0.72, value: 96, category: 'treasury' },
    { x: 0.78, y: 0.76, value: 92, category: 'treasury' },
    { x: 0.83, y: 0.74, value: 97, category: 'treasury' },
  ];
  
  // Add working group points
  points.push(...workingGroupPoints);
  
  // Add random distribution points around the clusters
  for (let i = 0; i < 150; i++) {
    const cluster = Math.floor(Math.random() * 4);
    let baseX, baseY, spread;
    
    switch (cluster) {
      case 0: // Ecosystem cluster
        baseX = 0.2;
        baseY = 0.3;
        spread = 0.15;
        break;
      case 1: // Meta-Governance cluster
        baseX = 0.7;
        baseY = 0.25;
        spread = 0.12;
        break;
      case 2: // Public Goods cluster
        baseX = 0.3;
        baseY = 0.7;
        spread = 0.1;
        break;
      case 3: // Treasury cluster
        baseX = 0.8;
        baseY = 0.75;
        spread = 0.08;
        break;
    }
    
    const x = baseX + (Math.random() - 0.5) * spread;
    const y = baseY + (Math.random() - 0.5) * spread;
    const value = Math.random() * 50 + 30; // 30-80 range
    
    points.push({ x, y, value, category: 'distribution' });
  }
  
  return points;
};

// Color scales for different categories
export const categoryColors = {
  'ecosystem': '#3b82f6', // blue
  'meta-governance': '#8b5cf6', // purple
  'public-goods': '#10b981', // green
  'treasury': '#f59e0b', // yellow
  'distribution': '#6b7280' // gray
};

// Generate data points for specific sections
export const getSectionDataPoints = (section) => {
  const basePoints = generateENSDataPoints();
  
  switch (section) {
    case 'overview':
      return basePoints.filter(p => p.category === 'treasury' || p.category === 'distribution');
    case 'working-groups':
      return basePoints.filter(p => p.category !== 'treasury');
    case 'analytics':
      return basePoints.filter(p => p.category === 'meta-governance' || p.category === 'distribution');
    case 'realtime':
      return basePoints.filter(p => p.category === 'treasury' || p.category === 'ecosystem');
    default:
      return basePoints;
  }
}; 