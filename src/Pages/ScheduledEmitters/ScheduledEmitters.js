import React, { useState, useEffect, useContext } from "react";
import Calendar from "../../Components/Calendar/Calendar.js";
import { ConfigContext } from "../../Provider/Context.js";
import "./ScheduledEmitters.css";

function ScheduledEmitters() {
  const config = useContext(ConfigContext);
  return (
    <div className="PageFormat">
      <div className="InfoPanel">{config.emmiterSchedulingInfo}</div>
      <Calendar />
    </div>
  );
}

export default ScheduledEmitters;
