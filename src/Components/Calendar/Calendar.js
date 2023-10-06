import React, { useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ConfigContext } from "../../Provider/Context.js";

const localizer = momentLocalizer(moment); // Create a localizer using moment

const CalendarComponent = () => {
  const { admin } = useContext(ConfigContext);

  const events = [
    {
      title: 'Event 1',
      start: moment().set({ hour: 9, minute: 0 }).toDate(),
      end: moment().set({ hour: 11, minute: 30 }).toDate(),
      equipmentRequested: 'Equipment A',
      typeOfThreat: 'Type X',
      range: '100m',
      location: 'Location Y',
      requestStatus: 'Pending',
      notes: 'Notes for event 1',
      pocName: 'John Doe',
      pocNumber: '123-456-7890',
      pocEmail: 'johndoe@example.com',
      pocSquadron: 'Squadron Z',
    },
    {
      title: 'Event 2',
      start: moment().set({ hour: 10, minute: 0 }).toDate(),
      end: moment().set({ hour: 12, minute: 0 }).toDate(),
      equipmentRequested: 'Equipment B',
      typeOfThreat: 'Type Y',
      range: '200m',
      location: 'Location Z',
      requestStatus: 'Approved',
      notes: 'Notes for event 2',
      pocName: 'Jane Smith',
      pocNumber: '987-654-3210',
      pocEmail: 'janesmith@example.com',
      pocSquadron: 'Squadron A',
    },
    {
      title: 'Event 3',
      start: moment().set({ hour: 12, minute: 30 }).toDate(),
      end: moment().set({ hour: 14, minute: 0 }).toDate(),
      equipmentRequested: 'Equipment C',
      typeOfThreat: 'Type Z',
      range: '300m',
      location: 'Location A',
      requestStatus: 'On-hold',
      notes: 'Notes for event 3',
      pocName: 'Sam Brown',
      pocNumber: '456-123-7890',
      pocEmail: 'sambrown@example.com',
      pocSquadron: 'Squadron B',
    },
    {
      title: 'Event 4',
      start: moment().add(1, 'days').set({ hour: 10, minute: 0 }).toDate(),
      end: moment().add(1, 'days').set({ hour: 11, minute: 0 }).toDate(),
      equipmentRequested: 'Equipment D',
      typeOfThreat: 'Type A',
      range: '400m',
      location: 'Location B',
      requestStatus: 'Completed',
      notes: 'Notes for event 4',
      pocName: 'Lucy Green',
      pocNumber: '321-654-9870',
      pocEmail: 'lucygreen@example.com',
      pocSquadron: 'Squadron C',
    },
  ];



  const handleSelectEvent = (event) => {
    if (admin) {
      // Logic for admins to edit/delete time
    } else if (event.creator) { // Assuming there's a creator property on events to check
      // Logic for event creators to edit title
    }
  };

  return (
    <div style={{width:'100vh'}}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default CalendarComponent;
