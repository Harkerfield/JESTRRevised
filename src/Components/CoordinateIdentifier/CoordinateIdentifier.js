import React, { useState } from "react";

const CoordinateIdentifier = () => {
  const [inputValue, setInputValue] = useState("");
  const [format, setFormat] = useState("");
  const [feedback, setFeedback] = useState("");
  const [convertedDD, setConvertedDD] = useState(null);

  const dmsToDD = (dms) => {
    const matches = dms.match(/(\d{1,3})°(\d{1,2})'(\d{1,2})"([NS])/);
    if (!matches) return null;

    const degrees = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = parseInt(matches[3], 10);
    const direction = matches[4];

    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === "S" || direction === "W") dd = -dd;

    return dd;
  };

  const identifyAndConvert = (input) => {
    const dmsPattern =
      /^(\d{1,3}°\d{1,2}'\d{1,2}"[NS]),\s*(\d{1,3}°\d{1,2}'\d{1,2}"[EW])$/;

    if (dmsPattern.test(input)) {
      const [latDMS, lonDMS] = input.split(",");
      const latDD = dmsToDD(latDMS);
      const lonDD = dmsToDD(lonDMS);

      if (latDD !== null && lonDD !== null) {
        setConvertedDD([latDD, lonDD]);
        return "Degrees, Minutes, Seconds (DMS)";
      }
    }

    // ... Other patterns ...

    return "Unknown";
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    const identifiedFormat = identifyAndConvert(e.target.value);
    setFormat(identifiedFormat);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter coordinates"
      />
      <div>Format: {format}</div>
      {convertedDD && (
        <div>
          Converted to DD: {convertedDD[0]}, {convertedDD[1]}
        </div>
      )}
      <div>{feedback}</div>
    </div>
  );
};

export default CoordinateIdentifier;
