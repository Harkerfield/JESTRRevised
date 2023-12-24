import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);

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
    toggleAllRowsSelected, // Get this method from useTable
  } = useTable(
    { columns, data },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
  );

  const previousPage = (e) => {
    e.preventDefault();
    if (canPreviousPage) {
      gotoPage(pageIndex - 1);
    }
  };

  const nextPage = (e) => {
    e.preventDefault();
    if (canNextPage) {
      gotoPage(pageIndex + 1);
    }
  };

  const changePage = (e, page) => {
    e.preventDefault();

    gotoPage(page);
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

  const toggleAllRows = () => {
    toggleAllRowsSelected(
      !(rows.length === Object.keys(selectedRowIds).length),
    );
  };
  const toggleRow = (row) => {
    row.toggleRowSelected(!selectedRowIds[row.id]);
  };

  return (
    <div className="tableThreatsListContainer">
      <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  selectedRows.length === rows.length &&
                  rows.every((row) => selectedRowIds[row.id])
                }
                onChange={toggleAllRows}
              />
            </th>
            {headerGroups.map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
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
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRowIds[row.id]}
                    onChange={() => toggleRow(row)}
                  />
                </td>
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
        <div>
          <button onClick={(e) => changePage(e, 0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={(e) => previousPage(e)} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <button onClick={(e) => nextPage(e)} disabled={!canNextPage}>
            {">"}
          </button>
          <button
            onClick={(e) => changePage(e, pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
        <div>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
        <div>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              changePage(e, page);
            }}
            style={{ width: "50px" }}
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ThreatList;
