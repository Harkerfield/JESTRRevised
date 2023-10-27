import React, { useState, useContext, useEffect } from "react";
import { useListCheckExists } from "../../hooks/useListCheckExists.js";
import { useCreateList } from "../../hooks/useCreateList.js"; // Update the import path
import { useListCreateItem } from "../../hooks/useListCreateItem.js"

import { ConfigContext } from "../../Provider/Context.js";

const ListChecker = () => {
  const config = useContext(ConfigContext);
  const [listTitlesToCheck, setListTitlesToCheck] = useState(config.lists);
  // Call the custom hook to get the createList function, loading, and error
  const { createSharePointList, loadingCreateList, errorCreateList } = useCreateList();

  // Call the custom hook to get the checkListsExist function, loading, and error
  const { checkListsExist, loadingCheckListsExist, errorCheckListsExist } = useListCheckExists();

  const [existenceMap, setExistenceMap] = useState({});






  const [itemData, setItemData] = useState({
    // Initialize with your item's properties
    Title: "TestData"
    // Add other properties here
  });

  // Initialize the hook
  const { createItem, loadingCreateItem, errorCreateItem } = useListCreateItem();

  const handleAddItemtoList = async (event, listTitle) => {
    event.preventDefault();
    // Call the createItem function to add the item
    const newItem = await createItem(listTitle, itemData);

    if (newItem) {
      // Handle success, e.g., clear form fields or show a success message
      console.log("Item added successfully:", newItem);
    } else {
      // Handle error, e.g., display an error message
      console.error("Error adding item:", errorCreateItem);
    }
  };








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
            <><div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "green",
                marginRight: "10px",
              }}
            ></div>
              <button onClick={(e) => handleAddItemtoList(e, listTitle)}>Add "Title" test to Title</button>
              {loadingCreateItem && <p>Adding item...</p>}
              {errorCreateItem && <p>Error: {errorCreateItem}</p>}
            </>
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
                disabled={loadingCreateList} // Disable the button while creating the list
              >
                Create List
              </button>
              {loadingCreateList && <p>Creating list...</p>}
              {errorCreateList && <p>Error: {errorCreateList}</p>}
            </>
          )}
        </div>
      ))}
      {loadingCheckListsExist && <p>Loading...</p>}
      {errorCheckListsExist && <p>Error: {errorCheckListsExist}</p>}
    </div>
  );
};

export default ListChecker;
