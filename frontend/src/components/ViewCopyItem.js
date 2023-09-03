import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

function ViewCopyItem({
  eventKeyProp,
  copyToClipboard,
  copyString,
  isClickable,
  copiedAll,
  buttonContent,
  buttonClicked,
  timeRemaining,
}) {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setAccordionStyle();
  }, []);

  //SETS ACCORDION BUTTON STYLE; NOT AVAILABLE IN BOOTSTRAP STRUCTURE
  const setAccordionStyle = () => {
    let buttons = document.querySelectorAll(".viewCopy-header button");
    
    buttons.forEach((button) => {
      button.setAttribute("style", "width: 298px; height: 38px;");
    });
  };
  
  // PREVENTS ACCORDION FROM OPENING WHEN CLIPBOARD CLICKED
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <Accordion.Item eventKey={eventKeyProp}>
      <Accordion.Header
        className="viewCopy-header"
        style={{
          width: "300px",
        }}
      >
        <div style={copiedAll ? { color: "Green" } : { color: "black" }}>
          {/* {copiedAll ? `Copied! ${timeRemaining}` : buttonContent} */}
          {copiedAll ? `Copied! ✅` : buttonContent}
        </div>
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
            transform: isHovering && isClickable ? "scale(1.7)" : "scale(1.2)",
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
