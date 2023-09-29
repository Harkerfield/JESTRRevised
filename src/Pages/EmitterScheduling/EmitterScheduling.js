import React, { useState, useMemo, useContext, useEffect } from "react";
import ThreatList from "../../Components/ThreatList/ThreatList.js";
import SchedulerForm from "../../Components/SchedulerForm/SchedulerForm.js";
import MapComponent from "../../Components/Map/MapComponent.js";
import WeekSelector from "../../Components/WeekSelector/WeekSelector.js";
import TimeSelector from "../../Components/TimeSelector/TimeSelector.js";
import Modal from "../../Components/Modal/Modal.js";
import useCreateItem from "../../hooks/useCreateItem.js";
import { useFetchData } from "../../hooks/useFetchData.js";
import { ConfigContext } from "../../Provider/Context.js";

function EmitterScheduling() {
  const config = useContext(ConfigContext);
  const [selectedThreatData, setselectedThreatData] = useState([]);
  const [userTimes, setUserTimes] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [userData, setUserData] = useState([
    {
      name: "Joseph Hartsfield",
      dsn: "377-3211",
      squadron: "354th RANS",
    },
  ]);

  const handleSelectedRowsChange = (selectedRows) => {
    setselectedThreatData(selectedRows);
  };

  const handleTimeIntervalsChange = (intervals) => {
    setUserTimes(intervals);
  };

  const handleSelectedDays = (days) => {
    setSelectedWeek(days);
  };

  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveData = (data) => {
    setRowData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePushData = () => {
    fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
  };

  function ColumnFilter({
    column: { filterValue, setFilter, filteredRows, id },
  }) {
    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${id}...`}
      />
    );
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const convertDDtoDMS = (decimalDegree, type) => {
    const absDD = Math.abs(decimalDegree);
    const degrees = Math.floor(absDD);
    const minutesValue = (absDD - degrees) * 60;
    const minutes = Math.floor(minutesValue);
    const seconds = ((minutesValue - minutes) * 60).toFixed(2);

    let direction;
    if (type === "lat") {
      direction = decimalDegree >= 0 ? "N" : "S";
    } else if (type === "lon") {
      direction = decimalDegree >= 0 ? "E" : "W";
    } else {
      throw new Error("Type must be 'lat' or 'lon'");
    }

    return `${direction}${degrees}° ${minutes}' ${seconds}"`;
  };

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
    () =>
      [
        {
          Title: "CERU5",
          serialNumber: "CERU5(SN13)",
          systemType: "UMTE",
          schedulableItem: "Yes",
          location: "Zulu-3 / OP 28.5",
          pointLocationLat: "63.834875",
          pointLocationLon: "-145.820617",
          deviceType: "TK1",
          threat: "SA6",
          mxCondition: "RED",
          status: "A/W Helo",
          ETIC: "30-Sep-23",
          remarks: "CEAR Will not power up. Intermittent Communications",
          statusChangeDate: "Down 15 Aug 23",
          operationalStatus: "RED",
        },
      ].filter((data) => data.schedulableItem === "Yes"),
    [],
  );

  const columns = useMemo(
    () => [
      { Header: "Title", accessor: "Title", Filter: ColumnFilter },
      {
        Header: "Serial Number",
        accessor: "serialNumber",
        Filter: ColumnFilter,
      },
      { Header: "System Type", accessor: "systemType", Filter: ColumnFilter },
      {
        Header: "Schedulable Item",
        accessor: "schedulableItem",
        Filter: ColumnFilter,
      },
      { Header: "Location", accessor: "location", Filter: ColumnFilter },
      {
        Header: "Lat/Long",
        accessor: (d) =>
          `${convertDDtoDDM(d.pointLocationLat, "lat")}, ${convertDDtoDDM(
            d.pointLocationLon,
            "lon",
          )}`, // Use an accessor function to get both values.
        Filter: ColumnFilter,
        Cell: ({ value }) => (
          <>
            {value}
            <button
              style={{ marginLeft: "5px" }}
              onClick={() => handleCopy(value)}
            >
              Copy
            </button>
          </>
        ),
      },
      { Header: "Device Type", accessor: "deviceType", Filter: ColumnFilter },
      { Header: "Threat", accessor: "threat", Filter: ColumnFilter },
      {
        Header: "Maintenance Condition",
        accessor: "mxCondition",
        Filter: ColumnFilter,
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
      { Header: "Status", accessor: "status", Filter: ColumnFilter },
      { Header: "ETIC", accessor: "ETIC", Filter: ColumnFilter },
      { Header: "Remarks", accessor: "remarks", Filter: ColumnFilter },
      {
        Header: "Status Change Date",
        accessor: "statusChangeDate",
        Filter: ColumnFilter,
      },
      {
        Header: "Operational Status",
        accessor: "operationalStatus",
        Filter: ColumnFilter,
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

  const { data, loading, error } = useFetchData(config.lists.threatList);

  return (
    <div>
      {/* {data.map(item => (
        <div key={item.Id}>{item.Title}</div>
      ))} */}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "45vw" }}>
          {loading ? (
            <>Loading...</>
          ) : error ? (
            <>
              Error! {error}
              <ThreatList
                columns={columns}
                data={backupData}
                onSelectedRowsChange={handleSelectedRowsChange}
              />
            </>
          ) : (
            <>
              <ThreatList
                columns={columns}
                data={data}
                onSelectedRowsChange={handleSelectedRowsChange}
              />
            </>
          )}
        </div>
        <div style={{ width: "50vw" }}>
          <MapComponent points={selectedThreatData} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <WeekSelector onWeekSelected={handleSelectedDays} />
        <TimeSelector onTimeIntervalsChange={handleTimeIntervalsChange} />
      </div>
      <SchedulerForm
        selectedThreatData={selectedThreatData}
        selectedWeek={selectedWeek}
        userTimes={userTimes}
        onSaveData={handleSaveData}
      />
      {isModalOpen && (
        <Modal
          data={rowData}
          onClose={handleCloseModal}
          onPush={handlePushData}
        />
      )}
    </div>
  );
}

export default EmitterScheduling;
