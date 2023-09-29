import React, { useState } from "react";
import "./CollapsibleHeaderVertical.css";

const CollapsibleHeaderVertical = ({
  show,
  hide,
  defaultCollapsed,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="container" onClick={() => setIsCollapsed(!isCollapsed)}>
      <div
        className={`collapsible-header-vertical ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {isCollapsed && <div className="toggle-text">{show}</div>}
        {!isCollapsed && <div className="header-content">{children}</div>}
      </div>
    </div>
  );
};

export default CollapsibleHeaderVertical;
