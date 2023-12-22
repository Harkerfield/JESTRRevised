import React, { useContext, useMemo, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ConfigContext } from "../../Provider/Context.js";

const localizer = momentLocalizer(moment); // Create a localizer using moment

const CalendarComponent = ({ data, loading, error }) => {
  const config = useContext(ConfigContext);
  const [filteredData, setFilteredData] = useState([]);



  const handleSelectEvent = (event) => {
    if (config.admin) {
      // Logic for admins to edit/delete time
    } else if (event.creator) {
      // Assuming there's a creator property on events to check
      // Logic for event creators to edit title
    }
  };

  const handleSelectSlot = (slotInfo, browserEvent) => {
    if (browserEvent) {
      browserEvent.preventDefault(); // Prevent the default browser event action
    }

    // Handle slot selection logic
    console.log("Selected slot:", slotInfo);
  };

  const dayPropGetter = (date) => {
    const now = moment();
    if (now.isSame(date, "day") && now.hours() === moment(date).hours()) {
      return {
        style: {
          backgroundColor: "orange", // Highlight color for current time slot
        },
      };
    }
  };

  const convertToDateObject = (dateStr) => {
    return moment(dateStr).toDate(); // Convert to JavaScript Date object
  };

  useEffect(() => {
    if (data) {
      // const filtered = data;
      //TODO create filtered data

      setFilteredData(
        data.map((event) => ({
          ...event,
          start: convertToDateObject(event.start),
          end: convertToDateObject(event.end),
        })),
      );

    }
  }, [, data, error]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#3174ad"; // Default color
    if (event.requestStatus === "Pending") {
      backgroundColor = "blue";
    } else if (event.requestStatus === "Approved") {
      backgroundColor = "green";
    } else if (event.requestStatus === "Rejected") {
      backgroundColor = "red";
    }
    return {
      style: { backgroundColor },
    };
  };

  const CustomEvent = ({ event }) => {
    // Custom component for rendering events
    return (
      <span>
        <strong>{event.title}</strong> | {event.pocSquadron}
      </span>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Calendar
        localizer={localizer}
        events={filteredData}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85vh" }}
        onSelectEvent={(event) => console.log(event)}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent, // Use custom event component
        }}
      />
    </div>
  );
};

export default CalendarComponent;
