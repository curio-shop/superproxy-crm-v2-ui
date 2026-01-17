import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

interface CurrencyDropdownProps {
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (value: string) => void;
  icon?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function CurrencyDropdown({
  value,
  options,
  onChange,
  icon,
  label,
  placeholder,
  className = '',
  isOpen: externalIsOpen,
  onOpenChange,
}: CurrencyDropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Normalize options to always have value and label
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder || 'Select';

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group whitespace-nowrap"
      >
        {icon && (
          <Icon
            icon={icon}
            width="16"
            className="text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0"
          />
        )}
        {label && <span className="text-xs font-medium text-slate-500 flex-shrink-0">{label}</span>}
        <span className="text-sm font-semibold text-slate-700 flex-shrink-0">{displayText}</span>
        <Icon
          icon="solar:alt-arrow-down-linear"
          width="14"
          className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[160px] rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 shadow-2xl shadow-slate-900/30 overflow-hidden z-50">
          <div className="py-1">
            {normalizedOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'text-white hover:bg-slate-600/60'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Icon icon="solar:check-circle-bold" width="16" className="text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
