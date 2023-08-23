import React, { useState, useEffect } from "react";
// import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

function CopyToClipBoard(props) {
  const { allParticipants = [], filteredParticipants = [] } = props;

  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFiltered, setCopiedFiltered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // Set initial time in seconds
  const [isClickable, setIsClickable] = useState(true);

  // const dataToCopy = ['Steve Calla', 'Calla, Steve', 'Barry Jones', 'Jones, Barry'];
  // const dataToCopyString = dataToCopy.sort().join(', ');

  // console.log(allParticipants);
  // console.log(filteredParticipants);

  const allParticipantNames = allParticipants?.map(
    ({ screenName }) => screenName
  ); //data is presorted
  const allParticipantsString = JSON.stringify(allParticipantNames);

  const filteredParticipantNames = filteredParticipants?.map(
    ({ screenName }) => screenName
  ); //data is presorted
  const filteredParticipantsString = JSON.stringify(filteredParticipantNames);
  //use filteredParticipantNames?.join(', ') to return a string not an array

  // fix delete at some point
  useEffect(() => {
    console.log("isClickable= " + isClickable);
    console.log("timeleft=" + timeLeft);
    console.log("---------------");

    setTimeout(() => {
      // addTrashIcon();
    }, 5000);
  }, [isClickable, timeLeft]);

  const countDown = (buttonClicked) => {
    disableClipboard();

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          setTimeLeft(5);
          enableClipboard();

          buttonClicked === "filteredData"
            ? setCopiedFiltered(false)
            : setCopiedAll(false);

          return 0;
        }
      });
    }, 1000);
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

  // const addTrashIcon = () => {
  //   const button = document.querySelector('.accordion-item button');

  //   button.setAttribute("style", "position: relative; top: 10px; left: 235px; color: gray; background-color: white; z-index: 5; transform: scale(1.2); cursor: pointer;");

  //   // Create an <i> element for the Font Awesome icon
  //   const iconElement = document.createElement('svg');
  //   iconElement.setAttribute("aria-hidden", "true");
  //   iconElement.setAttribute("focusable", "false");
  //   iconElement.setAttribute("data-prefix", "far");
  //   iconElement.setAttribute("data-icon", "clipboard");
  //   iconElement.setAttribute("className", "svg-inline--fa fa-clipboard fa-lg clipboardIcon");
  //   iconElement.setAttribute("role", "img");
  //   iconElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  //   iconElement.setAttribute("viewBox", "0 0 384 512");
  //   iconElement.setAttribute("style", "position: absolute; top: 10px; left: 235px; color: gray; background-color: white; z-index: 5; transform: scale(1.2); cursor: pointer;");
  //   // iconElement.setAttribute("", "");

  //   const iconPath = document.createElement('path');
  //   iconPath.setAttribute("fill", "currentColor");
  //   iconPath.setAttribute("d", "M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z");

  //   // Append the icon element to the button
  //   iconElement.appendChild(iconPath);
  //   button.appendChild(iconElement);

  //   // <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clipboard" class="svg-inline--fa fa-clipboard fa-lg clipboardIcon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="position: absolute; top: 10px; left: 235px; color: gray; background-color: white; z-index: 5; transform: scale(1.2); cursor: pointer;"><path fill="currentColor" d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
  // }

  return (
    <>
      <Accordion
        style={{ position: "relative", width: "300px", marginBottom: "5px" }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ width: "300px" }}>
            <FontAwesomeIcon
              icon={faClipboard}
              size="lg"
              className="clipboardIcon"
              onClick={() =>
                isClickable && copyToClipboard(allParticipantsString, "allData")
              }
              style={{
                position: "absolute",
                // top: "10px",
                left: "235px",
                color: "gray",
                backgroundColor: "white",
                zIndex: "5",
                transform: "scale(1.2)",
                cursor: "pointer",
              }}
            />
            {copiedAll ? `Copied! ${timeLeft}` : "View All"}
          </Accordion.Header>
          <Accordion.Body>{allParticipantsString}</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header style={{ width: "300px" }}>
            <FontAwesomeIcon
              icon={faClipboard}
              size="lg"
              className="clipboardIcon"
              onClick={() =>
                isClickable &&
                copyToClipboard(filteredParticipantsString, "filteredData")
              }
              style={{
                position: "absolute",
                // top: "53px",
                left: "235px",
                color: "gray",
                backgroundColor: "white",
                zIndex: "5",
                transform: "scale(1.2)",
                cursor: "pointer",
              }}
            />
            {copiedFiltered ? `Copied! ${timeLeft}` : "View Filtered"}
          </Accordion.Header>
          <Accordion.Body>{filteredParticipantsString}</Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* <p style={{ display: "none" }}>{copiedAll ? allParticipantsString : " "}</p> */}
      {/* <p>{allParticipantsString}</p> */}
      {/* <Button 
        onClick={() => copyToClipboard(allParticipantsString, "allData")}
        style={{ width: "300px", height: "38px" }}
        disabled={copiedFiltered}
      > 
        {copiedAll ? `Copied! ${timeLeft}` : 'Clipboard - Copy All'}
      </Button> */}

      {/* <p style={{ display: "none" }}>{copiedFiltered ? filteredParticipantsString : " "}</p> */}
      {/* <p>{filteredParticipantsString}</p> */}
      {/* <Button 
        onClick={() => copyToClipboard(filteredParticipantsString, "filteredData")}
        style={{ width: "300px", height: "38px" }}
        disabled={copiedAll}
      > 
        {copiedFiltered ? `Copied! ${timeLeft}` : 'Clipboard - Copy Filtered'}
      </Button> */}
    </>
  );
}

export default CopyToClipBoard;
