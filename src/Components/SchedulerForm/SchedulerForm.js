import React, { useState, useMemo, useEffect } from 'react';
import { useTable } from 'react-table';
import "./SchedulerForm.css"
//https://tanstack.com/table/v8/docs/examples/

const SchedulerForm = ({ selectedThreatData,  selectedWeek}) => {
  // userTimes, userData, selectedWeek
  const [data, setData] = useState([]);

  useEffect(() => {

    setData(selectedThreatData)
  },[selectedThreatData])

  
  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Serial Number', accessor: 'serialNumber' },
      { Header: 'System Type', accessor: 'systemType' },
      {
        Header: 'Mon', accessor: 'mon',
        Cell: () => {
          return (<>dropdown</>)
        }
      },
      {
        Header: 'Tue', accessor: 'Tue',
        Cell: () => {
          return (<>dropdown</>)
        }
      },
      {
        Header: 'Wed', accessor: 'wed',
        Cell: () => {
          return (<>dropdown</>)
        }
      },
      {
        Header: 'Thu', accessor: 'Thu',
        Cell: () => {
          return (<>dropdown</>)
        }
      },
      {
        Header: 'Fri', accessor: 'fri',
        Cell: () => {
          return (<>dropdown</>)
        }
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="tableContainer">
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 2px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SchedulerForm;
