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



        // After creating the list, get the list's default view
        const getListViewResponse = await fetch(
          `${listEndpoint}/getbytitle('${listName}')/DefaultView`,
          {
            method: "GET",
            credentials: "same-origin",
            headers: headers,
          }
        );

        if (!getListViewResponse.ok) {
          throw new Error(`Error getting the list's default view: ${getListViewResponse.statusText}`);
        }

        const listViewData = await getListViewResponse.json();




        // Example: Add columns based on the provided columnData
        if (columnData && Array.isArray(columnData)) {
          for (const column of columnData) {
            console.log("columnData", column)
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
                `Error adding column "${column.title}": ${columnResponse.statusText}`
              );
            }


            // Add the field to the default view
            const fieldInternalName = column.Title; // Adjust this based on the column data
            listViewData.ViewFields.FieldRef.push({ Name: fieldInternalName });

            // Update the default view with the modified view data
            const updateViewResponse = await fetch(
              `${listEndpoint}/getbytitle('${listName}')/DefaultView`,
              {
                method: "POST",
                credentials: "same-origin",
                headers: headers,
                body: JSON.stringify(listViewData),
              }
            );

            if (!updateViewResponse.ok) {
              throw new Error(
                `Error updating the default view: ${updateViewResponse.statusText}`
              );
            }





          }
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
