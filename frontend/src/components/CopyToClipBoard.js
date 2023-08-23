import React, { useState, useEffect } from 'react';
// import Button from "react-bootstrap/Button";
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CopyToClipBoard(props) {
  const { allParticipants = [], filteredParticipants = [] } = props;
  
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFiltered, setCopiedFiltered] = useState(false);

  // const dataToCopy = ['Steve Calla', 'Calla, Steve', 'Barry Jones', 'Jones, Barry'];
  // const dataToCopyString = dataToCopy.sort().join(', ');

  console.log(allParticipants);
  console.log(filteredParticipants);
  
  const allParticipantNames = allParticipants?.map(({ screenName }) => screenName);
  // const allParticipantsString = JSON.stringify(allParticipantNames?.join(', '));
  const allParticipantsString = JSON.stringify(allParticipantNames);

  const filteredParticipantNames = filteredParticipants?.map(({ screenName }) => screenName);
  // const filteredParticipantsString = filteredParticipantNames?.join(', ');
  const filteredParticipantsString = JSON.stringify(filteredParticipantNames);

  // const [timeLeft, setTimeLeft] = useState(5); // Set initial time in seconds

  // const countDown = (buttonClicked) => {
  //   const interval = setInterval(() => {
  //     setTimeLeft(prevTime => {
  //       if (prevTime > 1) {
  //         return prevTime - 1;
  //       } else {
  //         clearInterval(interval);
  //         setTimeLeft(5);
  //         buttonClicked === "filteredData" ? setCopiedFiltered(false) : setCopiedAll(false);
  //         return 0;
  //       }
  //     });
  //   }, 1000);
  // };

  const copyToClipboard = (string, buttonClicked) => {
    const dataTextarea = document.createElement('textarea');
    dataTextarea.value = string;
    document.body.appendChild(dataTextarea);
    dataTextarea.select();

    try {
      document.execCommand('copy');
      buttonClicked === "filteredData" ? setCopiedFiltered(true) : setCopiedAll(true);
      // countDown(buttonClicked, dataTextarea);
    } catch (error) {
      console.error('Failed to copy:', error);
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

  }, [])

  const setAccordionStyle = () => {
    let buttons = document.querySelectorAll('.accordion-header button');

    buttons.forEach(button => {
      button.setAttribute("style", "width: 298px; height: 38px;");
    });

  }
  return (
    <>
      {/* ajust styles... */}
      {/* add copy font awesome icon */}
      {/* x[0].setAttribute("disabled", "false")
      x[0].removeAttribute("disabled")
      let x = document.querySelectorAll('.accordion-header button'); */}

    
      {/* <Accordion defaultActiveKey="0"> */}
      <Accordion style={{ width: "300px", marginBottom: "5px", }}>
        {/* <FontAwesomeIcon icon="fa-sharp fa-light fa-clipboard" /> */}
        <Accordion.Item eventKey="0">
          <Accordion.Header
            onClick={() => copyToClipboard(allParticipantsString, "allData")}
            style={{ width: "300px", }}
            // disabled={ copiedFiltered }
            disabled={true}
          >
            {copiedAll ? `Copied!` : 'Clipboard - Copy All'}
          </Accordion.Header>
          <Accordion.Body>
            {allParticipantsString}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header 
            onClick={() => copyToClipboard(filteredParticipantsString, "filteredData")}
            style={{ width: "300px", }}
            disabled={true}
          >
            {copiedFiltered ? `Copied!` : 'Clipboard - Copy Filtered'}
          </Accordion.Header>
          <Accordion.Body>
            {filteredParticipantsString}
          </Accordion.Body>
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
};

export default CopyToClipBoard;
