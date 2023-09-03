import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Accordion from "react-bootstrap/Accordion";

function AttendeeInput({ handleAttendeeInput, submitIsDisabled, setSubmitIsDisabled }) {

  const attendeeInputRef = useRef(null); //todo

  // Focus the search input on load
  useEffect(() => {
    //todo
    attendeeInputRef.current.focus();
  }, []);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Accordion
      style={{ position: "relative", width: "300px", marginBottom: "5px" }}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header style={{ width: "300px" }}>
          {`Enter Attendee Roster`}
        </Accordion.Header>
        <FontAwesomeIcon
          icon="fa-solid fa-rotate-right"
          title="Submit roster"
          onClick={handleAttendeeInput}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={
            submitIsDisabled
              ? { display: "none" }
              : {
                  zIndex: 4,
                  position: "absolute",
                  right: "60px",
                  top: "11px",
                  color: "green",
                  transform: isHovering ? "scale(1.7)" : "scale(1.2)",
                }
          }
        />
        {/* <FontAwesomeIcon icon="fa-solid fa-save" size="sm" /> */}
        <Accordion.Body
          onChange={(event) =>
            event.target.value.length > 0
              ? setSubmitIsDisabled(false)
              : setSubmitIsDisabled(true)
          }
          as="textarea"
          ref={attendeeInputRef}
          placeholder={`Enter roster with semi-colon separator (i.e. "John Doe; Doe, Jane"). Click submit button.`}
          style={{
            overflow: "auto",
            height: "150px",
            width: "295px",
            border: "none",
          }}
        >
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AttendeeInput;
