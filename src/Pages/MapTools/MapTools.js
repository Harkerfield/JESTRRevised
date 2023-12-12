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
        Title: "CERU5",
        serialNumber: "CERU5(SN13)",
        systemType: "UMTE",
        schedulableItem: "Yes",
        location: "Zulu-3 / OP 28.5",
        range: "R2205",
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
      {
        id: 2,
        Title: "CERU99",
        serialNumber: "CERU99(SN13)",
        systemType: "UMTdsaE",
        schedulableItem: "Yes",
        location: "Zuludsa-3 / OP 28.5",
        range: "R2211",
        pointLocationLat: "63.834875",
        pointLocationLon: "-145.820617",
        deviceType: "TKdsa1",
        threat: "SdsaA6",
        mxCondition: "RED",
        status: "A/W dsadsaHelo",
        ETIC: "30-Sep-23",
        remarks: "CEAdsadsaR Will not power up. Intermittent Communications",
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
      <div className="InfoPanel">{config.mapAndToolsInfo}</div>
      <div style={{ width: "95vw" }}>
        <MapComponent points={selectedRowsInParent} />

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
  );
}

export default MapTools;
