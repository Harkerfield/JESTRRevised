import React, { useState } from "react";

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
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={(e) => handleOptionClick(e, option)}
              className="dropdown-list-item"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;

// Usage example:
// <Dropdown options={['Option 1', 'Option 2', 'Option 3']} placeholder="Select an option" onChange={(selected) => console.log(selected)} />
