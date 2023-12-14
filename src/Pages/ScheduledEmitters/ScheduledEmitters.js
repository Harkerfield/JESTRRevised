import React, { useState, useEffect, useContext } from "react";
import Calendar from "../../Components/Calendar/Calendar.js";

import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";
import "./ScheduledEmitters.css";

function ScheduledEmitters() {
  const config = useContext(ConfigContext);

  const { data, loading, error } = useListGetItems(config.lists.scheduleList);

  return (
    <div className="PageFormat">
      
      {config.viewScheduledEmittersInfo.map((item, index) => {

        return (
          <>
            {index === 0 ?
              <div className="InfoPanel">{item}</div>
              :
              <div className="InfoContent">{item}</div>
            }</>
        )
      })}

      <Calendar data={data} loading={loading} error={error} />
    </div>
  );
}

export default ScheduledEmitters;
