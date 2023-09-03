import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

function ViewCopyItem({
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

  //prevents accordion from open when clipboard clicked
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <Accordion.Item eventKey={eventKeyProp}>
      <Accordion.Header 
        style={{ 
          width: "300px",
          color: "blue",
        }}
      >
        {copiedAll ? `Copied! ${timeRemaining}` : buttonContent}
          <FontAwesomeIcon
            title="Copy to clipboard"
            icon={faClipboard}
            className="clipboardIcon"
            onClick={(event) => {
              stopPropagation(event);
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
      </Accordion.Header>
      <Accordion.Body style={{ overflow: "auto", height: "150px" }}>
        {copyString === "[]" ? "No Data Loaded" : copyString}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ViewCopyItem;
