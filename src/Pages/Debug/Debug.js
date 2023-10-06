import React from "react";
import ListChecker from "./ListChecker.js";
import AdminChecker from "./AdminChecker.js";
import SharePointData from "./SharePointData.js";
import SharePointUploader from "../../hooks/SharePointUploader.js";
const Debug = () => {
  return (
    <div>
      <ListChecker />
      <AdminChecker />
      <SharePointData />
      <SharePointUploader />
    </div>
  );
};

export default Debug;
