import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { invokeZoomAppsSdk, mockParticipantData } from "../apis";

import BuyACoffee from "./BuyACoffee";
import { getDate, getTime } from "../utils/dateInfo";
import { handleSimilarityScores } from "../utils/similarityScoring";



import { getParticipantData } from "../utils/getParticipantData";
import { sortHandlerScreenName, sortHandlerNames } from "../utils/sort";

import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ApiScrollview.css";
import "./styles/spinner.css";

// import CopyToClipBoard from "./CopyToClipBoard";
const CopyToClipBoard = lazy(() => import("./CopyToClipBoard"));

function Attendance() {
  const [participants, setParticipants] = useState([]); //original array
  const [participantsCopy, setParticipantsCopy] = useState(); //mutable copy of original
  const [renderParticipants, setRenderParticipants] = useState(false);

  const [participantSearchText, setParticipantSearchText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const [dateStamp, setDateStamp] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const inputFocusRef = useRef(null);

  // const [ attendeeRoster, setAttendeeRoster] = useState(["steve calla", "b", "c", "d", "alex jones", "f", ]);
  const [ attendeeRoster, setAttendeeRoster] = useState([]);
  const [ matchResults, setMatchResults ] = useState([]);
  const [ presentResults, setPresentResults ] = useState([]);
  const [ absentResults, setAbsentResults ] = useState([]);

  //Focus the search input on load
  useEffect(() => {
    // Focus on the input element when the component is mounted
    if (inputFocusRef.current) {
      inputFocusRef.current.focus();
    }
  }, []);

  //INITIAL API CALL
  useEffect(() => {
    // timeout allows the api to configure preventing error
    setTimeout(() => {
      handleInvokeApi();
      setRenderParticipants(true);
      setIsDisabled(true);
    }, 1000);
    /* eslint-disable */
  }, []);

  //SIMILARITY SCORING
  useEffect(() => {
  //   // setTimeout(() => {
  //   //   handleSimilarityScores();
  //   //   console.log(attendeeRoster);
  //   // }, 1000);

    setTimeout(() => {
      console.log(attendeeRoster);
      console.log(matchResults);
      markAttendance();
    }, 5000);

  }, [attendeeRoster])

  // CREATE PARTICIPANTS ARRAY & SORT
  useEffect(() => {
    let sortedParticipants = sortHandlerScreenName(participants);
    setParticipantsCopy(sortedParticipants);
    /* eslint-disable */
  }, [participants]);

  //get date / time
  useEffect(() => {
    setDateStamp(getDate());
    setTimeStamp(getTime());
  }, [dateStamp, timeStamp]);

  // GET PARTICIPANT DATA FROM API
  // const handleInvokeApi = async () => {
  //   try {
  //     let clientResponse = await getParticipantData("getMeetingParticipants");

  //     // clientResponse?.participants ? console.log(clientResponse?.participants) : console.log(clientResponse);

  //     //fix //todo  prod = clientResponse.participants; dev = mockParticipationData
  //     // const mode = "dev";
  //     const mode = "prod";

  //     setParticipantLists(clientResponse);

  //     // let sortedParticipants = sortHandlerScreenName(
  //     //   mode === "dev" ? mockParticipantData : clientResponse.participants
  //     // );
  //     // setParticipants(sortedParticipants);
  //     // setParticipantsCopy(sortedParticipants);
  //     // setIsDisabled(true);

  //   } catch (error) {
  //     console.error("Error:", error);
  //     // alert(error);
  //   }
  // };
  // // handleInvokeAPI2();
  
  // const setParticipantLists = (clientResponse) => {
  //     //fix //todo  prod = clientResponse.participants; dev = mockParticipationData
  //     // const mode = "dev";
  //     const mode = "prod";
  //   let sortedParticipants = sortHandlerScreenName(
  //     mode === "dev" ? mockParticipantData : clientResponse.participants
  //   );
  //   setParticipants(sortedParticipants);
  //   setParticipantsCopy(sortedParticipants);
  //   setIsDisabled(true);
  // };

  const handleInvokeApi = async () => {
    console.log("api invoked");
    
    setDateStamp(getDate());
    setTimeStamp(getTime());

    try {
      // Define your API configuration
      const apiConfig = {
        name: "getMeetingParticipants", // Replace with the actual API name
        buttonName: null, // Optional, replace with a button name
        options: null, // Optional, replace with API options
      };

      // Call the invokeZoomAppsSdk function
      const clientResponse = await invokeZoomAppsSdk(apiConfig)();
      //convert response to an array
      // convertObjectToArray(clientResponse);

      //fix //todo  prod = clientResponse.participants; dev = mockParticipationData
      const mode = "dev";
      // const mode = "prod";

      let sortedParticipants = sortHandlerScreenName(mode === "dev" ? mockParticipantData : clientResponse.participants);
      setParticipants(sortedParticipants);
      setParticipantsCopy(sortedParticipants);
      setIsDisabled(true);
      console.log("Received clientResponse:", clientResponse);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Rerender attendeeRoster;
  useEffect(() => {
    renderAttendeeRoster();
    if (matchResults.length) {
      setPresentResults(matchResults.filter(({maxSimilarity}) => maxSimilarity > 0.50));
      setAbsentResults(matchResults.filter(({maxSimilarity}) => maxSimilarity <= 0.50));
    }
  }, [attendeeRoster, participantSearchText, matchResults]);
  

  //TODO
  // ATTENDEE FUNCTIONS
  // const input = "Steve Calla; Calla, Steve; Alex, J; Barry Jones; Jones, Barry; Alexander, Jose; mickey mouse; duck, donald";

  const handleAttendeeInput = (event) => {
    // console.log('input');
    // console.log(event.currentTarget.value);
    const getAttendeeInput = async () => {
      const attendees = await event.currentTarget.value.split("; ").map(name => name);

      console.log(attendees);
      let sortedAttendees = sortHandlerNames(attendees);
      setAttendeeRoster(sortedAttendees);

      // setAttendeeRoster(attendees);
    };
  
    getAttendeeInput(); // run it, run it

    // setAttendeeRoster(event.currentTarget.value.split("; ").map(name => name));
    // getAttendeeRoster();
  };

  const [ filteredParticipants, setFilteredParticipants ] = useState(null);

  const renderAttendeeRoster = () => {
    //Filter the participants array based on search input
    // const filteredParticipants = attendeeRoster?.filter(( attendee ) => {
    //   if (participantSearchText === "") {
    //     return attendee;
    //   } else {
    //     return attendee.toLowerCase().includes(participantSearchText);
    //   }
    // });
    setFilteredParticipants(attendeeRoster?.filter(( attendee ) => {
      if (participantSearchText === "") {
        return attendee;
      } else {
        return attendee.toLowerCase().includes(participantSearchText);
      }
    }));
  }

  // MARK ATTENDANCE
  const markAttendance = () => {
    let attendanceRosterDivs = document.querySelectorAll('.attendance-roster');
    console.log(attendanceRosterDivs);

    let scores = [];
    setTimeout(() => {
      scores = handleSimilarityScores(attendeeRoster, participants);
      setMatchResults(scores.map(match => {
        console.log(match);
        return { 
          matchResults,
          index: match.index,
          attendee: match.attendee,
          matchName: match.matchName,
          maxSimilarity: match.maxSimilarity,
        }
      }));
    }, 1000);

    setTimeout(() => {
      attendanceRosterDivs.forEach((attendanceRosterDiv, i) => {
        const svgElements = attendanceRosterDiv.querySelectorAll("svg");
        if (svgElements.length >= 2) {
          const firstSVGElement = svgElements[0];
          const secondSvgElement = svgElements[1];
  
          if (scores.length > 1 && parseFloat(scores[i].maxSimilarity) > 0.50) {
            console.log('yes');

            firstSVGElement.setAttribute("data-color", "green");
            secondSvgElement.setAttribute("data-color", "gray");

            firstSVGElement.setAttribute(
              "style",
              "color: green; position: absolute; right: 60px; top: 11px; transform: scale(1.3); "
            );

            secondSvgElement.setAttribute(
              "style",
              "color: gray; position: absolute; right: 40px; top: 11px; "
            );
          } else if (scores.length > 1) {
            console.log('no');

            secondSvgElement.setAttribute("data-color", "red");
            firstSVGElement.setAttribute("data-color", "gray");

            secondSvgElement.setAttribute(
              "style",
              "color: red; position: absolute; right: 40px; top: 11px; transform: scale(1.3); "
            );

            firstSVGElement.setAttribute(
              "style",
              "color: gray; position: absolute; right: 60px; top: 11px; "
            );
          } else {
            console.log(scores[i]);
            console.log('what what')
          };
        };
      });
    }, 5000);

  };

  //TODO END

  // MARK HANLDERS
  const checkHandler = (event) => {
    let targetId = event.currentTarget.getAttribute("data-participantid");
    let targetColor = event.currentTarget.getAttribute("data-color");
    const targetElement = document.querySelector(
      `[data-participantid="${targetId}"]`
    );

    targetColor === "gray"
      ? targetElement.setAttribute(
          "style",
          "color: green; position: absolute; right: 60px; top: 11px; transform: scale(1.3); "
        )
      : targetElement.setAttribute(
          "style",
          "color: gray; position: absolute; right: 60px; top: 11px; "
        );

    targetColor === "gray"
      ? targetElement.setAttribute("data-color", "green")
      : targetElement.setAttribute("data-color", "gray");

    const prevElement = targetElement.parentElement.querySelectorAll("svg")[1];
    prevElement.setAttribute("data-color", "gray");
    prevElement.setAttribute(
      "style",
      "color: gray; position: absolute; right: 40px; top: 11px; "
    );
  };

  const xMarkHandler = (event) => {
    let targetId = event.currentTarget.getAttribute("data-participantid");
    let targetColor = event.currentTarget.getAttribute("data-color");
    const targetElement = document.querySelector(
      `[data-participantid="${targetId}"]`
    );

    targetColor === "gray"
      ? targetElement.setAttribute(
          "style",
          "color: red; position: absolute; right: 40px; top: 11px; transform: scale(1.3); "
        )
      : targetElement.setAttribute(
          "style",
          "color: gray; position: absolute; right: 40px; top: 11px; "
        );

    targetColor === "gray"
      ? targetElement.setAttribute("data-color", "red")
      : targetElement.setAttribute("data-color", "gray");

    const prevElement = targetElement.parentElement.querySelectorAll("svg")[0];
    prevElement.setAttribute("data-color", "gray");
    prevElement.setAttribute(
      "style",
      "color: gray; position: absolute; right: 60px; top: 11px; "
    );
  };

  // DELETE HANLDERS
  const deleteHandlers = (event) => {
    let targetId = event.currentTarget.getAttribute("data-participantid");
    const updatedParticipantData = participantsCopy.filter(
      ({ screenName, participantId }) => {
        return targetId !== participantId;
      }
    );
    setParticipantsCopy(updatedParticipantData);
    setIsDisabled(false);
    // setRenderFilteredLength(true);
  };

  const revertDeleteHandler = () => {
    let sortedParticipants = sortHandlerScreenName(participants);
    setParticipantsCopy(sortedParticipants);
    setIsDisabled(true);
    // setRenderFilteredLength(false);
  };

  // SEARCH HANDLERS
  const searchHandler = (e) => {
    //eliminate undefined
    let searchBoxTarget =
      e.target?.value === undefined ? "" : e.target?.value?.toLowerCase();
    let deleteIconTarget =
      e.currentTarget?.previousElementSibling?.value === undefined
        ? ""
        : e.currentTarget?.previousElementSibling?.value.toLowerCase();

    let searchInputText = searchBoxTarget ? searchBoxTarget : deleteIconTarget;
    let lowerCase = searchInputText;
    setParticipantSearchText(lowerCase);
  };

  const resetSearchHandler = (event) => {
    let searchInputText = event.currentTarget.previousElementSibling;
    searchInputText.value = "";

    setParticipantSearchText("");
    searchHandler(event);
  };

  return (
    <div className="api-scrollview">

      <HorizontalLine height="5px" backgroundColor="#0d6efd" />
      <HorizontalLine height="15px" backgroundColor="#ffdc03" />

      <p
        style={{
          position: "relative",
          margin: "0",
          width: "200px",
          paddingLeft: "5px",
        }}
      >
        Total Participants:{" "}
        <span
          style={{
            position: "absolute",
            left: "175px",
            left: "268px",
            textAlign: "right",
          }}
        >
          {participants.length === 0 ? "..." : participants.length}
        </span>
      </p>
      <p
        style={{
          position: "relative",
          margin: "0",
          width: "200px",
          paddingLeft: "5px",
        }}
      >
        Filtered Participants:{" "}
        <span
          style={{
            position: "absolute",
            left: "175px",
            left: "268px",
          }}
        >
          {participantsCopy?.length ? participantsCopy.length : "..."}
        </span>
      </p>
      <p
        style={{
          position: "relative",
          margin: "0",
          width: "200px",
          paddingLeft: "5px",
        }}
      >
        Roster:{" "}
        <span
          style={{
            position: "absolute",
            left: "175px",
            left: "268px",
          }}
        >
          {matchResults?.length ? matchResults.length : "..."}
        </span>
      </p>
      <p
        style={{
          position: "relative",
          margin: "0",
          width: "200px",
          paddingLeft: "5px",
        }}
      >
        Present:{" "}
        <span
          style={{
            position: "absolute",
            left: "175px",
            left: "268px",
          }}
        >
          {(presentResults?.length) ? presentResults.length : "..."}
        </span>
      </p>
      <p
        style={{
          position: "relative",
          margin: "0",
          width: "200px",
          paddingLeft: "5px",
        }}
      >
        Absent:{" "}
        <span
          style={{
            position: "absolute",
            left: "175px",
            left: "268px",
          }}
        >
          {(absentResults?.length) ? absentResults.length : "..."}
        </span>
      </p>
      <hr
        className="hr-scroll-border"
        style={{ margin: "0 0 7px 0", backgroundColor: "#0d6efd" }}
      ></hr>
      <div style={{ position: "relative" }}>
        <input
          ref={inputFocusRef}
          placeholder="Search for participants"
          onChange={searchHandler}
          label="Search"
          id="api-scrollview-input"
          style={{
            width: "300px",
            marginTop: "0px",
            marginBottom: "0px",
            padding: "7px",
            paddingLeft: "32px",
          }}
        />
        <FontAwesomeIcon
          icon="fa-search"
          size="lg"
          style={{
            position: "absolute",
            // right: "280px",
            left: "10px",
            top: "10px",
            color: "gray",
            backgroundColor: "white",
          }}
        />
        <FontAwesomeIcon
          title="Clear search"
          icon="fa-solid fa-xmark-circle"
          size="lg"
          style={{
            position: "absolute",
            // right: "20px",
            left: "272px",
            top: "10px",
            color: "gray",
          }}
          className=""
          onClick={resetSearchHandler}
        />
      </div>

      {/* todo form */}
      <Accordion
        style={{ position: "relative", width: "300px", marginBottom: "5px" }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ width: "300px" }}>
            {/* {copiedAll ? `Copied! ${timeLeft}` : "View All"} */}
            {`Enter Attendee Roster`}
          </Accordion.Header>
          <Accordion.Body as="textarea" placeholder="name@example.com" style={{ overflow: "auto", height: "150px", width: "300px", border: "none" }} onClick={handleAttendeeInput}>
            {/* {allParticipantsString === "[]" ? "No Data Loaded" : allParticipantsString} */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="attendee-list" style={{ height: "300px" }}>
        {renderParticipants ? (
          filteredParticipants?.map(( attendee, index ) => (
            <div
              key={index}
              className="attendance-roster"
              style={{ position: "relative", paddingLeft: "10px" }}
            >
              <p
                style={{
                  width: "98%",
                  cursor: "default",
                  borderRadius: "7px",
                  textAlign: "left",
                  margin: 0,
                  padding: "7px 7px 0px 10px",
                }}
              >
                {`${index + 1}) ${attendee}`}
              </p>
              <FontAwesomeIcon
                title="Verified"
                icon="fa-solid fa-check"
                size="lg"
                className="attendance-check"
                // data-participantid={`${participantId - 1000}`}
                data-color={"gray"}
                onClick={checkHandler}
                style={{
                  position: "absolute",
                  right: "60px",
                  top: "11px",
                  color: "gray",
                }}
              />
              <FontAwesomeIcon
                title="Not verified"
                icon="fa-solid fa-xmark"
                size="lg"
                className="attendance-xmark"
                // data-participantid={`${participantId + 1000}`}
                onClick={xMarkHandler}
                style={{
                  position: "absolute",
                  right: "40px",
                  top: "11px",
                  color: "gray",
                }}
              />
              <FontAwesomeIcon
                title="Delete from list"
                icon="fa-solid fa-trash"
                // data-participantid={`${participantId}`}
                data-screenname={`${attendee}`}
                onClick={deleteHandlers}
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "13px",
                  color: "gray",
                }}
              />
            </div>
          ))
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "300px",
                height: "200px",
              }}
            >
              <div className="lds-hourglass"></div>
            </div>
          </>
        )}
      </div>

      <hr
        className="hr-scroll-border"
        style={{ margin: "0", backgroundColor: "#0d6efd" }}
      ></hr>
      <p
        title="Timestamp when data was refreshed"
        style={{ margin: "0", width: "300px", textAlign: "center" }}
      >{`${dateStamp} ${timeStamp}`}</p>
      <hr
        className="hr-scroll-border"
        style={{ margin: "0 0 4px 0", backgroundColor: "#0d6efd" }}
      ></hr>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          onClick={revertDeleteHandler}
          disabled={isDisabled}
          style={{ width: "300px", height: "38px" }}
        >
          Undo Deleted Participants
        </Button>
        <Button
          onClick={handleInvokeApi}
          style={{ width: "300px", height: "38px" }}
        >
          Get Current Participants
        </Button>

        <Suspense fallback={<div>Loading...</div>}>
          <CopyToClipBoard
            allParticipants={participants}
            filteredParticipants={filteredParticipants}
          />
        </Suspense>

        <BuyACoffee />
      </div>
    </div>
  );
}

export default Attendance;
