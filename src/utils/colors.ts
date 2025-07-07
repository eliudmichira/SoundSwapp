export type ColorKey = 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo';

export const COLORS: Record<ColorKey, string> = {
  purple: 'purple',
  blue: 'blue',
  green: 'green',
  red: 'red',
  yellow: 'yellow',
  indigo: 'indigo'
} as const;

export const getColorClass = (color: ColorKey = 'blue', type: 'bg' | 'text' | 'border' = 'bg'): string => {
  const colorMap: Record<ColorKey, Record<'bg' | 'text' | 'border', string>> = {
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-500',
      border: 'border-purple-500'
    },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      border: 'border-green-500'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-500',
      border: 'border-red-500'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      border: 'border-yellow-500'
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-500',
      border: 'border-indigo-500'
    }
  };

  return colorMap[color][type];
};

export const getGradientClass = (color: ColorKey = 'blue'): string => {
  const gradientMap: Record<ColorKey, string> = {
    purple: 'from-purple-400 to-purple-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    red: 'from-red-400 to-red-600',
    yellow: 'from-yellow-400 to-yellow-600',
    indigo: 'from-indigo-400 to-indigo-600'
  };

  return `bg-gradient-to-br ${gradientMap[color]}`;
}; 