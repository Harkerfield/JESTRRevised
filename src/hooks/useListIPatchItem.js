// hooks/useListIPatchItem.js

import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useListIPatchItem = () => {
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

  const updateItem = async (listTitle, itemId, updatedData) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;

    try {
      const response = await fetch(url, {
        method: "POST", // Use POST for updates
        credentials: "same-origin",
        headers: {
          Accept: "application/json; odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          "IF-MATCH": "*",
          "X-RequestDigest": requestDigest,
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

export { useListIPatchItem };
