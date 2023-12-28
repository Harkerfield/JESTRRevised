import React from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import "./ListNoCheckBox.css";

const ListNoCheckBox = ({ columns, data, onEdit, onDelete }) => {

  const extendedColumns = React.useMemo(() => [
    {
      id: 'edit',
      Header: '',
      accessor: 'edit',
      Cell: ({ row }) => <button style={{ height: "50px", backgroundColor: "yellow", color: "black" }} onClick={(e) => onEdit(e, row.original)}>Edit</button>,
      // Ensure no filter is applied for this column
      Filter: () => null,
      disableFilters: true,
    },
    {
      id: 'delete',
      Header: '',
      accessor: 'delete',
      Cell: ({ row }) => <button style={{ height: "50px", backgroundColor: "red", color: "black" }} onClick={(e) => onDelete(e, row.original)}>Delete</button>,
      // Ensure no filter is applied for this column
      Filter: () => null,
      disableFilters: true,
    },
    ...columns.map(column => ({
      ...column,
      // You can add this if your original columns require a filter
      Filter: column.Filter || (() => null)
    }))
  ], [columns, onEdit, onDelete]);


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    pageCount,
    canPreviousPage,
    canNextPage,
    setPageSize,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns: extendedColumns, data },
    useFilters,
    useSortBy,
    usePagination
  );

  const changePage = (e, page) => {
    e.preventDefault();
    gotoPage(page);
  };

  return (
    <div className="tableThreatsListContainer">
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
                  <div>
                    {column.canFilter ? column.render("Filter") : null}
                  </div>
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
        {/* Pagination logic */}
        <button onClick={(e) => changePage(e, 0)} disabled={!canPreviousPage}>{"<<"}</button>
        <button onClick={() => gotoPage(pageIndex - 1)} disabled={!canPreviousPage}>{"<"}</button>
        <button onClick={() => gotoPage(pageIndex + 1)} disabled={!canNextPage}>{">"}</button>
        <button onClick={(e) => changePage(e, pageCount - 1)} disabled={!canNextPage}>{">>"}</button>
        <div>
          Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
        </div>
        <div>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </div>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ListNoCheckBox;
