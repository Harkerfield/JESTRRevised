import React, { useState } from 'react';
import {toPoint}  from 'mgrs';

const CoordinateConverter = () => {
    const [latInput, setLatInput] = useState('');
    const [lonInput, setLonInput] = useState('');
    const [decimalCoordinates, setDecimalCoordinates] = useState({});
    const [formatType, setFormatType] = useState('DD'); // DD, DDM, MGRS

    const convertDdmToDecimal = (ddm) => {
        const parts = ddm.match(/(\d+)[° ](\d+(\.\d+)?)/);
        if (!parts) return 'Invalid DDM format';

        const degrees = parseFloat(parts[1]);
        const minutes = parseFloat(parts[2]);

        return degrees + (minutes / 60);
    };

    const convertDdToDecimal = (dd) => {
        const value = parseFloat(dd);
        return isNaN(value) ? 'Invalid DD format' : value;
    };

    const convertMgrsToDecimal = (mgrsString) => {
        try {
            const [latitude, longitude] = toPoint.toPoint(mgrsString);
            return { latitude, longitude };
        } catch (error) {
            return 'Invalid MGRS format';
        }
    };

    const convertCoordinates = () => {
        let latDecimal, lonDecimal;

        switch (formatType) {
            case 'DD':
                latDecimal = convertDdToDecimal(latInput);
                lonDecimal = convertDdToDecimal(lonInput);
                break;
            case 'DDM':
                latDecimal = convertDdmToDecimal(latInput);
                lonDecimal = convertDdmToDecimal(lonInput);
                break;
            case 'MGRS':
                // MGRS typically represents both latitude and longitude in one string
                const mgrsResult = convertMgrsToDecimal(latInput);
                if (typeof mgrsResult === 'object') {
                    latDecimal = mgrsResult.latitude;
                    lonDecimal = mgrsResult.longitude;
                } else {
                    latDecimal = lonDecimal = mgrsResult;
                }
                break;
            default:
                latDecimal = lonDecimal = 'Unknown format';
        }

        setDecimalCoordinates({ latitude: latDecimal, longitude: lonDecimal });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        convertCoordinates();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Latitude:
                    <input
                        type="text"
                        value={latInput}
                        onChange={(e) => setLatInput(e.target.value)}
                    />
                </label>
                <label>
                    Longitude:
                    <input
                        type="text"
                        value={lonInput}
                        onChange={(e) => setLonInput(e.target.value)}
                    />
                </label>
                <select value={formatType} onChange={(e) => setFormatType(e.target.value)}>
                    <option value="DD">Decimal Degrees</option>
                    <option value="DDM">Degrees Decimal Minutes</option>
                    <option value="MGRS">Military Grid Reference System</option>
                </select>
                <button type="submit">Convert</button>
            </form>
            <p>Decimal Coordinates: Latitude: {decimalCoordinates.latitude}, Longitude: {decimalCoordinates.longitude}</p>
        </div>
    );
};

export default CoordinateConverter;
