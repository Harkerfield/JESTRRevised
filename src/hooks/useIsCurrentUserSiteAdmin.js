/* global SP */
// hooks/useIsCurrentUserSiteAdmin.js

import { useState, useCallback } from "react";

const useIsCurrentUserSiteAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isCurrentUserSiteAdmin = useCallback(async (OnSuccess, OnError) => {
    setLoading(true);
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();
    context.load(user);

    context.executeQueryAsync(
      function () {
        var isSiteAdmin = user.get_isSiteAdmin();
        OnSuccess(isSiteAdmin);
        setLoading(false);
      },
      function (sender, args) {
        OnError(sender, args);
        setError("Error: " + args.get_message());
        setLoading(false);
      },
    );
  }, []);

  return { isCurrentUserSiteAdmin, loading, error };
};

export { useIsCurrentUserSiteAdmin };
