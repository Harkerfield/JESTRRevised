import React, { useState, useContext, useEffect } from "react";
import ListNoCheckBox from "../../Components/ListNoCheckBox/ListNoCheckBox.js";

import { useListDeleteItem } from "../../hooks/useListDeleteItem.js";


import ThreatTable from './ThreatTable.js';
import MovableTable from './MovableTable.js';


import { ConfigContext } from "../../Provider/Context.js";

import CollapsibleHeader from "../../Components/HeaderHorizontal/HeaderHorizontal.js"


function Admin() {
  const config = useContext(ConfigContext);
  const [selectedEdit, setSelectedEdit] = useState([]);




  const threatHandleEdit = (e, rowData) => {
    e.preventDefault();
    // Logic to handle edit
    console.log("Edit:", rowData);
    setSelectedEdit(rowData);
  };

  const movableHandleEdit = (e, rowData) => {
    e.preventDefault();
    // Logic to handle edit
    console.log("Edit:", rowData);
    setSelectedEdit(rowData);
  };


  const { deleteItem, loading, error } = useListDeleteItem();


  const threatHandleDelete = async (itemId) => {

    console.log("Delete:", itemId);
    try {
      await deleteItem(config.lists.threatList, itemId);
      return true; // Indicate successful deletion
    } catch (err) {
      console.error(err);
      return false;
    }

  };

  // if (window.confirm("Are you sure you want to delete this item?")) {
  //   await deleteItem(config.lists.threatList, rowData.ID);
  //   // You might also want to refresh the threatDataGET or handle the UI change after deletion
  // }

  const movableHandleDelete = async (itemId) => {
    console.log("Delete:", itemId);
    try {
      await deleteItem(config.lists.movableThreatList, itemId);
      return true; // Indicate successful deletion
    } catch (err) {
      console.error(err);
      return false;
    }
  };



  return (
    <div className="PageFormat">
      <div>
        {config.adminInfo.map((item, index) => {
          return (
            <>
              {index === 0 ? (
                <div className="InfoPanel">{item}</div>
              ) : (
                <div className="InfoContent">{item}</div>
              )}
            </>
          );
        })}
      </div>
      <CollapsibleHeader>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            console.log("not integrated yet.")
          }}
        >
          Add Emitter or Static
        </button>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            console.log("Not integrated yet.")
          }}
        >
          Add Movable Threat
        </button>

      </CollapsibleHeader>


      <ThreatTable
        onEdit={threatHandleEdit}
        onDelete={threatHandleDelete}
      />

      <MovableTable
        onEdit={movableHandleEdit}
        onDelete={movableHandleDelete}
      />


    </div>
  );
}

export default Admin;
