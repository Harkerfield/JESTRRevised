import React, { useContext, useState, useEffect } from "react";
import CollapsibleHeader from "./Components/HeaderHorizontal/HeaderHorizontal.js";

import Home from "./Pages/Home/Home.js";
import EmitterScheduling from "./Pages/EmitterScheduling/EmitterScheduling.js";
import MovableThreatScheduling from "./Pages/MovableThreatScheduling/MovableThreatScheduling.js";
import ScheduledEmitters from "./Pages/ScheduledEmitters/ScheduledEmitters.js";
import MapTools from "./Pages/MapTools/MapTools.js";
import Metrics from "./Pages/Metrics/Metrics.js";
import Admin from "./Pages/Admin/Admin.js";
import Debug from "./Pages/Debug/Debug.js";

import { ConfigContext } from "./Provider/Context.js";
import "./App.css";
import "./AFStyle.css";
import { disable } from "ol/rotationconstraint.js";

const App = () => {
  const config = useContext(ConfigContext);
  const [settings, setSettings] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    // console.log("config", config);
    setSettings(config);
  }, [config]);

  if (!settings) {
    return;
  }
  return (
    <div className="container af-background-blue">
      <CollapsibleHeader>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection(null);
          }}
          disabled={activeSection === null ? true : false}
        >
          Home
        </button>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("emitterScheduling");
          }}
          disabled={activeSection === "emitterScheduling" ? true : false}
        >
          Emitter Scheduling
        </button>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("movableThreatScheduling");
          }}
          disabled={activeSection === "movableThreatScheduling" ? true : false}
        >
          Movable Targets Scheduling
        </button>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("scheduledEmitters");
          }}
          disabled={activeSection === "scheduledEmitters" ? true : false}
        >
          View Calendar Schedule
        </button>
        <button
          className="navButton"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("mapTools");
          }}
          disabled={activeSection === "mapTools" ? true : false}
        >
          Map and Tools
        </button>
        <button
          className="navButton"
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
          
          className="navButton"
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
          
          className="navButton"
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
      {activeSection === "movableThreatScheduling" && (
        <div>
          <MovableThreatScheduling />
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
