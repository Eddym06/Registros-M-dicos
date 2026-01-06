import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}

export const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onCheckedChange, 
  label,
  leftLabel = "Normal",
  rightLabel = "Avanzado"
}) => {
  return (
    <div className="flex items-center space-x-3">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium transition-colors ${!checked ? 'text-blue-600' : 'text-gray-400'}`}>
          {leftLabel}
        </span>
        
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onCheckedChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
              transition-transform duration-300 ease-in-out
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-blue-600' : 'text-gray-400'}`}>
          {rightLabel}
        </span>
      </div>
    </div>
  );
};
