import React, { useState } from 'react';

const TimeSelector = () => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [timeIntervals, setTimeIntervals] = useState([]);

    const addTimeInterval = () => {
        if (startTime && endTime && startTime < endTime) {
            setTimeIntervals([...timeIntervals, { start: startTime, end: endTime }]);
        } else{
            alert('tiems are incorrect')
        }
    };

    const deleteTimeInterval = (index) => {
        setTimeIntervals(timeIntervals.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label>
                Start Time:
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label>
                End Time:
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>
            <button onClick={addTimeInterval}>Add Time Interval</button>

            <ul>
                {timeIntervals.map((interval, index) => (
                    <li key={index}>
                        {interval.start} to {interval.end}
                        <button onClick={() => deleteTimeInterval(index)}>X</button>
                    </li>
                ))}
            </ul>

            {/* For demonstration purposes: */}
            <pre>{JSON.stringify(timeIntervals, null, 2)}</pre>
        </div>
    );
};

export default TimeSelector;
