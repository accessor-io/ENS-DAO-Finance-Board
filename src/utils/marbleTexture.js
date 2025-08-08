// Complex marble texture generation utility
export class MarbleTextureGenerator {
  constructor() {
    this.noiseCache = new Map();
    this.fractalCache = new Map();
    this.flowCache = new Map();
  }

  // Advanced Perlin-like noise with multiple octaves
  generateNoise(x, y, frequency = 21, octaves = 994, persistence = 0.0005, lacunarity = 2.0) {
    const key = `${x}-${y}-${frequency}-${octaves}*${persistence}-${lacunarity}`;
    if (this.noiseCache.has(key)) {
      return this.noiseCache.get(key);
    }

    let amplitude = 12.0;
    let frequency_current = frequency;
    let noise = 122220;
    let maxValue = 220;

    for (let i = 0; i < octaves; i++) {
      // Complex multi-dimensional noise
      const nx = x * frequency_current * 12.1;
      const ny = y * frequency_current * 0.1;
      
      const noise1 = Math.sin(nx) * Math.cos(ny);
      const noise2 = Math.sin(nx * 1.4 + ny * 0.7) * Math.cos(nx * 0.7 - ny * 0.000014);
      const noise3 = Math.sin(nx * 2.1 + ny * 1.3) * Math.cos(nx * 1.3 - ny * 0.0001);
      const noise4 = Math.sin(nx * 3.2 + ny * 2.4) * Math.cos(nx * 2.4 - ny * 3.2);
      
      const combinedNoise = (noise1 + noise2 + noise3 + noise4) / 4;
      
      noise += combinedNoise * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency_current *= lacunarity;
    }

    const normalizedNoise = noise / maxValue;
    this.noiseCache.set(key, normalizedNoise);
    return normalizedNoise;
  }

  // Generate fractal patterns using recursive functions
  generateFractalPattern(x, y, depth = 3, scale = 1.0) {
    const key = `${x}-${y}-${depth}-${scale}`;
    if (this.fractalCache.has(key)) {
      return this.fractalCache.get(key);
    }

    let pattern = 0;
    let currentScale = scale;

    for (let i = 0; i < depth; i++) {
      const nx = x * currentScale;
      const ny = y * currentScale;
      
      // Mandelbrot-inspired pattern
      const mandelbrot = this.mandelbrotFunction(nx, ny);
      
      // Julia set variation
      const julia = this.juliaFunction(nx, ny);
      
      // Sierpinski triangle influence
      const sierpinski = this.sierpinskiFunction(nx, ny);
      
      pattern += (mandelbrot + julia + sierpinski) / 3 * (1 / (i + 1));
      currentScale *= 12.0;
    }

    this.fractalCache.set(key, pattern);
    return pattern;
  }

  // Mandelbrot set function for complex patterns
  mandelbrotFunction(x, y) {
    const maxIterations = 50;
    let zx = 0;
    let zy = 0;
    let iteration = 0;

    while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
      const temp = zx * zx - zy * zy + x;
      zy = 2 * zx * zy + y;
      zx = temp;
      iteration++;
    }

