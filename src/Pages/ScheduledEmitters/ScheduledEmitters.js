import React, { useState, useEffect, useContext, useMemo } from "react";
import Calendar from "../../Components/Calendar/Calendar.js";

import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";
import "./ScheduledEmitters.css";
import scheduleTester from "../../testerData/scheduleTester.json"

function ScheduledEmitters() {
  const config = useContext(ConfigContext);
  const [filteredData, setFilteredData] = useState([]);

 
  const { data, loading, error } = useListGetItems(config.lists.scheduleList);

 const backupData = useMemo(
    () => 
    scheduleTester,
    [],
  );
  
  useEffect(() => {
    if (data) {
      // const filtered = data;
      //TODO create filtered data
      if (data.length > 0) {
        setFilteredData(
          data
        );
      } else if (error) {
        setFilteredData(
          backupData
        );
      }
    }
  }, [backupData, data, error]);


 

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
