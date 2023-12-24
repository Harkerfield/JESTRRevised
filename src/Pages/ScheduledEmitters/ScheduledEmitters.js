import React, { useState, useEffect, useContext } from "react";
import Calendar from "../../Components/Calendar/Calendar.js";

import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";
import "./ScheduledEmitters.css";
import scheduleTester from "../../testerData/scheduleTester.json";

function ScheduledEmitters() {
  const config = useContext(ConfigContext);

  const [backupData, setBackupData] = useState([]);

  const { data, loading, error } = useListGetItems(config.lists.scheduleList);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setBackupData(scheduleTester);
  }, []);

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

      <Calendar data={filteredData} loading={loading} error={error} />
    </div>
  );
}

export default ScheduledEmitters;
