import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, action, onClick }) => {
  return (
    <div 
      className={`bg-surface border border-border rounded-xl shadow-sm overflow-hidden ${className}`}
      onClick={onClick}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-textMain">{title}</h3>}
            {description && <p className="text-sm text-textMuted mt-1">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};