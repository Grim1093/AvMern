import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ value, onChange, options, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="custom-dropdown" ref={dropdownRef} aria-label={ariaLabel}>
      <button 
        type="button"
        className="dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption.label}
        <svg 
          className={`dropdown-icon ${isOpen ? 'open' : ''}`} 
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((option) => (
            <li 
              key={option.value}
              className={`dropdown-item ${option.value === value ? 'selected' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
