import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border: 4px solid ${(props) => (props.hasError ? "red" : "green")};
`;

const FormUser = ({ onFormSubmit, onErrors }) => {
  const initialUserData = {
    pocName: "",
    pocNumber: "",
    pocEmail: "",
    pocSquadron: "",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const formErrors = {};
    if (!userData.pocName) {
      formErrors.pocName = "poc name is required.";
    }
    if (!userData.pocNumber) {
      formErrors.pocNumber = "Phone is required.";
    }
    if (!userData.pocEmail) {
      formErrors.pocEmail = "Email is required.";
    }
    if (!userData.pocSquadron) {
      formErrors.pocSquadron = "Squadron is required.";
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
    if (!userData.pocName) {
      formErrors.pocName = "Name is required.";
    }
    if (!userData.pocNumber) {
      formErrors.pocNumber = "POC Phone is required.";
    }
    if (!userData.pocEmail) {
      formErrors.pocEmail = "POC pocEmail is required.";
    }
    if (!userData.pocSquadron) {
      formErrors.pocSquadron = "Squadron is required.";
    }

    // if (Object.keys(formErrors).length === 0 && onFormSubmit) {
    onFormSubmit(userData);
    // }
  };

  return (
    <form>
      {onErrors}
      <div>
        <label htmlFor="pocName">Enter POC name:</label>
        <StyledInput
          type="text"
          id="pocName"
          name="pocName"
          value={userData.pocName}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.pocName}
          placeholder={errors.pocName || "Enter POC name"}
        />
      </div>
      <div>
        <label htmlFor="pocNumber">POC Phone Number:</label>
        <StyledInput
          type="text"
          id="pocNumber"
          name="pocNumber"
          value={userData.pocNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.pocNumber}
          placeholder={errors.pocNumber || "Enter Number"}
        />
      </div>
      <div>
        <label htmlFor="pocEmail">POC Phone Number:</label>
        <StyledInput
          type="text"
          id="pocEmail"
          name="pocEmail"
          value={userData.pocEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.pocEmail}
          placeholder={errors.pocEmail || "Enter Number"}
        />
      </div>
      <div>
        <label htmlFor="squadron">POC Squadron:</label>
        <StyledInput
          type="text"
          id="pocSquadron"
          name="pocSquadron"
          value={userData.pocSquadron}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={!!errors.pocSquadron}
          placeholder={errors.pocSquadron || "Enter POC Squadron"}
        />
      </div>
    </form>
  );
};

export default FormUser;
