import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useListCreateItem = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestDigest, setRequestDigest] = useState("");

  useEffect(() => {
    // Fetch the __REQUESTDIGEST value from SharePoint
    const getRequestDigest = async () => {
      try {
        const digestUrl =
          "https://intelshare.intelink.gov/sites/354RANS/JESTR/_api/contextinfo";
        const digestResponse = await fetch(digestUrl, {
          method: "POST",
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

  const createItem = async (listTitle, itemData) => {
    setLoading(true);
    const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          "X-RequestDigest": requestDigest,
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

export { useListCreateItem };
