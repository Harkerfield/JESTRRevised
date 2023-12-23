import React, { useState, useMemo, useContext, useEffect } from "react";
import ThreatList from "../../Components/ThreatList/ThreatList.js";

import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";

import scheduleTester from "../../testerData/threatsTester.json";

function Admin() {
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

  const handleCopy = async (text) => {
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

  const { data, loading, error } = useListGetItems(config.lists.threatList);
  const [filteredData, setFilteredData] = useState([]);

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
        Header: "Latitude",
        accessor: "pointLocationLat",
        Filter: ColumnFilter,
      },
      {
        Header: "Longitude",
        accessor: "pointLocationLon",
        Filter: ColumnFilter,
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

  return (
    <div
      className="PageFormat"
      style={{ justifyContent: "space-between", width: "95vw" }}
    >
      <div className="PageFormat">
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
      <ThreatList
        columns={columns}
        data={backupData}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </div>
  );
}

export default Admin;
