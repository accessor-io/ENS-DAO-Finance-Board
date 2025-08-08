// Standardized Design System for ENS DAO Dashboard

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

export const typography = {
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  full: '9999px',
};

// Standardized component classes
export const componentClasses = {
  // Card components
  card: {
    base: 'glass p-6 rounded border border-gray-700',
    header: 'mb-4',
    title: 'text-2xl font-bold text-white',
    subtitle: 'text-gray-300 text-sm',
  },
  
  // Stats cards
  statsCard: {
    base: 'glass p-4 rounded text-white',
    title: 'text-lg font-semibold mb-1',
    value: 'text-3xl font-bold',
    subtitle: 'text-sm',
  },
  
  // Tables
  table: {
    container: 'glass rounded border border-gray-700 overflow-hidden',
    header: 'bg-gray-800 border-b border-gray-700',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase',
    body: 'bg-gray-900 divide-y divide-gray-700',
    row: 'hover:bg-gray-800 transition-colors',
    cell: 'px-6 py-4 whitespace-nowrap',
  },
  
  // Buttons
  button: {
    base: 'px-4 py-2 rounded font-medium transition-colors',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    error: 'bg-red-600 text-white hover:bg-red-700',
  },
  
  // Badges
  badge: {
    base: 'inline-flex px-2 py-1 text-xs font-semibold rounded text-white',
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    gray: 'bg-gray-600',
  },
  
  // Navigation
  nav: {
    container: 'border-b border-gray-700',
    tabs: '-mb-px flex space-x-4',
    tab: 'py-2 px-1 border-b-2 font-medium text-sm',
    active: 'border-blue-500 text-blue-400',
    inactive: 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600',
  },
  
  // Forms
  form: {
    input: 'bg-gray-700 border border-gray-600 text-white rounded px-3 py-2',
    select: 'bg-gray-700 border border-gray-600 text-white rounded px-3 py-1',
    label: 'block text-sm font-medium text-gray-300 mb-1',
  },
  
  // Layout
  layout: {
    container: 'space-y-6',
    section: 'space-y-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    flex: 'flex items-center justify-between',
  },
};

// Standardized spacing utilities
export const spacingClasses = {
  container: 'p-6',
  section: 'mb-6',
  card: 'p-4',
  button: 'px-4 py-2',
  input: 'px-3 py-2',
  table: 'px-6 py-4',
};

// Standardized color utilities
export const colorClasses = {
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    info: 'text-blue-400',
  },
  
  background: {
    primary: 'bg-gray-800',
    secondary: 'bg-gray-900',
    glass: 'glass',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  },
  
  border: {
    primary: 'border-gray-700',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    warning: 'border-yellow-600',
    error: 'border-red-600',
  },
};

// Helper functions for consistent styling
export const createComponentClass = (baseClass, modifiers = {}) => {
  let className = baseClass;
  
  Object.entries(modifiers).forEach(([key, value]) => {
    if (value) {
      className += ` ${key}`;
    }
  });
  
  return className;
};

export const getResponsiveClass = (baseClass, breakpoints = {}) => {
  let className = baseClass;
  
  Object.entries(breakpoints).forEach(([breakpoint, value]) => {
    if (value) {
      className += ` ${breakpoint}:${value}`;
    }
  });
  
  return className;
}; 