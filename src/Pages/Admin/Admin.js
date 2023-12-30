import React, { useState, useContext, useEffect } from "react";
import { useListDeleteItem } from "../../hooks/useListDeleteItem.js";
import { useListIPatchItem } from "../../hooks/useListIPatchItem.js"
import { useListCreateItem } from "../../hooks/useListCreateItem.js"
import ThreatTable from './ThreatTable.js';
import MovableTable from './MovableTable.js';
import { ConfigContext } from "../../Provider/Context.js";
import CollapsibleHeader from "../../Components/HeaderHorizontal/HeaderHorizontal.js"
import ModalChildren from "../../Components/Modal/ModalChildren.js"; // Your modal component

function Admin() {
  const config = useContext(ConfigContext);
  const [selectedEdit, setSelectedEdit] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentListName, setCurrentListName] = useState("");

  const { updateItem, updateLoading, updateError } = useListIPatchItem(); // Use the custom hook
  const { createItem, createItemLoading, createItemError } = useListCreateItem(); // Use the custom hook

  const [threatRefreshData, setThreatRefreshData] = useState(null);
  const [mobileRefreshData, setMobileRefreshData] = useState(null);


  const [mobileViewType, setModalViewType] = useState(null);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // useEffect(()=>{
  //   console.log(selectedEdit)
  // },[selectedEdit])

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const listName = currentListName === 'threatList' ? config.lists.threatList : config.lists.movableThreatList;
    try {
      const result = await updateItem(listName, selectedEdit.Id, selectedEdit)
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      if (!updateError) {
        console.log("Item updated successfully");
        if (currentListName === 'threatList') {
          setThreatRefreshData(selectedEdit);
        } else {
          setMobileRefreshData(selectedEdit);
        }
      }
      closeEditModal();
      setModalViewType(null);
    }
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const listName = currentListName === 'threatList' ? config.lists.threatList : config.lists.movableThreatList;
    try {
      const result = await createItem(listName, selectedEdit)
      console.log(result)
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      if (!createItemError) {
        console.log("Item updated successfully");
        if (currentListName === 'threatList') {
          setThreatRefreshData(selectedEdit);
        } else {
          setMobileRefreshData(selectedEdit);
        }
      }
      closeEditModal();
      setModalViewType(null);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (mobileViewType === "edit") {
      handleEditSubmit(event);
    }
    else if (mobileViewType === "create") {
      handleCreateSubmit(event);
    }
  }

  const handleChange = (e) => {
    e.preventDefault();
    setSelectedEdit({ ...selectedEdit, [e.target.name]: e.target.value });
  };


  const threatHandleEdit = (e, rowData) => {
    e.preventDefault();
    setSelectedEdit(rowData);
    setCurrentListName(config.lists.threatList);
    setModalViewType('edit')
    setIsEditModalOpen(true);
    console.log("Edit:", rowData);

  };

  const movableHandleEdit = (e, rowData) => {
    e.preventDefault();
    setSelectedEdit(rowData);
    setCurrentListName(config.lists.movableThreatList);
    setModalViewType('edit');
    setIsEditModalOpen(true);

    console.log("Edit:", rowData);
  };

  const threatHandleCreate = (e) => {
    e.preventDefault();
    setSelectedEdit([]);
    setCurrentListName(config.lists.threatList);
    setModalViewType('create');
    setIsEditModalOpen(true);
    console.log("Create:", "todo");
  };

  const movableHandleCreate = (e) => {
    e.preventDefault();
    setSelectedEdit([]);
    setCurrentListName(config.lists.movableThreatList);
    setModalViewType('create');;
    setIsEditModalOpen(true);
    console.log("Create:", "todo");
  };

  const { deleteItem, deleteLoading, deleteError } = useListDeleteItem();

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
          style={{ height: "50px", backgroundColor: "green", color: "black" }}
          onClick={threatHandleCreate}
        >
          Add Emitter or Static
        </button>
        <button
          className="navButton"
          style={{ height: "50px", backgroundColor: "green", color: "black" }}
          onClick={movableHandleCreate}
        >
          Add Movable Threat
        </button>

      </CollapsibleHeader>


      <ThreatTable
        onEdit={threatHandleEdit}
        onDelete={threatHandleDelete}
        refreshData={threatRefreshData}
        setRefreshData={setThreatRefreshData}
      />

      <br></br>

      <MovableTable
        onEdit={movableHandleEdit}
        onDelete={movableHandleDelete}
        refreshData={mobileRefreshData}
        setRefreshData={setMobileRefreshData}
      />


      {isEditModalOpen && (
        <ModalChildren onClose={closeEditModal}>

          <form onSubmit={handleSubmit} >

            {currentListName === 'threatList' && (
              // Fields specific to 'threat'
              <>
                <div>
                  <label>Serial Number</label>
                  <input type="text" name="serialNumber" value={selectedEdit.serialNumber || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>System Type</label>
                  <input type="text" name="systemType" value={selectedEdit.systemType || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Schedulable Item</label>
                  <select name="schedulableItem" value={selectedEdit.schedulableItem || ''} onChange={handleChange}>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div>
                  <label>Location</label>
                  <input type="text" name="location" value={selectedEdit.location || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Range</label>
                  <input type="text" name="range" value={selectedEdit.range || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Latitude</label>
                  <input type="text" name="pointLocationLat" value={selectedEdit.pointLocationLat || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Longitude</label>
                  <input type="text" name="pointLocationLon" value={selectedEdit.pointLocationLon || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Altitude</label>
                  <input type="text" name="pointLocationAlt" value={selectedEdit.pointLocationAlt || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Device Type</label>
                  <input type="text" name="deviceType" value={selectedEdit.deviceType || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Threat</label>
                  <input type="text" name="threat" value={selectedEdit.threat || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Maintenance Condition</label>
                  <select name="mxCondition" value={selectedEdit.mxCondition || ''} onChange={handleChange}>
                  <option value="RED">RED</option>
                    <option value="GREEN">GREEN</option>
                    <option value="YELLOW">YELLOW</option>
                  </select>
                </div>
                <div>
                  <label>Status</label>
                  <input type="text" name="status" value={selectedEdit.status || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>ETIC</label>
                  <input type="text" name="ETIC" value={selectedEdit.ETIC || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Remarks</label>
                  <input type="text" name="remarks" value={selectedEdit.remarks || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Status Change Date</label>
                  <input type="text" name="statusChangeDate" value={selectedEdit.statusChangeDate || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Operational Status</label>
                  <select name="operationalStatus" value={selectedEdit.operationalStatus || ''} onChange={handleChange}>
                  <option value="RED">RED</option>
                    <option value="GREEN">GREEN</option>
                    <option value="YELLOW">YELLOW</option>
                  </select>
                </div>
              </>
            )}
            {currentListName === 'movableThreatList' && (
              // Fields specific to 'movable'
              <>
                <div>
                  <label>Serial Number</label>
                  <input type="text" name="serialNumber" value={selectedEdit.serialNumber || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>System Type</label>
                  <input type="text" name="systemType" value={selectedEdit.systemType || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Schedulable Item</label>
                  <select name="schedulableItem" value={selectedEdit.schedulableItem || ''} onChange={handleChange}>
                  <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div>
                  <label>Device Type</label>
                  <input type="text" name="deviceType" value={selectedEdit.deviceType || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Threat</label>
                  <input type="text" name="threat" value={selectedEdit.threat || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Maintenance Condition</label>
                  <select name="mxCondition" value={selectedEdit.mxCondition || ''} onChange={handleChange}>
                  <option value="RED">RED</option>
                    <option value="GREEN">GREEN</option>
                    <option value="YELLOW">YELLOW</option>
                  </select>
                </div>
                <div>
                  <label>Status</label>
                  <input type="text" name="status" value={selectedEdit.status || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>ETIC</label>
                  <input type="text" name="ETIC" value={selectedEdit.ETIC || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Remarks</label>
                  <input type="text" name="remarks" value={selectedEdit.remarks || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Status Change Date</label>
                  <input type="text" name="statusChangeDate" value={selectedEdit.statusChangeDate || ''} onChange={handleChange} />
                </div>
                <div>
                  <label>Operational Status</label>
                  <select name="operationalStatus" value={selectedEdit.operationalStatus || ''} onChange={handleChange}>
                    <option value="RED">RED</option>
                    <option value="GREEN">GREEN</option>
                    <option value="YELLOW">YELLOW</option>
                  </select>
                </div>
              </>
            )}
            <button style={{ height: "50px", width: "100%", backgroundColor: "green", color: "black" }} type="submit">Save Changes</button>
          </form>
        </ModalChildren>
      )}


    </div>
  );
}

export default Admin;
