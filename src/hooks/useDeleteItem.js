// hooks/useDeleteItem.js

import { useState, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useDeleteItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteItem = async (listTitle, itemId) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "",
          "IF-MATCH": "*",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item.");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
};

export { useDeleteItem };
