import React, { useState, useEffect } from 'react';
import { getDistance } from 'geolib';

const DistanceBetweenArrays = ({ places1, places2 }) => {
  const [output, setOutput] = useState([]);

  useEffect(() => {
    let tempOutput = [];

    places1.forEach(placeA => {
      places2.forEach(placeB => {
        const distanceInMeters = getDistance(
          { latitude: placeA.latitude, longitude: placeA.longitude },
          { latitude: placeB.latitude, longitude: placeB.longitude }
        );
        
        const distanceInFeet = distanceInMeters * 3.28084;

        tempOutput.push({
          start: placeA.title,
          end: placeB.title,
          distance: `${distanceInFeet.toFixed(2)} ft`
        });
      });
    });

    setOutput(tempOutput);
  }, [places1, places2]);

  return (
    <div>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
};

export default DistanceBetweenArrays;
