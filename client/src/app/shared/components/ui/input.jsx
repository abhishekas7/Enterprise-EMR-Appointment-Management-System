import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`px-3 py-2 p-[2px] border rounded-lg shadow-sm focus:outline-none focus:ring-1 transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
