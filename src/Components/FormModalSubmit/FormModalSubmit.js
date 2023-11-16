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
    return [{
      start,
      end
    }];
  };

  useEffect(() => {
    setReadyToSubmit(
      data.rowData.flatMap(item => {
        const staticFields = {};

        // Extract static fields (non-date fields)
        for (const key in item) {
          if (!isDateKey(key)) {
            staticFields[key] = item[key];
          }
        }

        // Create an array of objects for each time range in each date
        return Object.keys(item)
          .filter(key => isDateKey(key) && item[key] !== "NONE")
          .flatMap(key => {
            const [day, month, date, year] = key.split(' ');
            const isoDate = new Date(`${month} ${date}, ${year}`).toISOString().split('T')[0];

            if (item[key] === "All") {
              // Handle the case where the time is "All"
              // Assuming 'data.userTimes' is an array of time ranges
              return data.userTimes.map(({ start, end }) => {
                const isoStart = new Date(`${isoDate}T${start}:00`).toISOString();
                const isoEnd = new Date(`${isoDate}T${end}:00`).toISOString();
                return {
                  date: isoDate,
                  start: isoStart,
                  end: isoEnd,
                  ...staticFields,
                  ...data.userData
                };
              });
            } else {
              // Handle the case where specific time ranges are provided
              const times = splitTimeRange(item[key]);
              return times.map(({ start, end }) => {
                const isoStart = new Date(`${isoDate}T${start}:00`).toISOString();
                const isoEnd = new Date(`${isoDate}T${end}:00`).toISOString();
                return {
                  date: isoDate,
                  start: isoStart,
                  end: isoEnd,
                  ...staticFields,
                  ...data.userData

                };
              });
            }
          });
      })
    );
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
