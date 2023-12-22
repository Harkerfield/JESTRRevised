import React, { useContext } from "react";
import ListChecker from "./ListChecker.js";
import AdminChecker from "./AdminChecker.js";
import SharePointUploader from "../../hooks/SharePointUploader.js";
import { ConfigContext } from "../../Provider/Context.js";

const Debug = () => {
  const config = useContext(ConfigContext);
  return (
    <div className="PageFormat">
      <div className="PageFormat">
        {config.debugInfo.map((item, index) => {
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
      </div>
      <ListChecker />
      <AdminChecker />
      <SharePointUploader />
    </div>
  );
};

export default Debug;
