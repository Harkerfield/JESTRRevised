import React, { useState, useEffect, useContext } from "react";
import Calendar from "../../Components/Calendar/Calendar.js";
import { useListCalendarGetItems } from "../../hooks/useListCalendarGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";
import "./ScheduledEmitters.css";
import scheduleTester from "../../testerData/scheduleTester.json";

function ScheduledEmitters() {
  const config = useContext(ConfigContext);

  const [backupData, setBackupData] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Updated to include date range in the hook call
  const { data, loading, error } = useListCalendarGetItems(config.lists.scheduleList, dateRange.start, dateRange.end);

  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setBackupData(scheduleTester);
  }, []);

  const handleDateRangeChange = (start, end) => {
    // Update the state that stores the current date range
    setDateRange({ start, end });
  };

  useEffect(() => {
    if (data && !loading) {
      if (data.length > 0) {
        setFilteredData(data);
      } else if (error) {
        setFilteredData(backupData);
      }
    }
  }, [backupData, data, loading, error]);


  return (
    <div className="PageFormat">
      {config.viewScheduledEmittersInfo.map((item, index) => {
        return (
          <>
            {index === 0 ? (
              <div className="InfoPanel">{item}</div>
            ) : (
              <div className="InfoContent">{item}</div>
            )}
          </>
        );
      })}

      <Calendar
        data={filteredData}
        loading={loading}
        error={error}
        onDateRangeChange={handleDateRangeChange} // Passing the handler to the Calendar component
      />
    </div>
  );
}

export default ScheduledEmitters;
