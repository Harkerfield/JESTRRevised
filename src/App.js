import React, { useState } from 'react';
import MapAndTools from './Pages/MapAndTools/MapAndTools.js'
import WeeklyScheduler from './Pages/WeeklyScheduler/WeeklyScheduler.js'
import ThreatsListEdit from './Pages/EditList/EditLists.js'
import CollapsibleHeader from './Components/CollapsibleHeader/CollapsibleHeader.js';


const App = () => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div>
        <CollapsibleHeader>
        <button onClick={() => setActiveSection('part1')}>Emitter Scheduling</button>
        <button onClick={() => setActiveSection('part2')}>SAM/MANPAD Scheduling</button>
        <button onClick={() => setActiveSection('part3')}>Emitter Schedule</button>
        <button onClick={() => setActiveSection('part4')}>View Scheduled Emitters Calendar</button>
        <button onClick={() => setActiveSection('part5')}>Map and Tools</button>
        <button onClick={() => setActiveSection('part6')}>Metrics</button>
        </CollapsibleHeader>

      {activeSection === null && (
        <div>
          <h2>Welcome to the JESTR</h2>
        </div>
      )}
      {activeSection === 'part1' && (
        <div>
          <WeeklyScheduler />
        </div>
      )}
      {activeSection === 'part2' && (
        <div>
          Part 2
        </div>
      )}
      {activeSection === 'part3' && (
        <div>
          Part 3
        </div>
      )}
      {activeSection === 'part4' && (
        <div>
          <h2>Part 3</h2>
        </div>
      )}
      {activeSection === 'part5' && (
        <div>
          <MapAndTools />
        </div>
      )}
      {activeSection === 'part6' && (
        <div>
          <h2>Part 5</h2>
        </div>
      )}
      {activeSection === 'part7' && (
        <div>
          <ThreatsListEdit />
        </div>
      )}
      {activeSection === 'part8' && (
        <div>
          <h2>Part 7</h2>
        </div>
      )}
     

    </div>
  );
};

export default App;
