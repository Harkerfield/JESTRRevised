import React, { useMemo, useContext } from "react";
import { useTable } from "react-table";
import { ConfigContext } from "../../Provider/Context.js";

import "./Metrics.css";

const Metrics = () => {
  const config = useContext(ConfigContext);

  const data = useMemo(
    () => [
      {
        equipmentRequested : "2312", 
        typeOfThreat : "1", 
        range : "", 
        location : "123", 
        requestStatus : "Approved", 
        notes : "", 
        pocName : "", 
        pocNumber : "", 
        pocEmail : "", 
        pocSquadron : "123", 
        startTime : "", 
        endTime : "", 
      },
      {
        equipmentRequested : "32112", 
        typeOfThreat : "1", 
        range : "", 
        location : "23", 
        requestStatus : "Rejected", 
        notes : "", 
        pocName : "", 
        pocNumber : "", 
        pocEmail : "", 
        pocSquadron : "123", 
        startTime : "", 
        endTime : "", 
      },
      // More data points can be added here
    ],
    [],
  );

  const columns = useMemo(
    () => [
      { Header: "equipmentRequested", accessor: "equipmentRequested" },
      { Header: "typeOfThreat", accessor: "typeOfThreat" },
      { Header: "range", accessor: "range" },
      { Header: "location", accessor: "location" },
      { Header: "requestrequestStatus", accessor: "requestrequestStatus" },
      { Header: "notes", accessor: "notes" },
      { Header: "pocName", accessor: "pocName" },
      { Header: "pocNumber", accessor: "pocNumber" },
      { Header: "pocEmail", accessor: "pocEmail" },
      { Header: "pocSquadron", accessor: "pocSquadron" },
      { Header: "startTime", accessor: "startTime" },
      { Header: "endTime", accessor: "endTime" },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="PageFormat">
      <div className="InfoPanel">{config.metricsInfo}</div>
      <div className="tableMetricsContainer">
        <h2>QAE/COR Report</h2>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td className="borderStyle" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="stats">
          <div className="stats-item">
            <strong>Total Scheduled:</strong> {data.length}
          </div>
          <div className="stats-item">
            <strong>Approved:</strong>{" "}
            {data.filter((item) => item.requestStatus === "Approved").length}
          </div>
          <div className="stats-item">
            <strong>Rejected:</strong>{" "}
            {data.filter((item) => item.requestStatus === "Rejected").length}
          </div>

          <div className="stats-item">
            <strong>Unique Equip/Threat Scheduled:</strong>{" "}
            {new Set(data.map((item) => item.equipmentRequested)).size}
          </div>
          <div className="stats-item">
            <strong>Unique Squadrons Scheduled:</strong>{" "}
            {new Set(data.map((item) => item.pocSquadron)).size}
          </div>
          <div className="stats-item">
            <strong>Unique Locations Scheduled:</strong>{" "}
            {new Set(data.map((item) => item.location)).size}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
