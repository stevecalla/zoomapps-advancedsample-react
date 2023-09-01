import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { invokeZoomAppsSdk, mockParticipantData } from "../apis";

import AttendeeList from "./AttendeeList";
import SearchInput from "./SearchInput";
import CountInfo from "./CountInfo";
import HorizontalLine from "./HorizontalLine";
import TimeStamp from "./TimeStamp";
import ButtonData from "./ButtonData";

import { getParticipantData } from "../utils/getParticipantData";
import { sortHandlerScreenName, sortHandlerNames } from "../utils/sort";
import { handleSimilarityScores } from "../utils/similarityScoring";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Accordion from "react-bootstrap/Accordion";
import "./ApiScrollview.css";

const CopyToClipBoard = lazy(() => import("./CopyToClipBoard"));
const BuyACoffee = lazy(() => import("./BuyACoffee"));

function Attendance() {
  const [participantsNonMutable, setParticipantsOriginal] = useState([]); //original array
  const [participantsMutable, setParticipantsMutable] = useState(); //mutable copy of original
  const [renderParticipants, setRenderParticipants] = useState(false);

  const [participantSearchText, setParticipantSearchText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const inputFocusRef = useRef(null);
  const [retrieveDate, setRetrieveDate] = useState(false);

  // const [ attendeeRoster, setAttendeeRoster] = useState(["steve calla", "b", "c", "d", "alex jones", "f", ]);
  const [attendeeRoster, setAttendeeRoster] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [presentResults, setPresentResults] = useState([]);
  const [absentResults, setAbsentResults] = useState([]);

  //SIMILARITY SCORING
  useEffect(() => {
    setTimeout(() => {
      console.log(attendeeRoster);
      console.log(matchResults);
      markAttendance();
    }, 5000);
  }, [attendeeRoster]);

  // Rerender attendeeRoster;
  useEffect(() => {
    renderAttendeeRoster();
    if (matchResults.length) {
      setPresentResults(
        matchResults.filter(({ maxSimilarity }) => maxSimilarity > 0.5)
      );
      setAbsentResults(
        matchResults.filter(({ maxSimilarity }) => maxSimilarity <= 0.5)
      );
    }
  }, [attendeeRoster, participantSearchText, matchResults]);

  //Focus the search input on load
  useEffect(() => {
    inputFocusRef.current.focus();
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

  // CREATE participantsNonMutable ARRAY & SORT
  useEffect(() => {
    setParticipantsMutable(participantsNonMutable);
    /* eslint-disable */
  }, [participantsNonMutable]);

  // GET PARTICIPANT DATA FROM API
  const handleInvokeApi = async () => {
    try {
      let clientResponse = await getParticipantData("getMeetingParticipants");

      //todo //prod = clientResponse.participants; dev = mockParticipationData
      // const mode = "dev";
      const mode = "prod";

      let sortedParticipants = sortHandlerScreenName(
        mode === "dev" ? mockParticipantData : clientResponse.participants
      );

      setParticipantsOriginal(sortedParticipants);
      setParticipantsMutable(sortedParticipants);
    } catch (error) {
      console.error("Error:", error);
    }

    setRetrieveDate(!retrieveDate);
  };

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
  const deleteParticipantHandler = (event) => {
    let targetId = event.currentTarget.getAttribute("data-participantid");

    const updatedParticipantData = participantsMutable.filter(
      ({ participantId }) => {
        return targetId !== participantId;
      }
    );
    setParticipantsMutable(updatedParticipantData);
    setIsDisabled(false);
  };

  const revertDeletedParticipantHandler = () => {
    let sortedParticipants = sortHandlerScreenName(participantsNonMutable);
    setParticipantsMutable(sortedParticipants);
    setIsDisabled(true);
    // setRenderFilteredLength(false);
  };

  // SEARCH HANDLERS
  const searchHandler = (e) => {
    let searchBoxValue = e.target?.value?.toLowerCase();

    const searchResultsParticipants = participantsNonMutable?.filter(
      ({ screenName }) => {
        if (searchBoxValue === "") {
          return screenName;
        } else {
          return screenName.toLowerCase().includes(searchBoxValue);
        }
      }
    );

    setParticipantsMutable(searchResultsParticipants);
    setIsDisabled(true);
  };

  const clearSearchHandler = () => {
    let searchInputText = document.getElementById("api-scrollview-input");
    searchInputText.value = null;
    setParticipantsMutable(participantsNonMutable);
  };

  //TODO
  // ATTENDEE FUNCTIONS
  const handleAttendeeInput = (event) => {
    // console.log('input');
    // console.log(event.currentTarget.value);
    const getAttendeeInput = async () => {
      const attendees = await event.currentTarget.value
        .split("; ")
        .map((name) => name);

      console.log(attendees);
      let sortedAttendees = sortHandlerNames(attendees);
      setAttendeeRoster(sortedAttendees);

      // setAttendeeRoster(attendees);
    };

    getAttendeeInput(); // run it, run it

    // setAttendeeRoster(event.currentTarget.value.split("; ").map(name => name));
    // getAttendeeRoster();
  };

  const [filteredParticipants, setFilteredParticipants] = useState(null);

  const renderAttendeeRoster = () => {
    //Filter the participants array based on search input
    // const filteredParticipants = attendeeRoster?.filter(( attendee ) => {
    //   if (participantSearchText === "") {
    //     return attendee;
    //   } else {
    //     return attendee.toLowerCase().includes(participantSearchText);
    //   }
    // });
    setFilteredParticipants(
      attendeeRoster?.filter((attendee) => {
        if (participantSearchText === "") {
          return attendee;
        } else {
          return attendee.toLowerCase().includes(participantSearchText);
        }
      })
    );
  };

  // MARK ATTENDANCE
  const markAttendance = () => {
    let attendanceRosterDivs = document.querySelectorAll(".attendance-roster");
    console.log(attendanceRosterDivs);

    let scores = [];
    setTimeout(() => {
      scores = handleSimilarityScores(attendeeRoster, participantsNonMutable);
      setMatchResults(
        scores.map((match) => {
          console.log(match);
          return {
            matchResults,
            index: match.index,
            attendee: match.attendee,
            matchName: match.matchName,
            maxSimilarity: match.maxSimilarity,
          };
        })
      );
    }, 1000);

    setTimeout(() => {
      attendanceRosterDivs.forEach((attendanceRosterDiv, i) => {
        const svgElements = attendanceRosterDiv.querySelectorAll("svg");
        if (svgElements.length >= 2) {
          const firstSVGElement = svgElements[0];
          const secondSvgElement = svgElements[1];

          if (scores.length > 1 && parseFloat(scores[i].maxSimilarity) > 0.5) {
            console.log("yes");

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
            console.log("no");

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
            console.log("what what");
          }
        }
      });
    }, 5000);
  };
  //TODO END

  return (
    <div className="api-scrollview">
      <HorizontalLine height="5px" backgroundColor="#0d6efd" />
      <HorizontalLine height="15px" backgroundColor="#ffdc03" />

      <CountInfo
        contentDescription="Total Participants"
        contentLength={
          participantsNonMutable?.length === 0
            ? "..."
            : participantsNonMutable.length
        }
      />
      <CountInfo
        contentDescription="Filtered Participants"
        contentLength={
          participantsMutable?.length ? participantsMutable.length : "..."
        }
      />
      <CountInfo
        contentDescription="Roster"
        contentLength={matchResults?.length ? matchResults.length : "..."}
      />
      <CountInfo
        contentDescription="Present"
        contentLength={presentResults?.length ? presentResults.length : "..."}
      />
      <CountInfo
        contentDescription="Absent"
        contentLength={absentResults?.length ? absentResults.length : "..."}
      />

      <HorizontalLine height="" backgroundColor="#0d6efd" margin="0 0 7px 0" />

      <SearchInput
        onChangeHandler={searchHandler}
        onClickHandlerXmark={clearSearchHandler}
        ref={inputFocusRef}
      />

      {/* todo form */}
      <Accordion
        style={{ position: "relative", width: "300px", marginBottom: "5px" }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ width: "300px" }}>
            {/* {copiedAll ? `Copied! ${timeLeft}` : "View All"} */}
            {`Enter Attendee Roster`}
          </Accordion.Header>
          <Accordion.Body
            as="textarea"
            placeholder="name@example.com"
            style={{
              overflow: "auto",
              height: "150px",
              width: "300px",
              border: "none",
            }}
            onClick={handleAttendeeInput}
          >
            {/* {allParticipantsString === "[]" ? "No Data Loaded" : allParticipantsString} */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="attendee-list" style={{ height: "300px" }}>
        {renderParticipants ? (
          filteredParticipants?.map((attendee, index) => (
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
                onClick={deleteParticipantHandler}
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

      <HorizontalLine backgroundColor="#0d6efd" />

      <TimeStamp retrieveDate={retrieveDate} />

      <HorizontalLine backgroundColor="#0d6efd" margin="0 0 4px 0" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <ButtonData
          content="Undo Deleted Participants"
          onClickHandler={revertDeletedParticipantHandler}
          isDisabled={isDisabled}
        />
        <ButtonData
          content="Get Current Participants"
          onClickHandler={handleInvokeApi}
          isDisabled={false}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <CopyToClipBoard
            allParticipants={participantsNonMutable}
            filteredParticipants={filteredParticipants}
          />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <BuyACoffee />
        </Suspense>
      </div>
    </div>
  );
}

export default Attendance;
