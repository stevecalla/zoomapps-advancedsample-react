import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

function ViewItem({
  eventKeyProp,
  copyToClipboard,
  copyString,
  isClickable,
  copiedAll,
  timeRemaining,
  buttonContent,
  buttonClicked,
}) {
  const [isHovering, setIsHovering] = useState(false);

  const stopPropagation = (event) => {
    event.stopPropagation(); //prevents accordion from opening when clipboard is clicked
  };

  return (
    <Accordion.Item eventKey={eventKeyProp}>
      <Accordion.Header style={{ width: "300px" }}>
        <FontAwesomeIcon
          title="Copy to clipboard"
          icon={faClipboard}
          className="clipboardIcon"
          onClick={(event) => {
            stopPropagation(event); //prevents accordion from opening when clipboard is clicked
            isClickable && copyToClipboard(copyString, buttonClicked);
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            position: "absolute",
            left: "235px",
            color: isHovering && isClickable ? "green" : "gray",
            backgroundColor: "white",
            zIndex: "5",
            transform: isHovering && isClickable && "scale(1.5)",
            cursor: "pointer",
          }}
        />
        {copiedAll ? `Copied! ${timeRemaining}` : buttonContent}
      </Accordion.Header>
      <Accordion.Body style={{ overflow: "auto", height: "150px" }}>
        {copyString === "[]" ? "No Data Loaded" : copyString}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ViewItem;
