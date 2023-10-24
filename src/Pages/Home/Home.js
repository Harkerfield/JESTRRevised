import React, { useContext } from "react";
import { ConfigContext } from "../../Provider/Context.js";

import "./Home.css";

const Home = () => {
  const config = useContext(ConfigContext);
  return (
    <div className="PageFormat">
      <div className="InfoPanel">{config.homeInfo}</div>
    </div>
  );
};

export default Home;
