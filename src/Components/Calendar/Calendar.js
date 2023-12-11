import React, { useContext, useMemo, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ConfigContext } from "../../Provider/Context.js";

const localizer = momentLocalizer(moment); // Create a localizer using moment

const CalendarComponent = ({ data, loading, error }) => {
  const config = useContext(ConfigContext);
  const [filteredData, setFilteredData] = useState([]);

  const backupData = useMemo(
    () =>
      [
        {
          title: "Event 1",
          start: moment().set({ hour: 9, minute: 0 }).toDate(),
          end: moment().set({ hour: 11, minute: 30 }).toDate(),
          equipmentRequested: "Equipment A",
          typeOfThreat: "Type X",
          range: "100m",
          location: "Location Y",
          requestStatus: "Rejected",
          notes: "Notes for event 1",
          pocName: "John Doe",
          pocNumber: "123-456-7890",
          pocEmail: "johndoe@example.com",
          pocSquadron: "Squadron Z",
        },
        {
          title: "Event 2",
          start: moment().set({ hour: 10, minute: 0 }).toDate(),
          end: moment().set({ hour: 12, minute: 0 }).toDate(),
          equipmentRequested: "Equipment B",
          typeOfThreat: "Type Y",
          range: "200m",
          location: "Location Z",
          requestStatus: "Approved",
          notes: "Notes for event 2",
          pocName: "Jane Smith",
          pocNumber: "987-654-3210",
          pocEmail: "janesmith@example.com",
          pocSquadron: "Squadron A",
        },
        {
          title: "Event 3",
          start: moment().set({ hour: 12, minute: 30 }).toDate(),
          end: moment().set({ hour: 14, minute: 0 }).toDate(),
          equipmentRequested: "Equipment C",
          typeOfThreat: "Type Z",
          range: "300m",
          location: "Location A",
          requestStatus: "Pending",
          notes: "Notes for event 3",
          pocName: "Sam Brown",
          pocNumber: "456-123-7890",
          pocEmail: "sambrown@example.com",
          pocSquadron: "Squadron B",
        },
        {
          title: "Event 4",
          start: moment().add(1, "days").set({ hour: 10, minute: 0 }).toDate(),
          end: moment().add(1, "days").set({ hour: 11, minute: 0 }).toDate(),
          equipmentRequested: "Equipment D",
          typeOfThreat: "Type A",
          range: "400m",
          location: "Location B",
          requestStatus: "Approved",
          notes: "Notes for event 4",
          pocName: "Lucy Green",
          pocNumber: "321-654-9870",
          pocEmail: "lucygreen@example.com",
          pocSquadron: "Squadron C",
        },
      ],
    [],
  );


  useEffect(() => {
    if (data) {
      const filtered = data;
      //TODO create filtered data
      if (data.length > 0) {
        setFilteredData(filtered);
      } else if (error) {
        setFilteredData(backupData);
      }
    }
  }, [backupData, data, error]);



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
    if (now.isSame(date, 'day') && now.hours() === moment(date).hours()) {
      return {
        style: {
          backgroundColor: 'orange', // Highlight color for current time slot
        }
      };
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    } else if (error) {
      setFilteredData(backupData);
    }
  }, [backupData, data, error]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3174ad'; // Default color
    if (event.requestStatus === 'Pending') {
      backgroundColor = 'orange';
    } else if (event.requestStatus === 'Approved') {
      backgroundColor = 'green';
    } else if (event.requestStatus === 'Rejected') {
      backgroundColor = 'red';
    }
    return {
      style: { backgroundColor }
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
      {JSON.stringify(moment("2023-11-27T18:00:00Z"))}
      {/* {JSON.stringify(moment().add(1, "days").set({ hour: 10, minute: 0 }).toDate())} */}
      
      {/* {() => {return moment("2023-11-27T18:00:00Z")}} */}
      <Calendar
        localizer={localizer}
        events={filteredData}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
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
