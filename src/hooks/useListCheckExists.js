import { useState, useCallback, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useListCheckExists = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkListsExist = useCallback(
    async (listTitles) => {
      setLoading(true);
      const existenceMap = {};

      try {
        // Define the SharePoint site URL
        const sharePointSiteUrl = config.apiBaseUrl;

        // Loop through the list titles and check their existence
        for (const title of listTitles) {
          const listUrl = `${sharePointSiteUrl}_api/web/lists/getbytitle('${encodeURIComponent(
            title,
          )}')`;

          const response = await fetch(listUrl, {
            method: "GET",
            credentials: "same-origin",
            headers: {
              Accept: "application/json;odata=verbose",
            },
          });

          if (response.ok) {
            existenceMap[title] = true; // List exists
          } else if (response.status === 404) {
            existenceMap[title] = false; // List does not exist
          } else {
            throw new Error(`Error checking list existence for ${title}`);
          }
        }
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
      return existenceMap;
    },
    [config.apiBaseUrl],
  );

  return { checkListsExist, loading, error };
};

export { useListCheckExists };
