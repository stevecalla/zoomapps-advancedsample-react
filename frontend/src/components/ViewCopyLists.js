import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import ViewItem from "./ViewItem";

function ViewCopyLists(props) {
  const { allParticipants = [], participantsMutable = [] } = props;

  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFiltered, setCopiedFiltered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5); // Set initial time in seconds
  const [isClickable, setIsClickable] = useState(true);

  const allParticipantNames = allParticipants?.map(
    ({ screenName }) => screenName
  ); //data is presorted
  const allParticipantsString = JSON.stringify(allParticipantNames);

  const filteredParticipantNames = participantsMutable?.map(
    ({ screenName }) => screenName
  ); //data is presorted
  const filteredParticipantsString = JSON.stringify(filteredParticipantNames);
  //use filteredParticipantNames?.join(', ') to return a string not an array

  // fix delete at some point
  useEffect(() => {
    // console.log("isClickable= " + isClickable);
    // console.log("timeRemaining=" + timeRemaining);
    // console.log("---------------");

    // setTimeout(() => {
    //   // addTrashIcon();
    // }, 5000);
  }, [isClickable, timeRemaining]);

  const countDown = (buttonClicked) => {
    disableClipboard(); //prevents multiple rapid clicks

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          setTimeRemaining(5);
          enableClipboard();
          buttonClicked === "filteredData"
            ? setCopiedFiltered(false)
            : setCopiedAll(false);

          return 0;
        }
      });
    }, 1000);
  };

  const stopPropagation = (event) => {
    event.stopPropagation(); //prevents accordion from opening when clipboard is clicked
  };

  const copyToClipboard = (string, buttonClicked) => {
    const dataTextarea = document.createElement("textarea");
    dataTextarea.value = string;
    document.body.appendChild(dataTextarea);
    dataTextarea.select();

    try {
      document.execCommand("copy");
      buttonClicked === "filteredData"
        ? setCopiedFiltered(true)
        : setCopiedAll(true);
      countDown(buttonClicked, dataTextarea);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    document.body.removeChild(dataTextarea);
  };

  // PREFERRED WAY TO COPY THE CLIPBOARD; HAD TO USE THE document.execCommand ALTERNATIVE
  // DUE TO ZOOM RESTRICTIONS
  // const copyToClipboard = () => {
  //   if (navigator.clipboard) {
  //     try {
  //       navigator.clipboard.writeText(dataToCopy);
  //       setCopied(true);
  //     } catch (error) {
  //       console.error('Failed to copy:', error);
  //     }
  //   } else {
  //     console.warn("Clipboard API is not available. Using fallback.");
  //     copyToClipboardFallback();
  //   }
  // };

  useEffect(() => {
    setAccordionStyle();
  }, []);

  const setAccordionStyle = () => {
    let buttons = document.querySelectorAll(".accordion-header button");

    buttons.forEach((button) => {
      button.setAttribute("style", "width: 298px; height: 38px;");
    });
  };

  const enableClipboard = () => {
    setIsClickable(true);

    // let clipboardIcon = document.querySelectorAll('.clipboardIcon');
    // clipboardIcon.forEach(button => {
    //   button.setAttribute("style",
    //     "position: absolute; top: 10px; left: 235px; color: gray; background-color: white; z-index: 5; transform: scale(1.2); cursor: pointer; ");
    // });
  };

  const disableClipboard = () => {
    setIsClickable(false);

    // let clipboardIcon = document.querySelectorAll('.clipboardIcon');
    // clipboardIcon.forEach(button => {
    //   button.setAttribute("style",
    //     "position: absolute; top: 53px; left: 235px; color: gray; background-color: white; z-index: 5; transform: scale(1.2); cursor: default; ");
    // });
  };

  return (
    <>
      <Accordion
        style={{ position: "relative", width: "300px", marginBottom: "5px" }}
      >
        <ViewItem 
          eventKeyProp={0}
          copyToClipboard={copyToClipboard}
          allParticipantsString={allParticipantsString}
          isClickable={isClickable}
          copiedAll={copiedAll}
          timeRemaining={timeRemaining}

        />

        <Accordion.Item eventKey="0">
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
            {allParticipantsString === "[]" ? "No Data Loaded" : allParticipantsString}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header style={{ width: "300px" }}>
            <FontAwesomeIcon
              title="Copy to clipboard"
              icon={faClipboard}
              // size="lg"
              className="clipboardIcon"
              onClick={(event) => {
                stopPropagation(event); //prevents accordion from opening when clipboard is clicked
                isClickable &&
                copyToClipboard(filteredParticipantsString, "filteredData")
              }
              }
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
            {copiedFiltered ? `Copied! ${timeRemaining}` : "View Filtered"}
          </Accordion.Header>
          <Accordion.Body style={{ overflow: "auto", height: "150px" }}>
            {filteredParticipantsString === "[]" ? "No Data Loaded" : filteredParticipantsString}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default ViewCopyLists;