import React, { useState, useEffect, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

function useCreateList() {
  const config = useContext(ConfigContext);
  const [listCreated, setListCreated] = useState(false);

  useEffect(() => {
    // SharePoint site URL
    const siteUrl = "config";

    // SharePoint API endpoint for list creation
    const endpointUrl = `${config.apiBaseUrl}_api/web/lists`;

    // SharePoint list properties
    const listInfo = {
      Title: "MyNewList",
      BaseTemplate: 100, // Custom List template
    };

    // SharePoint request headers
    const headers = new Headers({
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
    });

    // SharePoint authentication headers (you may need to adjust for your SharePoint setup)
    headers.append("Authorization", "Bearer YOUR_ACCESS_TOKEN");

    // Fetch X-RequestDigest token
    fetch(`${siteUrl}_api/contextinfo`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        const requestDigest = data.d.GetContextWebInformation.FormDigestValue;

        // Use the obtained X-RequestDigest to create the SharePoint list
        headers.append("X-RequestDigest", requestDigest);

        // Create the SharePoint list
        fetch(endpointUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(listInfo),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("List created:", data);
            setListCreated(true);
          })
          .catch((error) => {
            console.error("Error creating list:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching X-RequestDigest:", error);
      });
  }, []);

  return (
    <div>
      {listCreated ? (
        <p>SharePoint list created successfully!</p>
      ) : (
        <p>Creating SharePoint list...</p>
      )}
    </div>
  );
}

export { useCreateList };
