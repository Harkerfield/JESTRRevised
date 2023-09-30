import React from "react";
import ListChecker from "./ListChecker.js";
import ListCreateList from "./ListCreateList.js";
import AdminChecker from "./AdminChecker.js";
import SharePointData from "./SharePointData.js";

const Debug = () => {
  return (
    <div>
      <ListChecker />
      <ListCreateList />
      <AdminChecker />
      <SharePointData/>
    </div>
  );
};

export default Debug;
