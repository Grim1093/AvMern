import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Dropdown({ value, onChange, options, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0, width: 0 });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (menuRef.current && menuRef.current.contains(event.target))
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleScroll = () => setIsOpen(false);
    const handleResize = () => setIsOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left,
        top: rect.bottom + window.scrollY,
        width: rect.width
      });
    }
  }, [isOpen]);

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
      
      {isOpen && createPortal(
        <ul 
          className="dropdown-menu" 
          role="listbox"
          ref={menuRef}
          style={{
            position: 'absolute',
            top: `${coords.top + 8}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`
          }}
        >
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
        </ul>,
        document.body
      )}
    </div>
  );
}
