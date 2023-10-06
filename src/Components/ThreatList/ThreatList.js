import React, { useState } from "react";
import { useTable, useRowSelect, useFilters, useSortBy } from "react-table";
import "./ThreatList.css";
//https://tanstack.com/table/v8/docs/examples/react/column-ordering

const ThreatList = ({ columns, data, onSelectedRowsChange }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data },
    useFilters,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <>
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
              {/* <button onClick={selectAll}>Select All</button>
              <button onClick={deselectAll}>Deselect All</button> */}
            </>
          ),
          Cell: ({ row }) => (
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    },
  );

  React.useEffect(() => {
    const newSelectedRows = [];
    rows.forEach((row) => {
      if (selectedRowIds[row.id]) {
        newSelectedRows.push(row.original);
      }
    });
    setSelectedRows(newSelectedRows);
  }, [selectedRowIds, rows]);

  React.useEffect(() => {
    const newSelectedRows = [];
    rows.forEach((row) => {
      if (selectedRowIds[row.id]) {
        newSelectedRows.push(row.original);
      }
    });
    setSelectedRows(newSelectedRows);

    // Notify the parent component about the change in selected rows.
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelectedRows);
    }
    // }, [selectedRowIds, rows, onSelectedRowsChange]);
  }, [selectedRowIds, rows]);

  return (
    <div className="tableContainer">
      <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    borderBottom: "solid 2px red",
                    background: "aliceblue",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
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
                  <td
                    {...cell.getCellProps()}
                    style={{ padding: "10px", border: "solid 1px gray" }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ThreatList;
