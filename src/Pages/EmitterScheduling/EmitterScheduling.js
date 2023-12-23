import React, { useState, useMemo, useContext, useEffect } from "react";
import ThreatList from "../../Components/ThreatList/ThreatList.js";
import FormSchedulerTable from "../../Components/FormSchedulerTable/FormSchedulerTable.js";
import MapComponent from "../../Components/Map/MapComponent.js";
import FormWeekSelector from "../../Components/FormWeekSelector/FormWeekSelector.js";
import FormTimeSelector from "../../Components/FormTimeSelector/FormTimeSelector.js";
import FormUser from "../../Components/FormUser/FormUser.js";
import ModalForm from "../../Components/FormModalSubmit/FormModalSubmit.js";
import ModalChildren from "../../Components/Modal/ModalChildren.js";
import { useListCreateItem } from "../../hooks/useListCreateItem.js";
import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";

import scheduleTester from "../../testerData/threatsTester.json";
import "./EmitterScheduling.css";

function EmitterScheduling() {
  const config = useContext(ConfigContext);
  const [selectedThreatData, setselectedThreatData] = useState([]);
  const [userTimes, setUserTimes] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [userData, setUserData] = useState([]);

  const { data, loading, error } = useListGetItems(config.lists.threatList);
  const [filteredData, setFilteredData] = useState([]);

  const handleSelectedRowsChange = (selectedRows) => {
    setselectedThreatData(selectedRows);
  };
  const handleTimeIntervalsChange = (intervals) => {
    setUserTimes(intervals);
  };
  const handleSelectedDays = (days) => {
    setSelectedWeek(days);
  };
  const handleUserDataChange = (userData) => {
    setUserData(userData);
  };

  const [rowData, setRowData] = useState([]);
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalChildrenOpen, setIsModalChildrenOpen] = useState(false);

  const { createItem, loadingPush, errorPush } = useListCreateItem();
  // const [itemData, setItemData] = useState({ /* initial item data structure */ });

  const handleSaveData = (data) => {
    setRowData(data);
    setIsModalFormOpen(true);
  };
  const openSchedulingModel = (e) => {
    e.preventDefault();
    setIsModalChildrenOpen(true);
  };

  const handleCloseModalForm = () => {
    setIsModalFormOpen(false);
  };
  const handleCloseModalChildren = () => {
    setIsModalChildrenOpen(false);
  };

  const handlePushData = async (e, readyToSubmit) => {
    // useListCreateItem
    e.preventDefault();

    readyToSubmit.map(async (item) => {
      console.log("Item to submit", item);

      const result = await createItem(config.lists.scheduleList, item);
      if (result) {
        console.log("Item created:", result);
        handleCloseModalForm();
      }
    });

    if (loadingPush) {
      return <p>Loading...</p>;
    }

    if (errorPush) {
      console.log(errorPush);
      return <p>Error: {errorPush}</p>;
    }
  };

  function ColumnFilter({
    column: { filterValue, setFilter, filteredRows, id },
  }) {
    return (
      <input
        style={{ width: "100%", textAlign: "center" }}
        value={filterValue || ""}
        onChange={(e) => {
          e.preventDefault();
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search`}
      />
    );
  }

  const handleCopy = async (event, text) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // const convertDDtoDMS = (decimalDegree, type) => {
  //   const absDD = Math.abs(decimalDegree);
  //   const degrees = Math.floor(absDD);
  //   const minutesValue = (absDD - degrees) * 60;
  //   const minutes = Math.floor(minutesValue);
  //   const seconds = ((minutesValue - minutes) * 60).toFixed(2);

  //   let direction;
  //   if (type === "lat") {
  //     direction = decimalDegree >= 0 ? "N" : "S";
  //   } else if (type === "lon") {
  //     direction = decimalDegree >= 0 ? "E" : "W";
  //   } else {
  //     throw new Error("Type must be 'lat' or 'lon'");
  //   }

  //   return `${direction}${degrees}° ${minutes}' ${seconds}"`;
  // };

  const convertDDtoDDM = (decimalDegree, type) => {
    const absDD = Math.abs(decimalDegree);
    const degrees = Math.floor(absDD);
    const minutesValue = (absDD - degrees) * 60;
    const minutes = minutesValue.toFixed(4); // 3 decimal places for minutes

    let direction;
    if (type === "lat") {
      direction = decimalDegree >= 0 ? "N" : "S";
    } else if (type === "lon") {
      direction = decimalDegree >= 0 ? "E" : "W";
    } else {
      throw new Error("Type must be 'lat' or 'lon'");
    }

    return `${direction}${degrees}° ${minutes}'`;
  };

  const backupData = useMemo(
    () => scheduleTester.filter((data) => data.schedulableItem === "Yes"),
    [],
  );

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        setFilteredData(data);
      } else if (error) {
        setFilteredData(backupData);
      }
    }
  }, [backupData, data, error]);

  const columns = useMemo(
    () => [
      // { Header: "Title", accessor: "Title", Filter: ColumnFilter, style: { textAlign: 'center' }},
      // {
      //   Header: "Serial Number",
      //   accessor: "serialNumber",
      //   Filter: ColumnFilter,
      //   style: { textAlign: 'center' }
      // },

      {
        Header: "System Type/Threat",
        accessor: (d) => `${d.systemType}/${d.threat}`,
        Filter: ColumnFilter,
        style: { textAlign: "center" },
        Cell: ({ value }) => <>{value}</>,
      },

      // { Header: "System Type", accessor: "systemType", Filter: ColumnFilter, style: { textAlign: 'center' } },
      // {
      //   Header: "Schedulable Item",
      //   accessor: "schedulableItem",
      //   Filter: ColumnFilter,
      //   style: { textAlign: 'center' }
      // },
      // {
      //   Header: "id",
      //   accessor: "id",
      //   Filter: ColumnFilter,
      //   style: { textAlign: "center" },
      // },
      {
        Header: "Location",
        accessor: "location",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "Lat/Long",
        accessor: (d) =>
          `${convertDDtoDDM(d.pointLocationLat, "lat")}, ${convertDDtoDDM(
            d.pointLocationLon,
            "lon",
          )}`, // Use an accessor function to get both values.
        Filter: ColumnFilter,
        style: { textAlign: "center" },
        Cell: ({ value }) => (
          <>
            {value}
            {/* <button
              style={{ marginLeft: "5px" }}
              onClick={(e) => handleCopy(e, value)}
            >
              Copy
            </button> */}
          </>
        ),
      },
      // { Header: "Device Type", accessor: "deviceType", Filter: ColumnFilter, style: { textAlign: 'center' }  },
      // { Header: "Threat", accessor: "threat", Filter: ColumnFilter, style: { textAlign: 'center' } },
      // {
      //   Header: "Maintenance Condition",
      //   accessor: "mxCondition",
      //   Filter: ColumnFilter,
      //   style: { textAlign: 'center' }
      //   Cell: ({ value }) =>
      //     value ? (
      //       <div
      //         style={{
      //           backgroundColor: value.toLowerCase(),
      //           padding: "0.5rem",
      //           color:
      //             value.toLowerCase() === "red" ||
      //             value.toLowerCase() === "green"
      //               ? "white"
      //               : "black",
      //         }}
      //       >
      //         {value}
      //       </div>
      //     ) : (
      //       <div>{value}</div>
      //     ),
      // },
      // { Header: "Status", accessor: "status", Filter: ColumnFilter, style: { textAlign: 'center' }  },
      // { Header: "ETIC", accessor: "ETIC", Filter: ColumnFilter, style: { textAlign: 'center' } },
      // { Header: "Remarks", accessor: "remarks", Filter: ColumnFilter, style: { textAlign: 'center' } },
      {
        Header: "Remarks",
        accessor: (d) => {
          return (
            <>
              {d.remarks ? <div>{d.remarks}</div> : <></>}
              {d.ETIC ? <div>ETIC: {d.ETIC}</div> : <></>}
            </>
          );
        },
        Filter: ColumnFilter,
        style: { textAlign: "center" },
        Cell: ({ value }) => <>{value}</>,
      },

      // {
      //   Header: "Status Change Date",
      //   accessor: "statusChangeDate",
      //   Filter: ColumnFilter,
      //   style: { textAlign: 'center' }
      // },
      {
        Header: "Operational Status",
        accessor: "operationalStatus",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
        Cell: ({ value }) =>
          value ? (
            <div
              style={{
                backgroundColor: value.toLowerCase(),
                padding: "0.5rem",
                color:
                  value.toLowerCase() === "red" ||
                  value.toLowerCase() === "green"
                    ? "white"
                    : "black",
              }}
            >
              {value}
            </div>
          ) : (
            <div>{value}</div>
          ),
      },
    ],
    [],
  );

  // const { data, loading, error } = useListGetItems(config.lists.threatList);
  //data.filter(item=> item.schedulableItem === "Yes" && (item.operationalStatus === "GREEN" || item.operationalStatus === "YELLOW" || item.operationalStatus === "RED" || item.operationalStatus === "AMBER") )

  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (item) =>
          item.schedulableItem === "Yes" &&
          (item.operationalStatus === "GREEN" ||
            item.operationalStatus === "YELLOW" ||
            item.operationalStatus === "RED" ||
            item.operationalStatus === "AMBER"),
      );
      setFilteredData(filtered);
    }
  }, [data]);

  const [formIsValid, setFormIsValid] = useState(true);
  const [weekErrors, setWeekErrors] = useState(true);
  const [timeErrors, setTimeErrors] = useState(true);

  return (
    <div className="PageFormat">
      <div>
        <div>
          {config.emmiterSchedulingInfo.map((item, index) => {
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

        {/* Map */}
        <div>
          <MapComponent points={selectedThreatData} />
        </div>

        <div key="submitButton">
          {selectedThreatData.length > 0 ? (
            <button
              onClick={openSchedulingModel}
              style={{
                width: "100%",
                height: "50px",
                backgroundColor: "green",
                color: "white",
              }}
            >
              Click here to schedule
            </button>
          ) : (
            <button
              onClick={(e) => e.preventDefault}
              style={{
                width: "100%",
                height: "50px",
                backgroundColor: "yellow",
                color: "black",
              }}
            >
              Please select at least one threat to schedule
            </button>
          )}
        </div>

        <div style={{ overflowY: "auto", overflowX: "auto" }}>
          <ThreatList
            columns={columns}
            data={backupData}
            onSelectedRowsChange={handleSelectedRowsChange}
          />
        </div>
      </div>

      {isModalChildrenOpen && (
        <ModalChildren onClose={(e) => handleCloseModalChildren(e)}>
          <div>{/* {error handling} */}</div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormUser
              onFormSubmit={handleUserDataChange}
              onErrors={(e) => {
                setFormIsValid(!e);
              }}
            />
            <FormWeekSelector
              onWeekSelected={handleSelectedDays}
              onErrors={(e) => {
                setWeekErrors(!e);
              }}
            />
            <FormTimeSelector
              onTimeIntervalsChange={handleTimeIntervalsChange}
              onErrors={(e) => {
                setTimeErrors(!e);
              }}
            />
          </div>
          <div style={{ height: "100%" }}>
            <FormSchedulerTable
              selectedThreatData={selectedThreatData}
              selectedWeek={selectedWeek}
              userTimes={userTimes}
              onSaveData={handleSaveData}
              formIsValid={formIsValid && weekErrors && timeErrors} //truthie / falsie
            />
          </div>
          {isModalFormOpen && (
            <ModalForm
              data={{
                rowData: rowData,
                userTimes: userTimes,
                userData: userData,
              }}
              onClose={handleCloseModalForm}
              onPush={handlePushData}
            />
          )}
        </ModalChildren>
      )}
    </div>
  );
}

export default EmitterScheduling;
