import React, { useContext } from "react";
import { ConfigContext } from "../../Provider/Context.js";
import "./OtherScheduling.css";

const OtherScheduling = () => {
  const config = useContext(ConfigContext);

  return (
    <div className="PageFormat">
      <div className="InfoPanel">{config.otherSchedulingInfo}</div>
    </div>
  );
};

export default OtherScheduling;
