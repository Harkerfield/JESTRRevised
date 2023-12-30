import { useState, useEffect, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";
import moment from "moment";

const useListCalendarGetItems = (listTitle, currentViewStart, currentViewEnd, isPaginated = true) => {
  const config = useContext(ConfigContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventsForCurrentView = async () => {
    const formattedStart = moment(currentViewStart).format("YYYY-MM-DDT00:00:00Z");
    const formattedEnd = moment(currentViewEnd).format("YYYY-MM-DDT23:59:59Z");
    let url = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/items?`;

    if (isPaginated) {
      url += `$filter=start ge datetime'${formattedStart}' and end le datetime'${formattedEnd}'`;
    }

    setLoading(true);

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

      const result = await response.json();
      setData(result.value);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentViewStart && currentViewEnd) {
      fetchEventsForCurrentView();
    } else if (!isPaginated) {
      // For non-paginated lists, fetch immediately without date filters
      fetchEventsForCurrentView();
    }
  }, [currentViewStart, currentViewEnd, isPaginated]);

  return { data, loading, error };
};

export { useListCalendarGetItems };
