import { useState, useEffect, useContext, useMemo } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useFetchData = (listTitle) => {
  const config = useContext(ConfigContext);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compose the URL based on the provided context and list title
  const url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
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

  // Using useMemo to only recompute the data if rawData changes
  const data = useMemo(() => {
    // Any data transformation logic can go here
    return rawData;
  }, [rawData]);

  return { data, loading, error };
};

export { useFetchData };