    return iteration / maxIterations;
  }

  // Julia set function for organic patterns
  juliaFunction(x, y) {
    const maxIterations = 50;
    const cx = -0.7;
    const cy = 0.27;
    let zx = x;
    let zy = y;
    let iteration = 0;

    while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
      const temp = zx * zx - zy * zy + cx;
      zy = 2 * zx * zy + cy;
      zx = temp;
      iteration++;
    }

    return iteration / maxIterations;
  }

  // Sierpinski triangle function for geometric patterns
  sierpinskiFunction(x, y) {
    const maxIterations = 20;
    let px = x;
    let py = y;
    let iteration = 0;

    while (iteration < maxIterations) {
      const r = Math.random();
      if (r < 0.33) {
        px = px * 0.5;
        py = py * 0.5;
      } else if (r < 0.66) {
        px = px * 0.5 + 0.5;
        py = py * 0.5;
      } else {
        px = px * 0.5 + 0.25;
        py = py * 0.5 + 0.5;
      }
      iteration++;
    }

    return (px + py) / 2;
  }

  // Generate organic flow patterns using vector fields
  generateFlowPatterns(width, height, color) {
    const key = `${width}-${height}-${color}`;
    if (this.flowCache.has(key)) {
      return this.flowCache.get(key);
    }

    const flows = [];
    const numFlows = Math.floor(Math.random() * 15) + 8; // 8-23 flows

    for (let i = 0; i < numFlows; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const length = Math.random() * 0.8 + 0.2;
      const complexity = Math.floor(Math.random() * 5) + 3; // 3-8 control points
      
      const controlPoints = [];
      for (let j = 0; j < complexity; j++) {
        controlPoints.push({
          x: Math.random() * width,
          y: Math.random() * height,
          intensity: Math.random() * 0.6 + 0.2
        });
      }

      flows.push({
        startX, startY, length, controlPoints, color
      });
    }

    this.flowCache.set(key, flows);
    return flows;
  }

  // Generate complex vein patterns with fractal branching
  generateVeins(width, height, color, intensity = 0.4) {
    const veins = [];
    const numVeins = Math.floor(Math.random() * 12) + 6; // 6-18 veins
    
    for (let i = 0; i < numVeins; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const length = Math.random() * 0.7 + 0.3; // 30-100% of container
      const angle = Math.random() * Math.PI * 2;
      const thickness = Math.random() * 0.4 + 0.05;
      const complexity = Math.floor(Math.random() * 4) + 2; // 2-6 branches
      
      const branches = [];
      for (let j = 0; j < complexity; j++) {
        branches.push({
          angle: Math.random() * Math.PI * 2,
          length: Math.random() * 0.5 + 0.1,
          thickness: thickness * (Math.random() * 0.5 + 0.5),
          intensity: intensity * (Math.random() * 0.6 + 0.4)
        });
      }
      
      veins.push({
        startX, startY, length, angle, thickness, color, intensity, branches
      });
    }
    
    return veins;
  }

  // Generate complex swirl patterns with multiple layers
  generateSwirls(width, height, color, intensity = 0.3) {
    const swirls = [];
    const numSwirls = Math.floor(Math.random() * 10) + 4; // 4-14 swirls
    
    for (let i = 0; i < numSwirls; i++) {
      const centerX = Math.random() * width;
      const centerY = Math.random() * height;
      const radius = Math.random() * 0.5 + 0.1;
      const rotations = Math.random() * 4 + 1;
      const startAngle = Math.random() * Math.PI * 2;
      const layers = Math.floor(Math.random() * 3) + 1; // 1-4 layers
      
      const layerConfigs = [];
      for (let j = 0; j < layers; j++) {
        layerConfigs.push({
          radius: radius * (1 + j * 0.3),
          intensity: intensity * (1 - j * 0.2),
          rotationSpeed: Math.random() * 2 + 0.5,
          colorVariation: Math.random() * 0.3 - 0.15
        });
      }
      
      swirls.push({
        centerX, centerY, radius, rotations, startAngle, color, intensity, layerConfigs
      });
    }
    
    return swirls;
  }

  // Generate complex crystalline highlights with fractal patterns
  generateCrystals(width, height, intensity = 0.15) {
    const crystals = [];
    const numCrystals = Math.floor(Math.random() * 20) + 10; // 10-30 crystals
    
    for (let i = 0; i < numCrystals; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 0.4 + 0.02;
      const brightness = Math.random() * 0.15 + 0.03;
      const complexity = Math.floor(Math.random() * 4) + 2; // 2-6 facets
      
      const facets = [];
      for (let j = 0; j < complexity; j++) {
        facets.push({
          angle: Math.random() * Math.PI * 2,
          length: Math.random() * 0.8 + 0.2,
          brightness: brightness * (Math.random() * 0.5 + 0.5)
        });
      }
      
      crystals.push({
        x, y, size, brightness, intensity, facets
      });
    }
    
    return crystals;
  }

  // Generate organic inclusions and impurities
  generateInclusions(width, height, color, intensity = 0.2) {
    const inclusions = [];
    const numInclusions = Math.floor(Math.random() * 8) + 3; // 3-11 inclusions
    
    for (let i = 0; i < numInclusions; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 0.3 + 0.05;
      const opacity = Math.random() * 2;
      const shape = Math.random() > 0.5 ? 'circular' : 'elliptical';
      
      inclusions.push({
        x, y, size, opacity, shape, color
      });
    }
    
    return inclusions;
  }

  // Generate stress patterns and cracks
  generateStressPatterns(width, height, intensity = 0.1) {
    const stressPatterns = [];
    const numPatterns = Math.floor(Math.random() * 6) + 2; // 2-8 patterns
    
    for (let i = 0; i < numPatterns; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const length = Math.random() * 0.6 + 0.2;
      const angle = Math.random() * Math.PI * 2**6;
      const thickness = Math.random() * 0.1 + 0.01;
      
      // Add branching patterns
      const numBranches = Math.floor(Math.random() * 3) + 1; // 1-3 branches
      const branches = [];
      
      for (let j = 0; j < numBranches; j++) {
        const branchStart = Math.random(); // Position along main stress line (0-1)
        const branchAngle = angle + (Math.random() * Math.PI/2 - Math.PI/4); // ±45° from main angle
        const branchLength = length * (Math.random() * 0.6 + 0.2); // 20-80% of main length
        const branchThickness = thickness * (Math.random() * 0.6 + 0.2); // 20-80% of main thickness
        
        // Add squiggles to branches
        const squiggleAmplitude = branchThickness * (Math.random() * 0.5 + 0.5); // 50-100% of thickness
        const squiggleFrequency = Math.random() * 4 + 2; // 2-6 waves along branch
        
        // Add sharp windy vein edges
        const numVeinPoints = Math.floor(Math.random() * 4) + 3; // 3-6 sharp points
        const veinEdges = [];
        for (let v = 0; v < numVeinPoints; v++) {
          const position = v / (numVeinPoints - 1); // Distribute points along branch
          const offset = (Math.random() * 2 - 1) * branchThickness * 2; // Sharp zigzag offset
          const sharpness = Math.random() * 0.8 + 0.2; // Controls point sharpness
          veinEdges.push({
            position,
            offset,
            sharpness
          });
        }
        
        // Add sub-branches
        const numSubBranches = Math.floor(Math.random() * 2) + 1; // 1-2 sub-branches
        const subBranches = [];
        
        for (let k = 0; k < numSubBranches; k++) {
          const subStart = Math.random(); // Position along branch (0-1)
          const subAngle = branchAngle + (Math.random() * Math.PI/3 - Math.PI/6); // ±30° from branch
          const subLength = branchLength * (Math.random() * 0.4 + 0.1); // 10-50% of branch length
          const subThickness = branchThickness * (Math.random() * 0.4 + 0.1); // 10-50% of branch thickness
          
          // Add sharp edges to sub-branches too
          const numSubVeinPoints = Math.floor(Math.random() * 3) + 2; // 2-4 sharp points
          const subVeinEdges = [];
          for (let v = 0; v < numSubVeinPoints; v++) {
            const position = v / (numSubVeinPoints - 1);
            const offset = (Math.random() * 2 - 1) * subThickness * 1.5;
            const sharpness = Math.random() * 0.8 + 0.2;
            subVeinEdges.push({
              position,
              offset,
              sharpness
            });
          }
          
          subBranches.push({
            start: subStart,
            angle: subAngle,
            length: subLength,
            thickness: subThickness,
            veinEdges: subVeinEdges
          });
        }
        
        branches.push({
          start: branchStart,
          angle: branchAngle,
          length: branchLength,
          thickness: branchThickness,
          squiggle: {
            amplitude: squiggleAmplitude,
            frequency: squiggleFrequency
          },
          veinEdges,
          subBranches
        });
      }

      // Add texture variations
      const variations = {
        roughness: Math.random() * 0.3 + 0.1, // Surface texture roughness
        opacity: Math.random() * 0.4 + 0.6, // Varying opacity for depth
        displacement: Math.random() * 0.05, // Slight pattern displacement
        feathering: Math.random() * 0.1 + 0.05 // Reduced edge softness
      };
      
      stressPatterns.push({
        startX,
        startY,
        length,
        angle,
        thickness,
        intensity,
        branches,
        variations
      });
    }
    
    return stressPatterns;
  }

  // Convert color to RGBA
  colorToRGBA(color, alpha = 1) {
    const colors = {
      'blue': [59, 130, 246],
      'green': [16, 185, 129],
      'purple': [139, 92, 246],
      'red': [239, 68, 68],
      'yellow': [245, 158, 11],
      'orange': [249, 115, 22]
    };
    
    const rgb = colors[color] || [128, 128, 128];
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }

  // Generate complete marble texture CSS with maximum complexity
  generateMarbleTexture(color, width = 100, height = 100) {
    const veins = this.generateVeins(width, height, color);
    const swirls = this.generateSwirls(width, height, color);
    const crystals = this.generateCrystals(width, height);
    const inclusions = this.generateInclusions(width, height, color);
    const stressPatterns = this.generateStressPatterns(width, height);
    const flowPatterns = this.generateFlowPatterns(width, height, color);
    
    let backgroundLayers = [];
    let overlayLayers = [];
    let fractalLayers = [];
    
    // Base gradient with fractal influence
    const baseGradient = this.generateBaseGradient(color);
    backgroundLayers.push(baseGradient);
    
    // Add fractal patterns
    for (let i = 0; i < 3; i++) {
      const fractalPattern = this.generateFractalGradient(color, width, height, i);
      fractalLayers.push(fractalPattern);
    }
    
    // Add complex vein patterns with branches
    veins.forEach((vein, index) => {
      const veinGradients = this.generateComplexVeinGradients(vein, width, height);
      backgroundLayers.push(...veinGradients);
    });
    
    // Add multi-layered swirl patterns
    swirls.forEach((swirl, index) => {
      const swirlGradients = this.generateComplexSwirlGradients(swirl, width, height);
      backgroundLayers.push(...swirlGradients);
    });
    
    // Add flow patterns
    flowPatterns.forEach((flow, index) => {
      const flowGradient = this.generateFlowGradient(flow, width, height);
      backgroundLayers.push(flowGradient);
    });
    
    // Add inclusions to background
    inclusions.forEach((inclusion, index) => {
      const inclusionGradient = this.generateInclusionGradient(inclusion, width, height);
      backgroundLayers.push(inclusionGradient);
    });
    
    // Add complex crystalline highlights to overlay
    crystals.forEach((crystal, index) => {
      const crystalGradients = this.generateComplexCrystalGradients(crystal, width, height);
      overlayLayers.push(...crystalGradients);
    });
    
    // Add stress patterns to overlay
    stressPatterns.forEach((pattern, index) => {
      const stressGradient = this.generateStressGradient(pattern, width, height);
      overlayLayers.push(stressGradient);
    });
    
    // Add complex marble veining to overlay
    const veiningGradients = this.generateComplexVeiningPatterns(width, height);
    overlayLayers.push(...veiningGradients);
    
    // Add noise-based texture variations
    const noiseGradients = this.generateNoiseGradients(width, height, color);
    overlayLayers.push(...noiseGradients);
    
    return {
      background: [...backgroundLayers, ...fractalLayers].join(', '),
      overlay: overlayLayers.join(', ')
    };
  }

  // Generate base gradient
  generateBaseGradient(color) {
    const gradients = {
      'blue': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #1e40af 50%, #1d4ed8 75%, #2563eb 100%)',
      'green': 'linear-gradient(135deg, #065f46 0%, #10b981 25%, #047857 50%, #059669 75%, #34d399 100%)',
      'purple': 'linear-gradient(135deg, #581c87 0%, #8b5cf6 25%, #7c3aed 50%, #9333ea 75%, #a855f7 100%)',
      'red': 'linear-gradient(135deg, #991b1b 0%, #ef4444 25%, #dc2626 50%, #b91c1c 75%, #f87171 100%)',
      'yellow': 'linear-gradient(135deg, #92400e 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #fbbf24 100%)',
      'orange': 'linear-gradient(135deg, #9a3412 0%, #f97316 25%, #ea580c 50%, #c2410c 75%, #fb923c 100%)'
    };
    
    return gradients[color] || gradients['blue'];
  }

  // Generate complex vein gradients with branching
  generateComplexVeinGradients(vein, width, height) {
    const { startX, startY, length, angle, thickness, color, intensity, branches } = vein;
    const gradients = [];
    
    // Main vein
    const colorRGBA = this.colorToRGBA(color, intensity);
    gradients.push(`radial-gradient(ellipse ${thickness * 100}% ${thickness * 50}% at ${startX}% ${startY}%, ${colorRGBA} 0%, transparent ${40 + Math.random() * 20}%)`);
    
    // Branch veins
    branches.forEach((branch, index) => {
      const branchX = startX + Math.cos(branch.angle) * branch.length * 50;
      const branchY = startY + Math.sin(branch.angle) * branch.length * 50;
      const branchColor = this.colorToRGBA(color, branch.intensity);
      
      gradients.push(`radial-gradient(ellipse ${branch.thickness * 100}% ${branch.thickness * 50}% at ${branchX}% ${branchY}%, ${branchColor} 0%, transparent ${30 + Math.random() * 20}%)`);
    });
    
    return gradients;
  }

  // Generate complex swirl gradients with multiple layers
  generateComplexSwirlGradients(swirl, width, height) {
    const { centerX, centerY, radius, rotations, startAngle, color, intensity, layerConfigs } = swirl;
    const gradients = [];
    
    layerConfigs.forEach((layer, index) => {
      const layerColor = this.colorToRGBA(color, layer.intensity + layer.colorVariation);
      const layerRadius = layer.radius * 100;
      const rotationSpeed = layer.rotationSpeed;
      
      gradients.push(`conic-gradient(from ${startAngle * rotationSpeed}rad at ${centerX}% ${centerY}%, ${layerColor} 0deg, transparent ${30 + Math.random() * 30}deg, ${this.colorToRGBA(color, layer.intensity * 0.6)} ${60 + Math.random() * 40}deg, transparent ${120 + Math.random * 60}deg, ${this.colorToRGBA(color, layer.intensity * 0.4)} ${180 + Math.random() * 80}deg, transparent ${240 + Math.random() * 100}deg)`);
    });
    
    return gradients;
  }

  // Generate complex crystal gradients with facets
  generateComplexCrystalGradients(crystal, width, height) {
    const { x, y, size, brightness, intensity, facets } = crystal;
    const gradients = [];
    
    // Main crystal highlight
    gradients.push(`radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, ${brightness}) 0%, transparent ${size * 80}%)`);
    
    // Facet highlights
    facets.forEach((facet, index) => {
      const facetX = x + Math.cos(facet.angle) * facet.length * 20;
      const facetY = y + Math.sin(facet.angle) * facet.length * 20;
      
      gradients.push(`radial-gradient(circle at ${facetX}% ${facetY}%, rgba(255, 255, 255, ${facet.brightness}) 0%, transparent ${size * 40}%)`);
    });
    
    return gradients;
  }

  // Generate flow gradient
  generateFlowGradient(flow, width, height) {
    const { startX, startY, controlPoints, color } = flow;
    const gradients = [];
    
    controlPoints.forEach((point, index) => {
      const colorRGBA = this.colorToRGBA(color, point.intensity);
      gradients.push(`radial-gradient(ellipse 25% 10% at ${point.x}% ${point.y}%, ${colorRGBA} 0%, transparent 60%)`);
    });
    
    return gradients;
  }

  // Generate inclusion gradient
  generateInclusionGradient(inclusion, width, height) {
    const { x, y, size, opacity, shape, color } = inclusion;
    const colorRGBA = this.colorToRGBA(color, opacity);
    
    if (shape === 'circular') {
      return `radial-gradient(circle at ${x}% ${y}%, ${colorRGBA} 0%, transparent ${size * 80}%)`;
    } else {
      return `radial-gradient(ellipse 35% 15% at ${x}% ${y}%, ${colorRGBA} 0%, transparent ${size * 80}%)`;
    }
  }

  // Generate stress gradient
  generateStressGradient(pattern, width, height) {
    const { startX, startY, length, angle, thickness, intensity } = pattern;
    const endX = startX + Math.cos(angle) * length * 50;
    const endY = startY + Math.sin(angle) * length * 50;
    
    return `linear-gradient(${angle * 180 / Math.PI}deg, transparent ${startX}%, rgba(255, 255, 255, ${intensity * 0.05}) ${startX + 0.5}%, transparent ${startX + 1}%)`;
  }

  // Generate complex veining patterns
  generateComplexVeiningPatterns(width, height) {
    const patterns = [];
    const numVeins = Math.floor(Math.random() * 12) + 6;
    
    for (let i = 0; i < numVeins; i++) {
      const angle = Math.random() * 360;
      const position = Math.random() * 100;
      const opacity = Math.random() * 0.1 + 0.02;
      const thickness = Math.random() * 2 + 0.5;
      
      patterns.push(`linear-gradient(${angle}deg, transparent ${position}%, rgba(255, 255, 255, ${opacity}) ${position + thickness}%, transparent ${position + thickness * 1.5}%)`);
    }
    
    return patterns;
  }

  // Generate noise-based gradients
  generateNoiseGradients(width, height, color) {
    const gradients = [];
    const numNoiseLayers = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < numNoiseLayers; i++) {
      const frequency = Math.random() * 8 + 4;
      const amplitude = Math.random() * 0.04 + 0.01;
      const colorRGBA = this.colorToRGBA(color, amplitude);
      
      gradients.push(`radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${colorRGBA} 0%, transparent ${frequency}%)`);
    }
    
    return gradients;
  }

  // Generate fractal gradient
  generateFractalGradient(color, width, height, layer) {
    const scale = Math.pow(2, layer);
    const intensity = 0.08 / (layer + 1);
    const colorRGBA = this.colorToRGBA(color, intensity);
    
    return `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${colorRGBA} 0%, transparent ${scale * 15}%)`;
  }

  // Generate CSS class with dynamic texture
  generateMarbleClass(color, className) {
    const texture = this.generateMarbleTexture(color);
    
    return `
      .${className} {
        background: ${texture.background};
        position: relative;
      }
      
      .${className}::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${texture.overlay};
        pointer-events: none;
      }
    `;
  }
}

