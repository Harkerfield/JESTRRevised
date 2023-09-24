import React, { useContext, useState, useEffect } from 'react';
import MapAndTools from './Pages/MapAndTools/MapAndTools.js'
import WeeklyScheduler from './Pages/WeeklyScheduler/WeeklyScheduler.js'
import CollapsibleHeader from './Components/CollapsibleHeader/CollapsibleHeader.js';
import Metrics from './Pages/Metrics/Metrics.js';
import { ConfigContext } from './Provider/Context.js';
import Admin from './Pages/Admin/Admin.js'

const App = () => {
  const config = useContext(ConfigContext);
  const [settings, setSettings] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    console.log("config", config)
    setSettings(config)
  }, [config])
  
  if (!settings) { return }
  return (
    <div>
      {JSON.stringify(settings)}
      <CollapsibleHeader>
        <button onClick={() => setActiveSection('emitterScheduling')}>Emitter Scheduling</button>
        <button onClick={() => setActiveSection('otherScheduling')}>SAM/MANPAD Scheduling</button>

        <button onClick={() => setActiveSection('scheduledEmitters')}>View Scheduled Emitters Calendar</button>
        <button onClick={() => setActiveSection('mapTools')}>Map and Tools</button>
        <button onClick={() => setActiveSection('metrics')}>Metrics</button>
        {(settings.admin === true || settings.admin === true) && (
          <button onClick={() => setActiveSection('admin')}>Admin</button>
        )}
        {settings.debug === true && (
          <button onClick={() => setActiveSection('debug')}>Debug</button>
        )}
      </CollapsibleHeader>

      {activeSection === null && (
        <div>
          <h2>Welcome to the JESTR</h2>
        </div>
      )}
      {activeSection === 'emitterScheduling' && (
        <div>
          <WeeklyScheduler />
        </div>
      )}
      {activeSection === 'otherScheduling' && (
        <div>
          Part 2
        </div>
      )}
      {activeSection === 'scheduledEmitters' && (
        <div>
          <h2>Part 3</h2>
        </div>
      )}
      {activeSection === 'mapTools' && (
        <div>
          <MapAndTools />
        </div>
      )}
      {activeSection === 'metrics' && (
        <div>
          <Metrics />
        </div>
      )}
      {activeSection === 'admin' && (
        <div>
          <Admin />
        </div>
      )}
      {activeSection === 'debug' && (
        <div>
          debug
        </div>
      )}


    </div>
  );
};

export default App;
