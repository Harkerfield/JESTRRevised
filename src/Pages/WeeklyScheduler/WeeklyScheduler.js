import React, { useState, useMemo } from 'react';
import ThreatList from '../../Components/ThreatList/ThreatList.js';
import SchedulerForm from '../../Components/SchedulerForm/SchedulerForm.js';
import MapComponent from '../../Components/Map/MapComponent.js';
import WeekSelector from '../../Components/WeekSelector/WeekSelector.js';
import TimeSelector from '../../Components/TimeSelector/TimeSelector.js';
import Modal from '../../Components/Modal/Modal.js';

function App() {
  const [selectedThreatData, setselectedThreatData] = useState([]);
  const [userTimes, setUserTimes] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [userData, setUserData] = useState([{
    name: 'Joseph Hartsfield',
    dsn: '377-3211',
    squadron: '354th RANS',
  }]);

  const handleSelectedRowsChange = (selectedRows) => {
    setselectedThreatData(selectedRows);
  };

  const handleTimeIntervalsChange = (intervals) => {
    setUserTimes(intervals);
  };

  const handleSelectedDays = (days) => {
    setSelectedWeek(days);
  }


  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveData = (data) => {
    setRowData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePushData = () => {
    fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rowData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error pushing data:', error);
      });
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
      alert('Copied to clipboard!');
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


  const data = useMemo(
    () => [
      {
        name: "CERU5",
        serialNumber: "CERU5(SN13)",
        systemType: "UMTE",
        schedulableItem: "Yes",
        location: "Zulu-3 / OP 28.5",
        latitude: '63.834875',
        longitude: '-145.820617',
        type: "TK1",
        threat: "SA6",
        maintenanceCondition: "RED",
        status: "A/W Helo",
        ETIC: "30-Sep-23",
        remarks: "CEAR Will not power up. Intermittent Communications",
        statusChangeDate: "Down 15 Aug 23",
        operationalStatus: "RED"
      },
      {
        name: "CERU2",
        serialNumber: "CERU2(SN2)",
        systemType: "UMTE",
        schedulableItem: "Yes",
        location: "DEPOT",
        latitude: '64.3171',
        longitude: '-146.4416',
        type: "TK1",
        threat: "SA6",
        maintenanceCondition: "DEPOT",
        status: "",
        ETIC: "Unknown",
        remarks: "Awaiting shipment from Depot back to Eielson",
        statusChangeDate: "",
        operationalStatus: "DEPOT"
      },
      {
        name: "CERU8",
        serialNumber: "CERU8(SN3)",
        systemType: "UMTE",
        schedulableItem: "Yes",
        location: "Eielson Bldg 2509",
        latitude: '64.3171',
        longitude: '-146.4416',
        type: "TK2",
        threat: "SA8",
        maintenanceCondition: "GREEN",
        status: "",
        ETIC: "",
        remarks: "",
        statusChangeDate: "",
        operationalStatus: "GREEN"
      },
      {
        name: "CERU4",
        serialNumber: "CERU4(SN1)",
        systemType: "UMTE",
        schedulableItem: "No",
        location: "Eielson Bldg 2509",
        latitude: '64.3171',
        longitude: '-146.4416',
        type: "TK2",
        threat: "SA8",
        maintenanceCondition: "GREEN",
        status: "",
        ETIC: "",
        remarks: "",
        statusChangeDate: "",
        operationalStatus: "GREEN"
      },
      {
        name: "CERU1",
        serialNumber: "CERU1(SN4)",
        systemType: "UMTE",
        schedulableItem: "Yes",
        location: "Zulu-8A",
        latitude: '64.3171',
        longitude: '-146.4416',
        type: "TK3",
        threat: "SA3",
        maintenanceCondition: "GREEN",
        status: "",
        ETIC: "",
        remarks: "",
        statusChangeDate: "",
        operationalStatus: "GREEN"
      }
    ].filter(data => data.schedulableItem === "Yes"),
    []
  );



  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name', Filter: ColumnFilter },
      { Header: 'Serial Number', accessor: 'serialNumber', Filter: ColumnFilter },
      { Header: 'System Type', accessor: 'systemType', Filter: ColumnFilter },
      { Header: 'Schedulable Item', accessor: 'schedulableItem', Filter: ColumnFilter },
      { Header: 'Location', accessor: 'location', Filter: ColumnFilter },
      {
        Header: 'Lat/Long',
        accessor: d => `${convertDDtoDDM(d.latitude, 'lat')}, ${convertDDtoDDM(d.longitude, 'lon')}`,  // Use an accessor function to get both values.
        Filter: ColumnFilter,
        Cell: ({ value }) => (
          <>
            {value}
            <button
              style={{ marginLeft: '5px' }}
              onClick={() => handleCopy(value)}
            >
              Copy
            </button>
          </>
        )
      },
      // { Header: 'Latitude', accessor: 'latitude', Filter: ColumnFilter },
      // { Header: 'Longitude', accessor: 'longitude', Filter: ColumnFilter },
      { Header: 'Type', accessor: 'type', Filter: ColumnFilter },
      { Header: 'Threat', accessor: 'threat', Filter: ColumnFilter },
      {
        Header: 'Maintenance Condition', accessor: 'maintenanceCondition', Filter: ColumnFilter, Cell: ({ value }) => (
          <div style={{
            backgroundColor: value.toLowerCase(),
            padding: '0.5rem',
            color: value.toLowerCase() === 'red' || value.toLowerCase() === 'green' || value.toLowerCase() === 'orange' ? 'white' : 'black'
          }}>
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
          <div style={{
            backgroundColor: value.toLowerCase(),
            padding: '0.5rem',
            color: value.toLowerCase() === 'red' || value.toLowerCase() === 'green' ? 'white' : 'black'
          }}>
            {value}
          </div>
        )
      },
    ],
    []
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ThreatList columns={columns} data={data} onSelectedRowsChange={handleSelectedRowsChange} />
        <MapComponent points={selectedThreatData} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <WeekSelector onWeekSelected={handleSelectedDays} />
        <TimeSelector onTimeIntervalsChange={handleTimeIntervalsChange} />
      </div>
      <SchedulerForm selectedThreatData={selectedThreatData} selectedWeek={selectedWeek} userTimes={userTimes} onSaveData={handleSaveData} />
      {isModalOpen && (
        <Modal
          data={rowData}
          onClose={handleCloseModal}
          onPush={handlePushData}
        />
      )}
    </div>
  );
}

export default App;
