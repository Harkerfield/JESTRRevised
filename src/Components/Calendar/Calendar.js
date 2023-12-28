import React, { useContext, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ConfigContext } from "../../Provider/Context.js";
import ModalChildren from "../Modal/ModalChildren.js";
import { useListItemPermissionCheck } from "../../hooks/useListItemPermissionCheck.js";
import { useListIPatchItem } from "../../hooks/useListIPatchItem.js";
import { none } from "ol/centerconstraint.js";
import "./CalendarStyles.css";
const localizer = momentLocalizer(moment); // Create a localizer using moment

const CalendarComponent = ({ data, loading, error }) => {
  const config = useContext(ConfigContext);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setshowViewModal] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [fullControl, setFullControl] = useState(false);
  const { checkPermissions } = useListItemPermissionCheck();
  const { updateItem } = useListIPatchItem();
  const [editedEvent, setEditedEvent] = useState(null);

  const handleChange = (e) => {
    e.preventDefault();
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setshowViewModal(true);
  };

  useEffect(() => {
    const checkEditPermissions = async () => {
      if (selectedEvent) {
        const { canEdit, hasFullControl } = await checkPermissions(
          config.lists.scheduleList,
          selectedEvent.Id,
        );

        if (canEdit) {
          console.log("User can edit this item.");
          setCanEdit(canEdit);
        }
        if (hasFullControl) {
          console.log("User has full control over this item.");
          setFullControl(hasFullControl);
        }
      }
    };

    checkEditPermissions();
  }, [selectedEvent]);

  const handleEditEvent = () => {
    setEditedEvent(selectedEvent);
    setshowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setshowViewModal(false);
    setSelectedEvent(null);
  };

  const handleCloseEditModal = () => {
    setshowEditModal(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (editedEvent) {
      try {
        const updatedData = {
          Title: editedEvent.title,
          start: new Date(editedEvent.start)
            .toISOString()
            .replace(/\.000Z$/, "Z"),
          end: new Date(editedEvent.end)
            .toISOString()
            .replace(/\.000Z$/, "Z"),
          // start: editedEvent.start,
          // end: editedEvent.end,
          equipmentRequested: editedEvent.equipmentRequested,
          typeOfThreat: editedEvent.typeOfThreat,
          range: editedEvent.range,
          location: editedEvent.location,
          requestStatus: fullControl ? editedEvent.requestStatus : "Pending",
          pocName: editedEvent.pocName,
          pocNumber: editedEvent.pocNumber,
          pocEmail: editedEvent.pocEmail,
          pocSquadron: editedEvent.pocSquadron,
          notes: editedEvent.notes,
          threatId: editedEvent.threatId,
        };

        const result = await updateItem(
          config.lists.scheduleList,
          editedEvent.Id,
          updatedData,
        );
        if (result) {
          // Handle success - possibly refresh data or give user feedback
          console.log("Item updated successfully", result);
        }
      } catch (error) {
        // Handle error - give user feedback
        console.error("Error updating item:", error);
      } finally {
        setshowEditModal(false);
      }
    }
  };

  const handleSelectSlot = (slotInfo, browserEvent) => {
    if (browserEvent) {
      browserEvent.preventDefault(); // Prevent the default browser event action
    }

    // Handle slot selection logic
    console.log("Selected slot:", slotInfo);
  };

  const dayPropGetter = (date) => {
    const now = moment();
    if (now.isSame(date, "day") && now.hours() === moment(date).hours()) {
      return {
        style: {
          backgroundColor: "orange", // Highlight color for current time slot
        },
      };
    }
  };

  const convertToDateObject = (dateStr) => {
    return moment(dateStr).toDate(); // Convert to JavaScript Date object
  };

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.map((event) => ({
          ...event,
          start: convertToDateObject(event.start),
          end: convertToDateObject(event.end),
        })),
      );
    }
  }, [, data, error]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#3174ad"; // Default color
    if (event.requestStatus === "Pending") {
      backgroundColor = "blue";
    } else if (event.requestStatus === "Approved") {
      backgroundColor = "green";
    } else if (event.requestStatus === "Rejected") {
      backgroundColor = "red";
    }
    return {
      style: { backgroundColor },
    };
  };

  const CustomEvent = ({ event }) => {
    // Custom component for rendering events
    return (
      <span>
        <strong>
          {event.equipmentRequested}/{event.typeOfThreat}
        </strong>{" "}
        | {event.pocSquadron}
      </span>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Calendar
        localizer={localizer}
        events={filteredData}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85vh" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent, // Use custom event component
        }}
      />

      {showViewModal && (
        <ModalChildren onClose={handleCloseViewModal}>
          <div style={{ display: "none" }}>{JSON.stringify(selectedEvent)}</div>

          {selectedEvent && (
            <div>
              <div>
                <h3>{selectedEvent.title}</h3>
              </div>
              <div>
                <p>Start: {moment(selectedEvent.start).format("LLL")}</p>
              </div>
              <div>
                <p>End: {moment(selectedEvent.end).format("LLL")}</p>
              </div>
              <div>
                <p>Threat ID: {selectedEvent.threatId}</p>
              </div>
              <div>
                <p>Equipment Requested: {selectedEvent.equipmentRequested}</p>
              </div>
              <div>
                <p>Type of Threat: {selectedEvent.typeOfThreat}</p>
              </div>
              <div>
                <p>Range: {selectedEvent.range}</p>
              </div>
              <div>
                <p>Location: {selectedEvent.location}</p>
              </div>
              <div>
                <p>Request Status: {selectedEvent.requestStatus}</p>
              </div>

              <div>
                <p>POC Name: {selectedEvent.pocName}</p>
              </div>
              <div>
                <p>POC Number: {selectedEvent.pocNumber}</p>
              </div>
              <div>
                <p>POC Email: {selectedEvent.pocEmail}</p>
              </div>
              <div>
                <p>POC Squadron: {selectedEvent.pocSquadron}</p>
              </div>
              <div>
                <p>Notes: {selectedEvent.notes}</p>
              </div>

              {canEdit && (
                <button
                  onClick={handleEditEvent}
                  style={{
                    width: "99%",
                    height: "50px",
                    backgroundColor: "green",
                    color: "black",
                  }}
                >
                  You can Edit this...
                </button>
              )}
            </div>
          )}
        </ModalChildren>
      )}

      {showEditModal && (
        <ModalChildren onClose={handleCloseEditModal}>
          <div style={{ display: "none" }}>{JSON.stringify(selectedEvent)}</div>

          {selectedEvent && (
            <div>
              <div className="inputFormClass">
                <label>Start:</label>
                <input
                  type="datetime-local"
                  name="start"
                  value={moment(editedEvent.start).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleChange}
                />
              </div>
              <div className="inputFormClass">
                <label>End:</label>
                <input
                  type="datetime-local"
                  name="end"
                  value={moment(editedEvent.end).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleChange}
                />
              </div>

              <div className="inputFormClass">
                <label>POC Name:</label>
                <input
                  type="text"
                  name="pocName"
                  value={editedEvent.pocName}
                  onChange={handleChange}
                />
              </div>
              <div className="inputFormClass">
                <label>POC Number:</label>
                <input
                  type="text"
                  name="pocNumber"
                  value={editedEvent.pocNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="inputFormClass">
                <label>POC Email:</label>
                <input
                  type="email"
                  name="pocEmail"
                  value={editedEvent.pocEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="inputFormClass">
                <label>POC Squadron:</label>
                <input
                  type="text"
                  name="pocSquadron"
                  value={editedEvent.pocSquadron}
                  onChange={handleChange}
                />
              </div>

              {canEdit && (
                <>
                  <div>Only an Admin can edit these items.</div>
                  <div className="inputFormClass">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={editedEvent.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inputFormClass">
                    <label>Equipment Requested:</label>
                    <input
                      type="text"
                      name="equipmentRequested"
                      value={editedEvent.equipmentRequested}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inputFormClass">
                    <label>Type of Threat:</label>
                    <input
                      type="text"
                      name="typeOfThreat"
                      value={editedEvent.typeOfThreat}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inputFormClass">
                    <label>Range:</label>
                    <input
                      type="text"
                      name="range"
                      value={editedEvent.range}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inputFormClass">
                    <label>Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={editedEvent.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inputFormClass">
                    <select
                      name="requestStatus"
                      value={editedEvent.requestStatus}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="inputFormClass">
                    <label>Threat Id:</label>
                    <input
                      type="text"
                      name="threatId"
                      value={editedEvent.threatId}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              <div className="inputFormClass">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={editedEvent.notes}
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={(e) => {
                  handleSaveEdit(e);
                }}
                style={{
                  width: "99%",
                  height: "50px",
                  backgroundColor: "green",
                  color: "black",
                }}
              >
                Save
              </button>
            </div>
          )}
        </ModalChildren>
      )}
    </div>
  );
};

export default CalendarComponent;
