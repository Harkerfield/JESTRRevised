import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent'; // Import your MapComponent

const CoordinateInputComponent = () => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [points, setPoints] = useState([]);

  // Function to handle coordinate input
  const handleCoordinateInput = (e) => {
    const { name, value } = e.target;
    setCoordinates({ ...coordinates, [name]: parseFloat(value) });
  };

  // Function to update points on the map
  useEffect(() => {
    const point = {
      pointLocationLon: coordinates.lon,
      pointLocationLat: coordinates.lat,
      Title: 'Selected Point'
    };
    setPoints([point]);
  }, [coordinates]);

  // Function to handle map point changes
  const handleMapPointChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  return (
    <div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          name="lat"
          value={coordinates.lat}
          onChange={handleCoordinateInput}
        />
        <label>Longitude:</label>
        <input
          type="number"
          name="lon"
          value={coordinates.lon}
          onChange={handleCoordinateInput}
        />
      </div>
      <MapComponent points={points} onCoordinateChange={handleMapPointChange} />
    </div>
  );
};

export default CoordinateInputComponent;