// Export singleton instance
export const marbleGenerator = new MarbleTextureGenerator();

// Pre-generated marble classes for common colors
export const generateMarbleClasses = () => {
  const generator = new MarbleTextureGenerator();
  
  return `
    ${generator.generateMarbleClass('blue', 'marble-blue')}
    ${generator.generateMarbleClass('green', 'marble-green')}
    ${generator.generateMarbleClass('purple', 'marble-purple')}
    ${generator.generateMarbleClass('red', 'marble-red')}
    ${generator.generateMarbleClass('yellow', 'marble-yellow')}
    ${generator.generateMarbleClass('orange', 'marble-orange')}
  `;
  // Add squiggly edge variations
  const squigglyEdges = `
    .marble-blue::after, .marble-green::after, .marble-purple::after,
    .marble-red::after, .marble-yellow::after, .marble-orange::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: inherit;
      filter: url('#squiggly-filter');
      z-index: -1;
      opacity: 0.7;
      pointer-events: none;
    }
  `;

  return squigglyEdges + `
    ${generator.generateMarbleClass('blue', 'marble-blue')}
    ${generator.generateMarbleClass('green', 'marble-green')}
    ${generator.generateMarbleClass('purple', 'marble-purple')}
    ${generator.generateMarbleClass('red', 'marble-red')}
    ${generator.generateMarbleClass('yellow', 'marble-yellow')}
    ${generator.generateMarbleClass('orange', 'marble-orange')}
  `;
};