import React from 'react';

export const Alert = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'px-4 py-3 mb-4 rounded-lg flex items-center gap-2';
  const variantStyles = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200',
    destructive: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-green-50 text-green-700 border border-green-200'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} role="alert" {...props}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
);