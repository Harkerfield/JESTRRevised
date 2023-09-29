import React from "react";

const Modal = ({ data, onClose, onPush }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          width: "80%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <h2>Confirm Data</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre> {/* Pretty print the data */}
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
          <button onClick={onPush}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
