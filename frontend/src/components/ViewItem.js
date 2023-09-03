// import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

function ViewItem({eventKeyProp, copyToClipboard, allParticipantsString, isClickable, copiedAll, timeRemaining }) {

  const stopPropagation = (event) => {
    event.stopPropagation(); //prevents accordion from opening when clipboard is clicked
  };

  return (
    <Accordion.Item eventKey={eventKeyProp}>
      <Accordion.Header style={{ width: "300px" }}>
        <FontAwesomeIcon
          title="Copy to clipboard"
          icon={faClipboard}
          // size="lg"
          className="clipboardIcon"
          onClick={(event) => {
            stopPropagation(event); //prevents accordion from opening when clipboard is clicked
            isClickable && copyToClipboard(allParticipantsString, "allData");
          }}
          style={{
            position: "absolute",
            left: "235px",
            color: "gray",
            backgroundColor: "white",
            zIndex: "5",
            transform: "scale(1.2)",
            cursor: "pointer",
          }}
        />
        {copiedAll ? `Copied! ${timeRemaining}` : "View All"}
      </Accordion.Header>
      <Accordion.Body style={{ overflow: "auto", height: "150px" }}>
        {allParticipantsString === "[]"
          ? "No Data Loaded"
          : allParticipantsString}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ViewItem;
