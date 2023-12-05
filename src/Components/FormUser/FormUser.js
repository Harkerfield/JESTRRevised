import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border: 4px solid ${props => props.hasError ? 'red' : 'green'};
`;

const FormUser = ({ onFormSubmit, onErrors }) => {
  const initialUserData = {
    name: "",
    dsn: "",
    squadron: "",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [errors, setErrors] = useState({});


  useEffect(() => {

    const formErrors = {};
    if (!userData.name) {
      formErrors.name = "Name is required.";
    }
    if (!userData.dsn) {
      formErrors.dsn = "DSN is required.";
    }
    if (!userData.squadron) {
      formErrors.squadron = "Squadron is required.";
    }

    setErrors(formErrors);
    if (onErrors) {
      onErrors(Object.keys(formErrors).length > 0);
      //truthey falsey
    }
  }, [onErrors, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleBlur = () => {

    const formErrors = {};
    if (!userData.name) {
      formErrors.name = "Name is required.";
    }
    if (!userData.dsn) {
      formErrors.dsn = "DSN is required.";
    }
    if (!userData.squadron) {
      formErrors.squadron = "Squadron is required.";
    }

    // if (Object.keys(formErrors).length === 0 && onFormSubmit) {
      onFormSubmit(userData);
    // }
  };


  return (
    <form>
      {onErrors}
      test
      <div>
        <label htmlFor="name">Name:</label>
        <StyledInput
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.name}
          placeholder={errors.name || "Enter name"}
        />
      </div>
      <div>
        <label htmlFor="dsn">DSN:</label>
        <StyledInput
          type="text"
          id="dsn"
          name="dsn"
          value={userData.dsn}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.dsn}
          placeholder={errors.dsn || "Enter DSN"}
        />
      </div>
      <div>
        <label htmlFor="squadron">Squadron:</label>
        <StyledInput
          type="text"
          id="squadron"
          name="squadron"
          value={userData.squadron}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.squadron}
          placeholder={errors.squadron || "Enter Squadron"}
        />
      </div>
    </form>
  );
};

export default FormUser;
