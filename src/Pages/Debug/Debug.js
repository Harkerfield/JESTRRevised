import React from "react";
import ListChecker from "./ListChecker.js";
import AdminChecker from "./AdminChecker.js";
import SharePointUploader from "../../hooks/SharePointUploader.js";
const Debug = () => {
  return (
    <div>
      <ListChecker />
      <AdminChecker />
      <SharePointUploader />
    </div>
  );
};

export default Debug;
