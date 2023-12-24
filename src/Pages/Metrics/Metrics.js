import React, { useContext, useEffect, useState } from "react";
import { useTable } from "react-table";
import { useListGetItems } from "../../hooks/useListGetItems.js";
import ThreatList from "../../Components/ThreatList/ThreatList.js";
import scheduleTester from "../../testerData/scheduleTester.json";

import { ConfigContext } from "../../Provider/Context.js";

import "./Metrics.css";

const Metrics = () => {
  const config = useContext(ConfigContext);

  const [backupData, setBackupData] = useState([]);

  const { data, loading, error } = useListGetItems(config.lists.scheduleList);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setBackupData(scheduleTester);
  }, []);

  useEffect(() => {
    if (data && !loading) {
      if (data.length > 0) {
        setFilteredData(data);
      } else if (error) {
        setFilteredData(backupData);
      }
    }
  }, [backupData, data, loading, error]);

  const handleSelectedRowsChange = (selectedRows) => {
    console.log(selectedRows);
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

  useEffect(() => {
    const newColumns = [
      {
        Header: "equipmentRequested",
        accessor: "equipmentRequested",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "typeOfThreat",
        accessor: "typeOfThreat",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "range",
        accessor: "range",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "location",
        accessor: "location",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "requestStatus",
        accessor: "requestStatus",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "notes",
        accessor: "notes",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "pocName",
        accessor: "pocName",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "pocNumber",
        accessor: "pocNumber",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "pocEmail",
        accessor: "pocEmail",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "pocSquadron",
        accessor: "pocSquadron",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "start",
        accessor: "start",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
      {
        Header: "end",
        accessor: "end",
        Filter: ColumnFilter,
        style: { textAlign: "center" },
      },
    ];
    setColumns(newColumns);
  }, []);

  useEffect(() => {
    if (data) {
      const filtered = data;
      //TODO create filtered data
      if (data.length > 0) {
        setFilteredData(filtered);
      } else if (error) {
        setFilteredData(backupData);
      }
    }
  }, [backupData, data, loading, error]);

  return (
    <div className="PageFormat">
      {config.metricsInfo.map((item, index) => {
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

      <div style={{ overflowY: "auto", overflowX: "auto" }}>
        <ThreatList
          columns={columns}
          data={filteredData}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </div>
      <div className="stats">
        <div className="stats-item">
          <strong>Total Scheduled:</strong> {filteredData.length}
        </div>
        <div className="stats-item">
          <strong>Approved:</strong>
          {
            filteredData.filter((item) => item.requestStatus === "Approved")
              .length
          }
        </div>
        <div className="stats-item">
          <strong>Rejected:</strong>
          {
            filteredData.filter((item) => item.requestStatus === "Rejected")
              .length
          }
        </div>

        <div className="stats-item">
          <strong>Unique Equip/Threat Scheduled:</strong>
          {new Set(filteredData.map((item) => item.equipmentRequested)).size}
        </div>
        <div className="stats-item">
          <strong>Unique Squadrons Scheduled:</strong>
          {new Set(filteredData.map((item) => item.pocSquadron)).size}
        </div>
        <div className="stats-item">
          <strong>Unique Locations Scheduled:</strong>
          {new Set(filteredData.map((item) => item.location)).size}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
