import React from "react";

const ModalChildren = ({ children, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0096ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "5px",
          width: "95%",
          height: "100%",
          // maxHeight: "80%",
          // overflowY: "auto",
        }}
      >
        {children}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChildren;
