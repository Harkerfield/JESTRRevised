// hooks/useUpdateItem.js

import { useState, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useUpdateItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateItem = async (listTitle, itemId, updatedData) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;

    try {
      const response = await fetch(url, {
        method: "POST", // Use POST for updates
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateItem, loading, error };
};

export { useUpdateItem };
