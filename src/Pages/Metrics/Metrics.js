import React, { useMemo } from "react";
import { useTable } from "react-table";
import "./Metrics.css";

const Metrics = () => {
  const data = useMemo(
    () => [
      {
        status: "Approved",
        squadron: "962 AACS",
        location: "Zulu8A-1",
        equipThreat: "SA-3 (TK3)",
        systemType: "UMTE",
        range: "2202",
        eventDate: "20 Sep 23",
        startTime: "13:30L",
        endTime: "15:0L",
        poc: "Jeffrey Leslie/962 AACS",
        pocDsn: "5529211",
      },
      {
        status: "Rejected",
        squadron: "Falcons",
        location: "Oscar-1",
        equipThreat: "SA-3 (T1)",
        systemType: "Manned",
        range: "2205",
        eventDate: "20 Sep 23",
        startTime: "18:0L",
        endTime: "19:30L",
        poc: "/",
        pocDsn: "",
      },
      // More data points can be added here
    ],
    [],
  );

  const columns = useMemo(
    () => [
      { Header: "Status", accessor: "status" },
      { Header: "Squadron", accessor: "squadron" },
      { Header: "Location", accessor: "location" },
      { Header: "Equip/Threat", accessor: "equipThreat" },
      { Header: "System Type", accessor: "systemType" },
      { Header: "Range", accessor: "range" },
      { Header: "Event Date", accessor: "eventDate" },
      { Header: "Start Time", accessor: "startTime" },
      { Header: "End Time", accessor: "endTime" },
      { Header: "POC", accessor: "poc" },
      { Header: "POC DSN", accessor: "pocDsn" },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="tableContainer">
      <h2>QAE/COR Report</h2>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
          {data.filter((item) => item.status === "Approved").length}
        </div>
        <div className="stats-item">
          <strong>Rejected:</strong>{" "}
          {data.filter((item) => item.status === "Rejected").length}
        </div>

        <div className="stats-item">
          <strong>Unique Equip/Threat Scheduled:</strong>{" "}
          {new Set(data.map((item) => item.equipThreat)).size}
        </div>
        <div className="stats-item">
          <strong>Unique Squadrons Scheduled:</strong>{" "}
          {new Set(data.map((item) => item.squadron)).size}
        </div>
        <div className="stats-item">
          <strong>Unique Locations Scheduled:</strong>{" "}
          {new Set(data.map((item) => item.location)).size}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
