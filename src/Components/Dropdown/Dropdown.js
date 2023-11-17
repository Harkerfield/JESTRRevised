import React, { useState } from "react";
import './Dropdown.css';

function Dropdown({ options, placeholder, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (event, option) => {
    event.preventDefault();
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };
  
  return (
    <div className="dropdown-container">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOption || placeholder}
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <p className="dropdown-list">
          {options.map((option, index) => (
            <p
              key={index}
              onClick={(e) => handleOptionClick(e, option)}
              className="dropdown-list-item"
            >
              {option}
            </p>
          ))}
        </p>
      )}
    </div>
  );
}

export default Dropdown;

// Usage example:
// <Dropdown options={['Option 1', 'Option 2', 'Option 3']} placeholder="Select an option" onChange={(selected) => console.log(selected)} />
