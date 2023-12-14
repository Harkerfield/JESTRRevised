import React, { useContext } from "react";
import { ConfigContext } from "../../Provider/Context.js";

import "./Home.css";

const Home = () => {
  const config = useContext(ConfigContext);
  return (
    <div className="PageFormat">
      {config.homeInfo.map((item, index) => {
        return (
          <>
            {index === 0 ?
              <div className="InfoPanel">{item}</div>
              :
              <div className="InfoContent">{item}</div>
            }</>
        )
      })}
    </div>
  );
};

export default Home;
