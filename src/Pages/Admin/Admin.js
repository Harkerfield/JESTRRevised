import React, { useState, useMemo, useContext } from 'react';
import ThreatList from '../../Components/ThreatList/ThreatList.js'


import { useFetchData } from '../../hooks/useFetchData.js';
import { ConfigContext } from '../../Provider/Context.js';


function App() {

  const config = useContext(ConfigContext);
  const [selectedRowsInParent, setSelectedRowsInParent] = useState([]);

  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRowsInParent(selectedRows);
  };

  function ColumnFilter({
    column: { filterValue, setFilter, filteredRows, id }
  }) {
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${id}...`}
      />
    );
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Ccopied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const convertDDtoDMS = (decimalDegree, type) => {
    const absDD = Math.abs(decimalDegree);
    const degrees = Math.floor(absDD);
    const minutesValue = (absDD - degrees) * 60;
    const minutes = Math.floor(minutesValue);
    const seconds = ((minutesValue - minutes) * 60).toFixed(2);

    let direction;
    if (type === "lat") {
      direction = decimalDegree >= 0 ? 'N' : 'S';
    } else if (type === "lon") {
      direction = decimalDegree >= 0 ? 'E' : 'W';
    } else {
      throw new Error("Type must be 'lat' or 'lon'");
    }

    return `${direction}${degrees}° ${minutes}' ${seconds}"`;
  };


  const convertDDtoDDM = (decimalDegree, type) => {
    const absDD = Math.abs(decimalDegree);
    const degrees = Math.floor(absDD);
    const minutesValue = (absDD - degrees) * 60;
    const minutes = minutesValue.toFixed(4);  // 3 decimal places for minutes

    let direction;
    if (type === "lat") {
      direction = decimalDegree >= 0 ? 'N' : 'S';
    } else if (type === "lon") {
      direction = decimalDegree >= 0 ? 'E' : 'W';
    } else {
      throw new Error("Type must be 'lat' or 'lon'");
    }

    return `${direction}${degrees}° ${minutes}'`;
  };


  const backupData = useMemo(
    () => [
      {
        name: "CERU5",
        serialNumber: "CERU5(SN13)",
        systemType: "UMTE",
        schedulableItem: "Yes",
        location: "Zulu-3 / OP 28.5",
        latitude: '63.834875',
        longitude: '-145.820617',
        deviceType: "TK1",
        threat: "SA6",
        mxCondition: "RED",
        status: "A/W Helo",
        ETIC: "30-Sep-23",
        remarks: "CEAR Will not power up. Intermittent Communications",
        statusChangeDate: "Down 15 Aug 23",
        operationalStatus: "RED"
      }
    ].filter(data => data.schedulableItem === "Yes"),
    []
  );

  const { data, loading, error } = useFetchData(config.threatList);



  const columns = useMemo(
    () => [
      { Header: 'Title', accessor: 'Title', Filter: ColumnFilter },
      { Header: 'Serial Number', accessor: 'serialNumber', Filter: ColumnFilter },
      { Header: 'System Type', accessor: 'systemType', Filter: ColumnFilter },
      { Header: 'Schedulable Item', accessor: 'schedulableItem', Filter: ColumnFilter },
      { Header: 'Location', accessor: 'location', Filter: ColumnFilter },
      { Header: 'Latitude', accessor: 'pointLocationLat', Filter: ColumnFilter },
      { Header: 'Longitude', accessor: 'pointLocationLon', Filter: ColumnFilter },
      { Header: 'Device Type', accessor: 'deviceType', Filter: ColumnFilter },
      { Header: 'Threat', accessor: 'threat', Filter: ColumnFilter },
      {
        Header: 'Maintenance Condition', accessor: 'mxCondition', Filter: ColumnFilter, Cell: ({ value }) => (
          value ? <div style={{
            backgroundColor: value.toLowerCase(),
            padding: '0.5rem',
            color: value.toLowerCase() === 'red' || value.toLowerCase() === 'green' ? 'white' : 'black'
          }}>
            {value}
          </div> : <div>
            {value}
          </div>
        )
      },
      { Header: 'Status', accessor: 'status', Filter: ColumnFilter },
      { Header: 'ETIC', accessor: 'ETIC', Filter: ColumnFilter },
      { Header: 'Remarks', accessor: 'remarks', Filter: ColumnFilter },
      { Header: 'Status Change Date', accessor: 'statusChangeDate', Filter: ColumnFilter },
      {
        Header: 'Operational Status', accessor: 'operationalStatus', Filter: ColumnFilter, Cell: ({ value }) => (
          value ? <div style={{
            backgroundColor: value.toLowerCase(),
            padding: '0.5rem',
            color: value.toLowerCase() === 'red' || value.toLowerCase() === 'green' ? 'white' : 'black'
          }}>
            {value}
          </div> : <div>
            {value}
          </div>
        )
      },
    ],
    []
  );

  return (
    <div style={{ justifyContent: 'space-between', width: '95vw' }}>
      {loading ? <>Loading...</> : error ? <>
        Error! {error}
        <ThreatList columns={columns} data={backupData} onSelectedRowsChange={handleSelectedRowsChange} />
      </> : <>
        <ThreatList columns={columns} data={data} onSelectedRowsChange={handleSelectedRowsChange} />
      </>}
    </div>
  );
}

export default App;