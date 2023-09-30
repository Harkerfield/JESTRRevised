import React, { useContext } from "react";
import { useCreateList } from "../../hooks/useCreateList.js";
import { ConfigContext } from "../../Provider/Context.js";

const ListCreateList = () => {
  const config = useContext(ConfigContext);
  const { createList } = useCreateList();

  const colInfo = config.lists; // your column info array

  const handleCreateList = (event) => {
    event.preventDefault();
    createList("threatList", colInfo);
  };

  return (
    <div>
      <button onClick={handleCreateList}>Create List</button>
    </div>
  );
};
export default ListCreateList;
