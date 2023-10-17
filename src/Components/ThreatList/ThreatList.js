import React, { useState } from "react";
import {
  useTable,
  useRowSelect,
  useFilters,
  useSortBy,
  usePagination, // Import usePagination
} from "react-table";
import "./ThreatList.css";

const ThreatList = ({ columns, data, onSelectedRowsChange }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds, pageSize, pageIndex },
    page,
    gotoPage,
    pageCount,
    canPreviousPage,
    canNextPage,
    setPageSize,
    pageOptions,
  } = useTable(
    { columns, data },
    useFilters,
    useSortBy,
    useRowSelect,
    usePagination // Use usePagination
  );

  const previousPage = () => {
    if (canPreviousPage) {
      gotoPage(pageIndex - 1);
    }
  };

  const nextPage = () => {
    if (canNextPage) {
      gotoPage(pageIndex + 1);
    }
  };

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

    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelectedRows);
    }
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
          {page.map((row) => {
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
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={previousPage} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={nextPage} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[8, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ThreatList;
