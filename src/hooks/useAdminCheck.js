import { useState, useCallback, useEffect, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useAdminCheck = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUserSiteAdmin, setIsCurrentUserSiteAdmin] = useState(false);

  const checkCurrentUserSiteAdmin = useCallback(async () => {
    try {
      // Use the SharePoint REST API to check if the current user is a site admin.
      const response = await fetch(`${config.apiBaseUrl}_api/web/currentuser`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json;odata=nometadata",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setIsCurrentUserSiteAdmin(data.IsSiteAdmin);
      setLoading(false);
    } catch (error) {
      setError(`Error: ${error.message}`);
      setLoading(false);
    }
  }, [config.apiBaseUrl]);

  useEffect(() => {
    checkCurrentUserSiteAdmin();
  }, [checkCurrentUserSiteAdmin]);

  return { isCurrentUserSiteAdmin, loading, error };
};

export { useAdminCheck };
