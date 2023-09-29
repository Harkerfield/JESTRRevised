// hooks/useDeleteItem.js

import { useState, useContext } from "react";
import axios from "axios";
import { ConfigContext } from "../Provider/Context.js";

const useDeleteItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteItem = async (listTitle, itemId) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "",
          "IF-MATCH": "*",
        },
      });
      return response.data;
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
