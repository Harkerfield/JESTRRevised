import React, { useContext, useState, useEffect } from "react";
import CollapsibleHeader from "./Components/CollapsibleHeaderVertical/CollapsibleHeaderVertical.js";

import SharePointData from "./hooks/SPdata/SharePointData.js";

import EmitterScheduling from "./Pages/EmitterScheduling/EmitterScheduling.js";
// otherScheduling
import ScheduledEmitters from "./Pages/ScheduledEmitters/ScheduledEmitters.js";
import MapTools from "./Pages/MapTools/MapTools.js";
import Metrics from "./Pages/Metrics/Metrics.js";
import Admin from "./Pages/Admin/Admin.js";
import Debug from "./Pages/Debug/Debug.js";

import { ConfigContext } from "./Provider/Context.js";

function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    // For old versions of IE
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    // Other browsers
    script.onload = function () {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

const App = () => {
  const config = useContext(ConfigContext);
  const [settings, setSettings] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [defaultCollapsed, setDefaultCollapsed] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    console.log("config", config);
    setSettings(config);
  }, [config]);

  useEffect(() => {
    loadScript("/_layouts/15/sp.js", function () {
      console.log("SP.js loaded");
      setScriptLoaded(true);
    });
  }, []);

  if (!settings) {
    return;
  }
  return (
    <div className="App" style={{ display: "flex" }}>
      {scriptLoaded && <SharePointData />}
      {/* {JSON.stringify(settings)} */}
      <CollapsibleHeader
        show={"Menu"}
        hide={"Hide Menu"}
        defaultCollapsed={defaultCollapsed}
      >
        <button onClick={() => setActiveSection("emitterScheduling")}>
          Emitter Scheduling
        </button>
        <button onClick={() => setActiveSection("otherScheduling")}>
          SAM/MANPAD Scheduling
        </button>
        <button onClick={() => setActiveSection("scheduledEmitters")}>
          View Scheduled Emitters Calendar
        </button>
        <button onClick={() => setActiveSection("mapTools")}>
          Map and Tools
        </button>
        <button onClick={() => setActiveSection("metrics")}>Metrics</button>
        {(settings.admin === true || settings.admin === true) && (
          <button onClick={() => setActiveSection("admin")}>Admin</button>
        )}
        {settings.debug === true && (
          <button onClick={() => setActiveSection("debug")}>Debug</button>
        )}
      </CollapsibleHeader>

      {activeSection === null && (
        <div>
          <h2>Welcome to the JESTR</h2>
        </div>
      )}
      {activeSection === "emitterScheduling" && (
        <div>
          <EmitterScheduling />
        </div>
      )}
      {activeSection === "otherScheduling" && <div>otherScheduling</div>}
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
