import { useState, useCallback, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useCreateList = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSharePointList = useCallback(
    async (listName, columnData) => {
      setLoading(true);

      try {
        // Define the SharePoint site URL and list endpoint
        const siteUrl = `${config.apiBaseUrl}`;
        const listEndpoint = `${siteUrl}_api/web/lists`;

        const getDigestValue = async () => {
          const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json;odata=verbose',
              'Content-Type': 'application/json;odata=verbose',
            },
          });

          const digestData = await digestResponse.json();
          return digestData.d.GetContextWebInformation.FormDigestValue;
        };

        // Define the list metadata, including columns
        const listMetadata = {
          __metadata: { type: "SP.List" },
          BaseTemplate: 100, // Custom List template
          Title: listName, // Name of the list
        };

        // Headers for the REST API request
        const headers = {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'X-RequestDigest': await getDigestValue(), // Include the digest value
        };

        // SharePoint REST API POST request to create the list
        const listResponse = await fetch(listEndpoint, {
          method: "POST",
          credentials: "same-origin",
          headers: headers,
          body: JSON.stringify(listMetadata),
        });

        if (!listResponse.ok) {
          throw new Error(`Error creating list: ${listResponse.statusText}`);
        }

        // Initialize an array to store field internal names for the default view
        const fieldInternalNames = [];

        // Example: Add columns based on the provided columnData
        if (columnData && Array.isArray(columnData)) {
          for (const column of columnData) {

            // SharePoint REST API POST request to add the column to the list
            const columnResponse = await fetch(
              `${listEndpoint}/getbytitle('${listName}')/Fields`,
              {
                method: "POST",
                credentials: "same-origin",
                headers: headers,
                body: JSON.stringify(column),
              }
            );

            if (!columnResponse.ok) {
              throw new Error(
                `Error adding column "${column.Title}": ${columnResponse.statusText}`
              );
            }

            // Add the field internal name to the array
            fieldInternalNames.push(column.Title);
          }
        }

        // Update the "All Items" default view to include the new fields
        const viewEndpoint = `${listEndpoint}/getbytitle('${listName}')/Views/getbytitle('All%20Items')/ViewFields`;
        
        // Loop through fieldInternalNames and add them to the view
        for (const fieldName of fieldInternalNames) {
          await fetch(`${viewEndpoint}/addViewField('${fieldName}')`, {
            method: "POST",
            credentials: "same-origin",
            headers: headers,
          });
        }

      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    },
    [config.apiBaseUrl]
  );

  return { createSharePointList, loading, error };
};

export { useCreateList };
