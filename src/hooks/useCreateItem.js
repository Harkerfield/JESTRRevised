// hooks/useCreateItem.js

import { useState, useContext } from "react";
import axios from "axios";
import { ConfigContext } from "../Provider/Context.js";

const useCreateItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItem = async (listTitle, itemData) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items`;

    try {
      const response = await axios.post(url, itemData, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "",
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

  return { createItem, loading, error };
};

export { useCreateItem };
