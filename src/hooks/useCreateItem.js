import { useState, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useCreateItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItem = async (listTitle, itemData) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
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

  return { createItem, loading, error };
};

export { useCreateItem };
