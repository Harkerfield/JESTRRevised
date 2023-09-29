// components/ListChecker.js
import React, { useEffect, useState, useContext } from "react";
import { useCheckListExists } from "../../hooks/useCheckListExists.js";
import { ConfigContext } from "../../Provider/Context.js";

const ListChecker = () => {
  const config = useContext(ConfigContext);
  const { checkListsExist } = useCheckListExists();
  const [listExistenceMap, setListExistenceMap] = useState({});

  useEffect(() => {
    const checkLists = async () => {
      const existenceMap = await checkListsExist(config.lists);
      setListExistenceMap(existenceMap);
    };
    checkLists();
  }, [checkListsExist, config.lists]);

  return (
    <div>
      {Object.keys(listExistenceMap).map((listTitle) => (
        <div key={listTitle} style={{ marginBottom: "10px" }}>
          <span>{listTitle}</span>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: listExistenceMap[listTitle] ? "green" : "red",
              display: "inline-block",
              marginLeft: "10px",
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ListChecker;
