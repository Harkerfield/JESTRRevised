import { useState, useEffect, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useListGetItems = (listTitle) => {
  const config = useContext(ConfigContext);
  const [rawData, setRawData] = useState([]);
  const [transformedData, setTransformedData] = useState([]); // State for transformed data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compose the URL based on the provided context and list title
  const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "same-origin",
          headers: {
            Accept: "application/json;odata=nometadata",
            Prefer: 'odata.include-annotations="none"',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setRawData(data.value);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    // Any data transformation logic can go here
    // For example, you could map, filter, or otherwise process the rawData
    const transformed = rawData; // Replace this with actual transformation logic
    setTransformedData(transformed);
  }, [rawData]);

  return { data: transformedData, loading, error };
};

export { useListGetItems };
