import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-4 py-2 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none ${className}`}
      {...props}
    />
  );
}
