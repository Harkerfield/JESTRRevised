// hooks/useListDeleteItem.js

import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useListDeleteItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestDigest, setRequestDigest] = useState("");

  useEffect(() => {
    // Fetch the __REQUESTDIGEST value from SharePoint
    const getRequestDigest = async () => {
      try {
        const digestUrl = `${config.apiBaseUrl}_api/contextinfo`;
        const digestResponse = await fetch(digestUrl, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
          },
        });
        const digestData = await digestResponse.json();
        setRequestDigest(digestData.d.GetContextWebInformation.FormDigestValue);
      } catch (error) {
        console.error("Error fetching __REQUESTDIGEST:", error);
      }
    };

    getRequestDigest();
  }, []);

  const deleteItem = async (listTitle, itemId) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json; odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          "X-RequestDigest": requestDigest,
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
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

export { useListDeleteItem };
