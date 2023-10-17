import { useState, useCallback, useContext } from "react";
import { ConfigContext } from "../Provider/Context.js";

const useCreateList = () => {
  const config = useContext(ConfigContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createList = useCallback(async (listTitle, columnArrays) => {
    setLoading(true);

    // Define the SharePoint site URL and list endpoint
    const siteUrl = config.apiBaseUrl;
    const listEndpoint = `${siteUrl}/_api/web/lists`;

    // Define the list creation request body
    const listCreationPayload = {
      __metadata: {
        type: "SP.List",
      },
      Title: listTitle,
      BaseTemplate: 100, // Use 100 for a custom list
    };

    try {
      const response = await fetch(listEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
        body: JSON.stringify(listCreationPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create list: ${response.statusText}`);
      }

      // Create columns
      for (const item of columnArrays) {
        const fieldEndpoint = `${listEndpoint}/getbytitle('${listTitle}')/fields`;
        const fieldPayload = {
          __metadata: {
            type: "SP.Field",
          },
          FieldTypeKind: item.fieldType, // Set the field type as needed
          Title: item.title,
        };

        const fieldResponse = await fetch(fieldEndpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
          },
          body: JSON.stringify(fieldPayload),
        });

        if (!fieldResponse.ok) {
          throw new Error(`Failed to create column '${item.title}': ${fieldResponse.statusText}`);
        }
      }

      alert("Successfully created the list and list fields");
      setLoading(false);
    } catch (err) {
      setError("Error: " + err.message);
      setLoading(false);
    }
  }, []);

  return { createList, loading, error };
};

export { useCreateList };
