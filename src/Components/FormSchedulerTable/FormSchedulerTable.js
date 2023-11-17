import React, { useState, useMemo, useEffect } from "react";
import { useTable } from "react-table";
import Dropdown from "../Dropdown/Dropdown.js";
import "./FormSchedulerTable.css";
//https://tanstack.com/table/v8/docs/examples/

const FormSchedulerTable = ({
  selectedThreatData,
  selectedWeek,
  userTimes,
  onSaveData,

}) => {
  // userTimes, userData, selectedWeek
  const [data, setData] = useState([]);
  const [dropdownSelections, setDropdownSelections] = useState({});

  useEffect(() => {
    setData(selectedThreatData);
  }, [selectedThreatData]);

  const handleDropdownChange = (day, selectedValue) => {
    setDropdownSelections((prevState) => ({
      ...prevState,
      [day]: selectedValue,
    }));
  };

  const columns = useMemo(
    () => [
      { Header: "Title", accessor: "Title" },
      { Header: "Serial Number", accessor: "serialNumber" },
      { Header: "System Type", accessor: "systemType" },
      ...selectedWeek.map((item) => {
        return {
          Header: `${item["date"]}`,
          accessor: `${item["day"]}`,
          Cell: ({ row }) => {
            const day = item["day"]; // Directly use item['day']
            return (
              <Dropdown
                options={[
                  "NONE",
                  "All",
                  ...userTimes.map((time) => `${time.start} - ${time.end}`),
                ]}
                placeholder="NONE"
                onChange={(selected) => {
                  // console.log(selected);
                  handleDropdownChange(day, selected);
                }}
                value={dropdownSelections[day]}
              />
            );
          },
        };
      }),
    ],
    [selectedWeek, userTimes],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const saveTableAsJSON = (event, columns) => {
    event.preventDefault();
    const rowData = data.map((row) => {
      let obj = {};
      columns.forEach((column, idx) => {
        if (selectedWeek.some((item) => item["day"] === column.accessor)) {
          obj[column.Header] = dropdownSelections[column.accessor] || null;
        } else {
          obj[column.Header] = row[column.accessor];
        }
      });
      return obj;
    });

    onSaveData(rowData); // passing the rowData to the parent component
  };


  useEffect(() => {
    let initialDropdownValues = {};
    selectedWeek.forEach((item) => {
      const day = item["day"];
      initialDropdownValues[day] = "NONE";
    });
    setDropdownSelections(initialDropdownValues);
  }, [selectedWeek]);

  return (
    <div className="tableSchedulerContainer">
      <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: "solid 2px red",
                    background: "aliceblue",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
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

      <button onClick={(e) => saveTableAsJSON(e, columns)}  style={{  width: "99%", height: "50px", backgroundColor: "green", color: "white" }}>Review Changes</button>

    </div>
  );
};

export default FormSchedulerTable;
