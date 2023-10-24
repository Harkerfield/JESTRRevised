// components/ListChecker.js
import React, { useEffect, useState, useContext } from "react";
import { useListCheckExists } from "../../hooks/useListCheckExists.js";
import { useCreateList } from "../../hooks/useCreateList.js";

import { ConfigContext } from "../../Provider/Context.js";

const ListChecker = () => {
  const config = useContext(ConfigContext);
  const { checkListsExist } = useListCheckExists();
  const [listExistenceMap, setListExistenceMap] = useState({});

  const { createList } = useCreateList();

  const handleCreateList = (event, listName) => {
    event.preventDefault();
    createList(listName, config.listColumn[listName]);
  };

  useEffect(() => {
    const checkLists = async () => {
      const existenceMap = await checkListsExist(config.lists);
      setListExistenceMap(existenceMap);
    };
    checkLists();
  }, [checkListsExist, config.lists]);

  return (
    <div>
      List of lists: {JSON.stringify(config.lists)}
      List of listExistenceMap: {JSON.stringify(listExistenceMap)}
      {Object.keys(listExistenceMap).map((listTitle) => {
        console.log(listTitle);
        let columns = config.listColumn[listTitle];
        let checker = listExistenceMap[listTitle];
        return (
          <div key={listTitle} style={{ marginBottom: "10px" }}>
            <span>{listTitle}</span>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: checker ? "green" : "red",
                display: "inline-block",
                marginLeft: "10px",
              }}
            ></div>

            <div>
              <button
                disabled={checker ? true : false}
                onClick={(e) => handleCreateList(e, listTitle, columns)}
              >
                Create {listTitle} List: {listTitle}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListChecker;
