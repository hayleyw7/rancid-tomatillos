import React, { useEffect, useRef, useState } from 'react';

const CustomSelect = ({ id, labelId, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(option => String(option.value) === String(value)) || options[0];

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      className={`custom-select${isOpen ? ' custom-select--open' : ''}`}
      ref={containerRef}
    >
      <button
        type='button'
        id={id}
        className='custom-select__trigger'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className='custom-select__value'>{selectedOption?.label}</span>
        <span className='custom-select__chevron' aria-hidden='true' />
      </button>

      {isOpen && (
        <ul className='custom-select__menu' role='listbox' aria-labelledby={labelId}>
          {options.map(option => {
            const isSelected = String(option.value) === String(value);

            return (
              <li key={option.value || 'all'} role='presentation'>
                <button
                  type='button'
                  role='option'
                  aria-selected={isSelected}
                  className={`custom-select__option${isSelected ? ' custom-select__option--selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
