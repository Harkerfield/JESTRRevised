import React, { useState, useEffect } from "react";

const TimeSelector = ({ onTimeIntervalsChange, onErrors }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeIntervals, setTimeIntervals] = useState([
    {
      start: "09:00",
      end: "11:00",
    },
    {
      start: "14:00",
      end: "16:00",
    },
  ]);

  useEffect(() => {
    timeIntervals.length > 0 ? onErrors(false) : onErrors(true)
  }, [onErrors, timeIntervals])

  const addTimeInterval = (event) => {
    event.preventDefault();
    if (startTime && endTime && startTime < endTime) {
      setTimeIntervals([...timeIntervals, { start: startTime, end: endTime }]);
    } else {
      alert("times are incorrect");
    }
  };

  const deleteTimeInterval = (event, index) => {
    event.preventDefault();
    setTimeIntervals(timeIntervals.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Notify parent component of the updated time intervals
    if (onTimeIntervalsChange) {
      onTimeIntervalsChange(timeIntervals);
    }
  }, [timeIntervals, onTimeIntervalsChange]);

  return (
    <div>
      <label>
        Start Time:
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <label>
        End Time:
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <button onClick={(e) => addTimeInterval(e)}>Add Time Interval</button>

      <ul>
        {timeIntervals.map((interval, index) => (
          <li key={index}>
            {interval.start} to {interval.end}
            <button onClick={(e) => deleteTimeInterval(e, index)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeSelector;
