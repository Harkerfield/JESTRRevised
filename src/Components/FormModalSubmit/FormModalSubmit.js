import React, { useEffect, useState } from "react";

const FormModalSubmit = ({ data, onClose, onPush }) => {
  const [readyToSubmit, setReadyToSubmit] = useState([]);

  const isDateKey = (key) => {
    // Regular expression to match the format 'Day Mon DD YYYY'
    const datePattern = /^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}$/;
    return datePattern.test(key) && !isNaN(Date.parse(key));
  };

  const splitTimeRange = (timeRange) => {
    const [start, end] = timeRange.split("-").map((time) => time.trim());
    return [
      {
        start,
        end,
      },
    ];
  };

  useEffect(() => {
    console.log("testing data before", data);
    setReadyToSubmit(
      data.rowData.flatMap((item) => {
        const staticFields = {};

        // Extract static fields (non-date fields)
        for (const key in item) {
          if (!isDateKey(key)) {
            staticFields[key] = item[key];
          }
        }

        // Create an array of objects for each time range in each date
        return Object.keys(item)
          .filter((key) => isDateKey(key) && item[key] !== "NONE")
          .flatMap((key) => {
            const [day, month, date, year] = key.split(" ");
            const isoDate = new Date(`${month} ${date}, ${year}`)
              .toISOString()
              .split("T")[0];

            if (item[key] === "All") {
              // Handle the case where the time is "All"
              // Assuming 'data.userTimes' is an array of time ranges
              return data.userTimes.map(({ start, end }) => {
                const isoStart = new Date(
                  `${isoDate}T${start}:00`,
                ).toISOString();
                const isoEnd = new Date(`${isoDate}T${end}:00`).toISOString();
                return {
                  start: isoStart,
                  end: isoEnd,
                  // notes: notes,
                  equipmentRequested: staticFields.Title,
                  typeOfThreat: staticFields["System Type"],
                  range: staticFields.range,
                  location: staticFields.location,
                  // requestStatus: staticFields...
                  ...data.userData,
                };
              });
            } else {
              // Handle the case where specific time ranges are provided
              const times = splitTimeRange(item[key]);
              return times.map(({ start, end }) => {
                const isoStart = new Date(
                  `${isoDate}T${start}:00`,
                ).toISOString();
                const isoEnd = new Date(`${isoDate}T${end}:00`).toISOString();
                return {
                  start: isoStart,
                  end: isoEnd,
                  // notes: notes,
                  equipmentRequested: staticFields.Title,
                  typeOfThreat: staticFields["System Type"],
                  range: staticFields.range,
                  location: staticFields.location,
                  // requestStatus: staticFields...
                  ...data.userData,
                };
              });
            }
          });
      }),
    );
  }, [data]);

  // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

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
        {/* {Debug} */}
        {/* <pre>{JSON.stringify(readyToSubmit, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(data.rowData.map(item => {
          return item
        }), null, 2)}</pre>  */}

        {readyToSubmit.map((item) => {
          const startDate = new Date(item.start);
          const endDate = new Date(item.end);
          console.log("Item to check", item);
          return (
            <>
              <div>
                {item.pocName} | {item.pocNumber} | {item.pocSquadron}
              </div>
              <div>
                {item.equipmentRequested} | {startDate.toDateString("en-US")} |{" "}
                {startDate.toLocaleTimeString("en-US", options)} -{" "}
                {endDate.toLocaleTimeString("en-US", options)}
              </div>
              <br />
            </>
          );
        })}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: "99%",
              height: "50px",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              onPush(e, readyToSubmit);
            }}
            style={{
              width: "99%",
              height: "50px",
              backgroundColor: "green",
              color: "white",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModalSubmit;
