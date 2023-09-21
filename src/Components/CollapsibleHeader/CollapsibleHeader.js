import React, { useState } from 'react';
import './CollapsibleHeader.css';

const CollapsibleHeader = ({children}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="collapsible-header">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="toggle-btn">
                {isCollapsed ? 'Show Main Menu' : 'Hide Main Menu'}
            </button>
            {!isCollapsed && (
                <div className="header-content">
                   {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleHeader;
