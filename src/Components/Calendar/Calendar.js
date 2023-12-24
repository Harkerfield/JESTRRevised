import React, { useContext, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ConfigContext } from "../../Provider/Context.js";
import ModalChildren from "../Modal/ModalChildren.js";
const localizer = momentLocalizer(moment); // Create a localizer using moment

const CalendarComponent = ({ data, loading, error }) => {
  const config = useContext(ConfigContext);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
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
        <strong>
          {event.equipmentRequested}/{event.typeOfThreat}
        </strong>{" "}
        | {event.pocSquadron}
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
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent, // Use custom event component
        }}
      />

      {showModal && (
        <ModalChildren onClose={handleCloseModal}>
          {selectedEvent && (
            <div>
              <h3>{selectedEvent.title}</h3>
              <p>Start: {selectedEvent.start.toString()}</p>
              <p>End: {selectedEvent.end.toString()}</p>
              {/* More event details here */}
            </div>
          )}
        </ModalChildren>
      )}
    </div>
  );
};

export default CalendarComponent;
