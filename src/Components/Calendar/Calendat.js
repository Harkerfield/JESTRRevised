import React, { useState } from 'react';

const Calendar = ({ data }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDelete = (eventToDelete) => {
    // Remove event from data (you might need to handle this differently depending on where your data is coming from)
    const updatedData = data.filter(event => event !== eventToDelete);
    // Update data source
    // ...
  };

  const handleEdit = (eventToEdit) => {
    // Edit logic (e.g., open a modal or redirect to edit page)
    // ...
  };

  return (
    <div>
      <ul>
        {data.map(event => (
          <li key={event.date} onClick={() => handleEventClick(event)}>
            {event.date} - {event.event}
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <div>
          <p>Phone: {selectedEvent.phone}</p>
          <button onClick={() => handleEdit(selectedEvent)}>Edit</button>
          <button onClick={() => handleDelete(selectedEvent)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
