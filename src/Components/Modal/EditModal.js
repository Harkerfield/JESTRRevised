import React, {useState} from "react";

const EditModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data);
  
    const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };
  
    const handleSave = () => {
      // Perform validation here
      if (isValid(formData)) {
        onSave(formData);
        onClose();
      } else {
        alert('Invalid input'); // or some better feedback for the user
      }
    };
  
    const isValid = (data) => {
      // Validation logic here
      return true; // Return true if valid, false if not
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          {Object.keys(data).map(key => (
            <div key={key}>
              <label>{key}</label>
              {/* <input value={formData[key] || ''} onChange={(e) => handleChange(key, e.target.value)} /> */}
            </div>
          ))}
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  };
  export default EditModal