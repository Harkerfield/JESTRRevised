import React from "react";
// import { useCreateList, useIsCurrentUserSiteAdmin } from './hooks';
import { useIsCurrentUserSiteAdmin } from "../../hooks/useIsCurrentUserSiteAdmin.js";

const YourComponent = () => {
  const { isCurrentUserSiteAdmin } = useIsCurrentUserSiteAdmin();

  const checkAdminStatus = (event) => {
     event.preventDefault();
    isCurrentUserSiteAdmin(
      (isAdmin) => isAdmin,
      (sender, args) => console.log("An error occurred: " + args.get_message()),
    );
  };

  return (
    <div>
      Is Admin: {checkAdminStatus}
    </div>
  );
};

export default YourComponent;
