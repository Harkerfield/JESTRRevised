import React, { useContext } from "react";
import ListChecker from "./ListChecker.js";
import AdminChecker from "./AdminChecker.js";
import SharePointUploader from "../../hooks/SharePointUploader.js";
import { ConfigContext } from "../../Provider/Context.js";

const Debug = () => {
  const config = useContext(ConfigContext);
  return (
    <div className="PageFormat">
      <div className="InfoPanel">{config.debugInfo}</div>
      <ListChecker />
      <AdminChecker />
      <SharePointUploader />
    </div>
  );
};

export default Debug;
