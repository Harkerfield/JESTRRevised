/* global SP */
/* global _spPageContextInfo */
import React, { useEffect, useState } from "react";

// React Component
function SharePointData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Check if SP is loaded properly
    if (window.SP && window.SP.ClientContext) {
      const ctx = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
      const web = ctx.get_web();
      ctx.load(web);

      ctx.executeQueryAsync(
        () => {
          setData(web.get_title());
        },
        (sender, args) => {
          console.error("Request failed: ", args.get_message());
          // Set mock data if the request fails
          setData("Mock SharePoint Web Title");
        },
      );
    } else {
      console.error("SP.js failed to load");
      // Set mock data if SP.js fails to load
      setData("Mock SharePoint Web Title");
    }
  }, []);

  return <></>;
}

export default SharePointData;
