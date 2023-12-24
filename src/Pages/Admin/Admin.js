import React, { useState, useContext, useEffect } from "react";
import ThreatList from "../../Components/ThreatList/ThreatList.js";
import { useListGetItems } from "../../hooks/useListGetItems.js";
import { ConfigContext } from "../../Provider/Context.js";
import scheduleTester from "../../testerData/threatsTester.json";

function Admin() {
  const config = useContext(ConfigContext);
  const [selectedRowsInParent, setSelectedRowsInParent] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRowsInParent(selectedRows);
  };

  function ColumnFilter({ column: { filterValue, setFilter, id } }) {
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

  const { data, loading, error } = useListGetItems(config.lists.threatList);

  useEffect(() => {
    if (data && !loading) {
      if (data.length > 0) {
        setFilteredData(data);
      } else if (error) {
        setFilteredData(
          scheduleTester.filter((data) => data.schedulableItem === "Yes"),
        );
      }
    }
  }, [data, loading, error]);

  useEffect(() => {
    const newColumns = [
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
    ];
    setColumns(newColumns);
  }, []);

  return (
    <div
      className="PageFormat"
      style={{ justifyContent: "space-between", width: "95vw" }}
    >
      <div className="PageFormat">
        {config.adminInfo.map((item, index) => (
          <div
            key={index}
            className={index === 0 ? "InfoPanel" : "InfoContent"}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ overflowX: "auto", maxWidth: "100vw" }}>
        <ThreatList
          columns={columns}
          data={filteredData}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </div>
    </div>
  );
}

export default Admin;
