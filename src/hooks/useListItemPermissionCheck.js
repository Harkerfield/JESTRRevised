// hooks/useListItemPermissionCheck.js

import { useState, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useListItemPermissionCheck = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPermissions = async (listTitle, itemId) => {
    setLoading(true);

    try {
      const permissionsUrl = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items(${itemId})/EffectiveBasePermissions`;
      const response = await fetch(permissionsUrl, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json;odata=nometadata",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      const hasEditPermission = data.High & (1 << 28) || data.Low & (1 << 3);
      const hasFullControl = data.High & (1 << 15); // Bit for ManageWeb permission

      return {
        canEdit: hasEditPermission,
        hasFullControl: hasFullControl,
      };
    } catch (err) {
      setError(err.message);
      return { canEdit: false, hasFullControl: false };
    } finally {
      setLoading(false);
    }
  };

  return { checkPermissions, loading, error };
};

export { useListItemPermissionCheck };
