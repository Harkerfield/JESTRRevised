import React from "react";
// import { useCreateList, useIsCurrentUserSiteAdmin } from './hooks';
import { useIsCurrentUserSiteAdmin } from "../../hooks/useIsCurrentUserSiteAdmin.js";

const YourComponent = () => {
  const { isCurrentUserSiteAdmin } = useIsCurrentUserSiteAdmin();

  const checkAdminStatus = () => {
    isCurrentUserSiteAdmin(
      (isAdmin) => console.log(isAdmin),
      (sender, args) => console.log("An error occurred: " + args.get_message()),
    );
  };

  return (
    <div>
      <button onClick={checkAdminStatus}>Check Admin Status</button>
    </div>
  );
};

export default YourComponent;
