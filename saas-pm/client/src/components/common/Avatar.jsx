import React from 'react';

const sizes = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-6 h-6 text-[11px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export default function Avatar({ name, color, size = 'md', className = '' }) {
  if (!name) {
    return (
      <div
        className={`${sizes[size]} ${className} rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-gray-400`}
        title="Unassigned"
      >
        ?
      </div>
    );
  }
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${sizes[size]} ${className} rounded-full flex items-center justify-center font-semibold text-white border-2 border-white dark:border-gray-900 shrink-0`}
      style={{ backgroundColor: color || '#6366F1' }}
      title={name}
    >
      {initials}
    </div>
  );
}
