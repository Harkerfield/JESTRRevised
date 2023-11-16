import React, { useEffect, useState } from "react";

const FormModalSubmit = ({ data, onClose, onPush }) => {

  const [readyToSubmit, setReadyToSubmit] = useState([]);

  const isDateKey = (key) => {
    // Regular expression to match the format 'Day Mon DD YYYY'
    const datePattern = /^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}$/;
    return datePattern.test(key) && !isNaN(Date.parse(key));
  };

  const splitTimeRange = (timeRange) => {
    const [start, end] = timeRange.split('-').map(time => time.trim());
    return {
      start,
      end
    };
  };


  useEffect(() => {

    setReadyToSubmit(
      data.rowData.map(item => {
        const filtered = {};
        const dataInfo = {};

        for (const key in item) {
          if (!isDateKey(key) && item[key] !== "NONE" && item[key] !== "ALL") {
            filtered[key] = item[key];
          }
          if (isDateKey(key) && item[key] !== "NONE") {
            if (item[key] === "All") {
              const dataTimes = data.userTimes;
              dataInfo[key] = { ...filtered, dataTimes };
            } else {
              const dataTiems = splitTimeRange(item[key]);
              dataInfo[key] = { ...filtered, dataTiems };
            }
          }
        }
        return { ...dataInfo };
      })

    )

  }, [data]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          width: "80%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <h2>Confirm Data</h2>
        <pre>{JSON.stringify(readyToSubmit, null, 2)}</pre>
        {/* <pre>{JSON.stringify(data.rowData.map(item => {
          return item
        }), null, 2)}</pre>  */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancel
          </button>
          <button onClick={onPush}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default FormModalSubmit;
