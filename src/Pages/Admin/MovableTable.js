import React, { useState, useEffect, useContext } from "react";
import ListNoCheckBox from '../../Components/ListNoCheckBox/ListNoCheckBox.js';
import { useListGetItems } from '../../hooks/useListGetItems.js';
import { ConfigContext } from '../../Provider/Context.js';
import movableTester from '../../testerData/movableTester.json';

const MovableTable = ({ onEdit, onDelete, refreshData, setRefreshData }) => {
    const config = useContext(ConfigContext);

    const [backupData, setBackupData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [columns, setColumns] = useState([]);
    const { data, loading, error } = useListGetItems(config.lists.movableThreatList);

    useEffect(() => {
        setBackupData(movableTester);
    }, []);


    useEffect(() => {
        if (refreshData) {
            console.log("Trying to update data");
            console.log(refreshData);

            let found = false;
            const updatedData = filteredData.map(item => {
                if (item.Id === refreshData.Id) {
                    console.log("Found and updating");
                    found = true;
                    return { ...item, ...refreshData };
                }
                return item;
            });

            if (!found) {
                console.log("Not found and adding");
                setFilteredData([refreshData, ...filteredData]);
            } else {
                setFilteredData(updatedData);
            }

            setRefreshData(null);
        }
    }, [refreshData, filteredData, setRefreshData]);


    function ColumnFilter({ column: { filterValue, setFilter, id } }) {
        return (
            <input
                value={filterValue || ""}
                onChange={(e) => {
                    e.preventDefault();
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Search ${id}...`}
            />
        );
    }

    useEffect(() => {
        const newColumns = [
            { Header: "Title", accessor: "Title", Filter: ColumnFilter },
            {
                Header: "Serial Number",
                accessor: "serialNumber",
                Filter: ColumnFilter,
            },
            { Header: "System Type", accessor: "systemType", Filter: ColumnFilter },
            {
                Header: "Schedulable Item",
                accessor: "schedulableItem",
                Filter: ColumnFilter,
            },
            { Header: "Device Type", accessor: "deviceType", Filter: ColumnFilter },
            { Header: "Threat", accessor: "threat", Filter: ColumnFilter },
            {
                Header: "Maintenance Condition",
                accessor: "mxCondition",
                Filter: ColumnFilter,
                Cell: ({ value }) =>
                    value ? (
                        <div
                            style={{
                                backgroundColor: value.toLowerCase(),
                                padding: "0.5rem",
                                color:
                                    value.toLowerCase() === "red" ||
                                        value.toLowerCase() === "green"
                                        ? "white"
                                        : "black",
                            }}
                        >
                            {value}
                        </div>
                    ) : (
                        <div>{value}</div>
                    ),
            },
            { Header: "Status", accessor: "status", Filter: ColumnFilter },
            { Header: "ETIC", accessor: "ETIC", Filter: ColumnFilter },
            { Header: "Remarks", accessor: "remarks", Filter: ColumnFilter },
            {
                Header: "Status Change Date",
                accessor: "statusChangeDate",
                Filter: ColumnFilter,
            },
            {
                Header: "Operational Status",
                accessor: "operationalStatus",
                Filter: ColumnFilter,
                Cell: ({ value }) =>
                    value ? (
                        <div
                            style={{
                                backgroundColor: value.toLowerCase(),
                                padding: "0.5rem",
                                color:
                                    value.toLowerCase() === "red" ||
                                        value.toLowerCase() === "green"
                                        ? "white"
                                        : "black",
                            }}
                        >
                            {value}
                        </div>
                    ) : (
                        <div>{value}</div>
                    ),
            },
        ];
        setColumns(newColumns);
    }, []);

    useEffect(() => {
        if (data && !loading) {
            if (data.length > 0) {
                setFilteredData(data);
            } else if (error) {
                setFilteredData(backupData);
            }
        }
    }, [backupData, data, loading, error]);

    // Call this function after successful deletion
    const handleDeleteSuccess = (deletedItemId) => {
        const updatedData = filteredData.filter(item => item.ID !== deletedItemId);
        setFilteredData(updatedData);
    };

    // Updated onDelete function to include handleDeleteSuccess
    const handleDelete = async (e, rowData) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (confirmed) {
            const deleteResult = await onDelete(rowData.ID);
            if (deleteResult) {
                handleDeleteSuccess(rowData.ID);
            }
        }
    };


    return (
        <div style={{ overflowX: "auto", maxWidth: "100vw" }}>
            <div className="InfoPanel">Movable Data</div>
            <ListNoCheckBox
                columns={columns}
                data={filteredData}
                onEdit={onEdit}
                onDelete={handleDelete}
            />
        </div>

    );
};

export default MovableTable;
