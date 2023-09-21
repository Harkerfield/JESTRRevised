import React, {useState, useMemo} from 'react';
import ThreatList from '../../Components/ThreatList/ThreatList.js';
import MapComponent from '../../Components/Map/MapComponent.js';

function MapAndTools() {
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
    alert('Name copied to clipboard!');
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
    // Sample data; you'd typically fetch this from an API or other source.
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
  ],
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
      <MapComponent points={selectedRowsInParent} />
      <ThreatList columns={columns} data={data} onSelectedRowsChange={handleSelectedRowsChange} />
    </div>
  );
}

export default MapAndTools;
