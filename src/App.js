import React, { useContext, useState, useEffect } from "react";
import CollapsibleHeader from "./Components/CollapsibleHeaderHorizontal/CollapsibleHeaderHorizontal.js";

import Home from "./Pages/Home/Home.js";
import EmitterScheduling from "./Pages/EmitterScheduling/EmitterScheduling.js";
import OtherScheduling from "./Pages/OtherScheduling/OtherScheduling.js";
import ScheduledEmitters from "./Pages/ScheduledEmitters/ScheduledEmitters.js";
import MapTools from "./Pages/MapTools/MapTools.js";
import Metrics from "./Pages/Metrics/Metrics.js";
import Admin from "./Pages/Admin/Admin.js";
import Debug from "./Pages/Debug/Debug.js";

import { ConfigContext } from "./Provider/Context.js";
import "./App.css";
import { disable } from "ol/rotationconstraint.js";

const App = () => {
  const config = useContext(ConfigContext);
  const [settings, setSettings] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    console.log("config", config);
    setSettings(config);
  }, [config]);

  if (!settings) {
    return;
  }
  return (
    <div className="app-container">
      <CollapsibleHeader>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection(null);
          }}
          disabled={activeSection === null ? true : false}
        >
          Home
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("emitterScheduling");
          }}
          disabled={activeSection === "emitterScheduling" ? true : false}
        >
          Emitter Scheduling
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("otherScheduling");
          }}
          disabled={activeSection === "otherScheduling" ? true : false}
        >
          SAM/MANPAD Scheduling
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("scheduledEmitters");
          }}
          disabled={activeSection === "scheduledEmitters" ? true : false}
        >
          View Scheduled Emitters Calendar
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("mapTools");
          }}
          disabled={activeSection === "mapTools" ? true : false}
        >
          Map and Tools
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("metrics");
          }}
          disabled={activeSection === "metrics" ? true : false}
        >
          Metrics
        </button>
        {(settings.admin === true || settings.admin === true) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection("admin");
            }}
            disabled={activeSection === "admin" ? true : false}
          >
            Admin
          </button>
        )}
        {settings.debug === true && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection("debug");
            }}
            disabled={activeSection === "debug" ? true : false}
          >
            Debug
          </button>
        )}
      </CollapsibleHeader>

      {activeSection === null && (
        <div>
          <Home />
        </div>
      )}
      {activeSection === "emitterScheduling" && (
        <div>
          <EmitterScheduling />
        </div>
      )}
      {activeSection === "otherScheduling" && (
        <div>
          <OtherScheduling />
        </div>
      )}
      {activeSection === "scheduledEmitters" && (
        <div>
          <ScheduledEmitters />
        </div>
      )}
      {activeSection === "mapTools" && (
        <div>
          <MapTools />
        </div>
      )}
      {activeSection === "metrics" && (
        <div>
          <Metrics />
        </div>
      )}
      {activeSection === "admin" && (
        <div>
          <Admin />
        </div>
      )}
      {activeSection === "debug" && (
        <div>
          <Debug />
        </div>
      )}
    </div>
  );
};

export default App;
