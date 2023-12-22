import React from "react";
import GridLayout from "react-grid-layout";

import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";

//https://github.com/react-grid-layout/react-grid-layout

const Grid = ({ children, layout }) => {
  // const layout = [
  //     // { i: "a", x: 0, y: 0, w: 6, h: 1, static: true, , minW: 6, , maxW: 4 },
  //     {
  //       i: "info", x: 0, y: 0, w: 12, h: 3, allowOverlap:true,  minH: 3, static: false, isResizable: true, isDraggable: false,
  //     },
  //     {
  //       i: "map", x: 0, y: 3, w: 12, h: 10, minW: 12, allowOverlap:true,  static: false, isResizable: true, isDraggable: false,
  //     },
  //     {
  //       i: "submitButton",  x: 0, y: 20, w: 12, h: 2, minW: 6, minW: 6, minH: 12, minH: 12, allowOverlap:true, static: false, isResizable: false, isDraggable: false,
  //     },
  //     {
  //       i: "table", x: 0, y: 42, w: 12, h: 4, minW: 12, static: false, isResizable: true, isDraggable: false,
  //     },
  //   ];

  return (
    <>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        width={window.innerWidth}
        autoSize={true}
      >
        {children}
      </GridLayout>
    </>
  );
};

export default Grid;
