import React, { useState, useMemo, useContext } from "react";
import ThreatList from "../../Components/ThreatList/ThreatList.js";
import MapComponent from "../../Components/Map/MapComponent.js";
import "./MapTools.css";

import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";

function MapTools() {
  const config = useContext(ConfigContext);
  const [selectedRowsInParent, setSelectedRowsInParent] = useState([]);

  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRowsInParent(selectedRows);
  };

  function ColumnFilter({
    column: { filterValue, setFilter, filteredRows, id },
  }) {
    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          e.preventDefault();
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${id}...`}
      />
    );
  }

  const handleCopy = async (event, text) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      alert("Ccopied to clipboard!");
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
    () => [
      // Sample data; you'd typically fetch this from an API or other source.
      {
        id: 1,
        Title: "ERROR",
        serialNumber: "ERROR(SN13)",
        systemType: "Unmanned",
        schedulableItem: "Yes",
        location: "Zulu-3 / OP 28.5",
        range: "locError",
        pointLocationLat: "63.834875",
        pointLocationLon: "-145.820617",
        deviceType: "TK1",
        threat: "SA6",
        mxCondition: "RED",
        status: "Broken",
        ETIC: "30-Sep-23",
        remarks: "error",
        statusChangeDate: "Down 15 Aug 23",
        operationalStatus: "RED",
      },
      {
        id: 2,
        Title: "threat99",
        serialNumber: "threat99(SN13)",
        systemType: "UMTdsaE",
        schedulableItem: "Yes",
        location: "Zuludsa-3 / OP 28.5",
        range: "loc2Error",
        pointLocationLat: "63.834875",
        pointLocationLon: "-145.820617",
        deviceType: "TKdsa1",
        threat: "SdsaA6",
        mxCondition: "RED",
        status: "",
        ETIC: "30-Sep-23",
        remarks: "stuff",
        statusChangeDate: "Down 15 Aug 23",
        operationalStatus: "RED",
      },
    ],
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
            {/* <button
              style={{ marginLeft: "5px" }}
              onClick={(e) => handleCopy(e, value)}
            >
              Copy
            </button> */}
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

  const { data, loading, error } = useListGetItems(config.lists.threatList);

  return (
    <div className="PageFormat">
      {config.mapAndToolsInfo.map((item, index) => {
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

      <div>
        <MapComponent points={selectedRowsInParent} />
        <div style={{overflowX: "auto", maxWidth: "100vw"}}>
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
      </div>
    </div>
  );
}

export default MapTools;
