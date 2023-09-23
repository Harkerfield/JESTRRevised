import React, { useState } from 'react';

function Dropdown({ options, placeholder, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
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
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="dropdown-list-item"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .dropdown-container {
          position: relative;
          width: 150px;
          font-family: Arial, sans-serif;
        }
        .dropdown-header {
          padding: 10px;
          background: #f7f7f7;
          border: 1px solid #ccc;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dropdown-list {
          border: 1px solid #ccc;
          max-height: 150px;
          overflow-y: auto;
          position: absolute;
          width: 100%;
          z-index: 1000;
          background: #fff;
        }
        .dropdown-list-item {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .dropdown-list-item:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}

export default Dropdown;

// Usage example:
// <Dropdown options={['Option 1', 'Option 2', 'Option 3']} placeholder="Select an option" onChange={(selected) => console.log(selected)} />
