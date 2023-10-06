import React, { useState, useCallback } from 'react';
import { useIsCurrentUserSiteAdmin } from "../../hooks/useIsCurrentUserSiteAdmin.js";

const SiteAdminCheck = () => {
  const { isCurrentUserSiteAdmin, loading, error } = useIsCurrentUserSiteAdmin();

  const [isSiteAdmin, setIsSiteAdmin] = useState(null);

  const handleSuccess = useCallback((isAdmin) => {
    setIsSiteAdmin(isAdmin);
  }, []);

  const handleError = useCallback((sender, args) => {
    console.error('Error:', args.get_message());
  }, []);

  const checkAdminStatus = (event) => {
    event.preventDefault();
    isCurrentUserSiteAdmin(handleSuccess, handleError);
  };

  return (
    <div>
      <button onClick={e => checkAdminStatus(e)}>
        Check if Current User is Site Admin
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {isSiteAdmin !== null && (
        <p>The current user is {isSiteAdmin ? 'a Site Admin' : 'not a Site Admin'}.</p>
      )}
    </div>
  );
};

export default SiteAdminCheck;
