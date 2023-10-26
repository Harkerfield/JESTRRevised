import React, { useState, useContext, useEffect } from "react";
import { useListCheckExists } from "../../hooks/useListCheckExists.js";
import { useCreateList } from "../../hooks/useCreateList.js"; // Update the import path

import { ConfigContext } from "../../Provider/Context.js";

const ListChecker = () => {
  const config = useContext(ConfigContext);
  const [listTitlesToCheck, setListTitlesToCheck] = useState(config.lists);
  // Call the custom hook to get the createList function, loading, and error
  const { createSharePointList, loadingCreate, errorCreate } = useCreateList();

  // Call the custom hook to get the checkListsExist function, loading, and error
  const { checkListsExist, loading, error } = useListCheckExists();

  const [existenceMap, setExistenceMap] = useState({});

  useEffect(() => {
    const checkListExistence = async () => {
      const listTitles = Object.keys(listTitlesToCheck);
      const result = await checkListsExist(listTitles);
      setExistenceMap(result);
    };

    checkListExistence();
  }, [checkListsExist, listTitlesToCheck]);

  // Function to create a list when the button is clicked
  const handleCreateList = async (event, listTitle) => {
    event.preventDefault();
    // You can customize this based on your requirements
    const columnArrays = config.listColumn[listTitle];
    
    await createSharePointList(listTitle, columnArrays);
    
    // After the list is created, you can perform additional actions if needed
  };

  return (
    <div>
      <h1>List Existence Checker</h1>
      {Object.keys(listTitlesToCheck).map((listTitle) => (
        <div key={listTitle} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>{listTitle}</div>
          {existenceMap[listTitle] ? (
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "green",
                marginRight: "10px",
              }}
            ></div>
          ) : (
            <>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  marginRight: "10px",
                  marginLeft: "5px",
                }}
              ></div>
              <button
                onClick={(e) => handleCreateList(e, listTitle)}
                disabled={loading} // Disable the button while creating the list
              >
                Create List
              </button>
              {loadingCreate && <p>Creating list...</p>}
              {errorCreate && <p>Error: {errorCreate}</p>}
            </>
          )}
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ListChecker;
