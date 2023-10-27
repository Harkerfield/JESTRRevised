import React, { useState } from "react";

const FormUser = ({ onSetUserDataChange }) => {
  const initialUserData = {
    name: "",
    dsn: "",
    squadron: "",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(userData);
    if (Object.keys(validationErrors).length === 0) {
      if (onSetUserDataChange) {
        onSetUserDataChange(userData);
      }
      setUserData(initialUserData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = "Name is required.";
    }
    if (!data.dsn) {
      errors.dsn = "DSN is required.";
    }
    if (!data.squadron) {
      errors.squadron = "Squadron is required.";
    }
    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="dsn">DSN:</label>
        <input
          type="text"
          id="dsn"
          name="dsn"
          value={userData.dsn}
          onChange={handleChange}
        />
        {errors.dsn && <p className="error">{errors.dsn}</p>}
      </div>
      <div>
        <label htmlFor="squadron">Squadron:</label>
        <input
          type="text"
          id="squadron"
          name="squadron"
          value={userData.squadron}
          onChange={handleChange}
        />
        {errors.squadron && <p className="error">{errors.squadron}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormUser;
