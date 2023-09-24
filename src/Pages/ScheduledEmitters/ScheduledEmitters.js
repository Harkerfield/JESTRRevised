import React from 'react';
import Calendar from '../../Components/Calendar/Calendar.js';


function ScheduledEmitters (){

    const eventData = [
        {
          title: "Meeting",
          startTime: "2023-09-24T10:00:00",
          endTime: "2023-09-24T11:00:00",
          location: "Conference Room 1",
        },
        // ...more events
      ];


  return (
    <div>
<Calendar data={eventData} />

    </div>
  );
}

export default ScheduledEmitters;
