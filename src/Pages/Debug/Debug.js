import React from "react";
import ListChecker from "./ListChecker.js";
import ListCreateList from "./ListCreateList.js";
import AdminChecker from "./AdminChecker.js";

const Debug = () => {
  return (
    <div>
      <ListChecker />
      <ListCreateList />
      <AdminChecker />
    </div>
  );
};

export default Debug;
