import React, { useState, useEffect, Suspense, lazy } from "react";
import { mockParticipantData } from "../apis";

import AttendeeList from "./AttendeeList";
import CountInfo from "./CountInfo";
import HorizontalLine from "./HorizontalLine";
import TimeStamp from "./TimeStamp";
import ButtonData from "./ButtonData";

import { getParticipantData } from "../utils/getParticipantData";
import { sortHandlerScreenName } from "../utils/sort";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ApiScrollview.css";

import { handleSimilarityScores } from "../utils/similarityScoring";
import Accordion from "react-bootstrap/Accordion";

const CopyToClipBoard = lazy(() => import("./CopyToClipBoard"));
const BuyACoffee = lazy(() => import("./BuyACoffee"));

function Attendance() {
  const [participantsNonMutable, setParticipantsOriginal] = useState([]); //original array
  const [participantsMutable, setParticipantsMutable] = useState(); //mutable copy of original
  const [isRenderable, SetIsRenderable] = useState(false);

  const [retrieveDate, setRetrieveDate] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  // const [ attendeeRoster, setAttendeeRoster] = useState(["steve calla", "b", "c", "d", "alex jones", "f", ]);
  const [attendeeRoster, setAttendeeRoster] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [presentResults, setPresentResults] = useState([]);
  const [absentResults, setAbsentResults] = useState([]);

  //SIMILARITY SCORING
  useEffect(() => {
    markAttendance();
    /* eslint-disable */
  }, [attendeeRoster]);

  // set presentResults and absentResults;
  useEffect(() => {
    if (matchResults.length) {
      setPresentResults(
        matchResults.filter(({ maxSimilarity }) => maxSimilarity > 0.5)
      );
      setAbsentResults(
        matchResults.filter(({ maxSimilarity }) => maxSimilarity <= 0.5)
      );
    }
  }, [attendeeRoster, matchResults]);

  //INITIAL API CALL
  useEffect(() => {
    //todo
    // timeout allows the api to configure preventing error
    setTimeout(() => {
      handleInvokeApi();
      SetIsRenderable(true); //used to update date/time
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
      setParticipantsMutable(sortedParticipants); //todo remove
      setRetrieveDate(!retrieveDate); //get timestamp info
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // MARK HANLDERS
  const checkHandler = (event) => {
    //todo
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
    //todo
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

  //TODO
  // ATTENDEE FUNCTIONS
  const handleAttendeeInput = () => {
    const textInput = document.querySelector("textarea").value;
    console.log(textInput);

    const attendees = textInput.split(";").map((name, index) => {
      name = name.trim();
      return {
        participantId: index,
        screenName: name,
      };
    });
    let sortedAttendees = sortHandlerScreenName(attendees);
    setAttendeeRoster(sortedAttendees);
    console.log(attendees);

    clearIconColor();
  };

  const clearIconColor = () => {
    let attendanceRosterDivs = document.querySelectorAll(".attendance-roster");

    attendanceRosterDivs.forEach((attendanceRosterDiv, i) => {
      const svgElements = attendanceRosterDiv.querySelectorAll("svg");

      if (svgElements.length >= 1) {
        const firstSVGElement = svgElements[0];
        const secondSvgElement = svgElements[1];

        firstSVGElement.setAttribute("data-color", "gray");
        secondSvgElement.setAttribute("data-color", "gray");

        firstSVGElement.setAttribute(
          "style",
          "color: gray; position: absolute; right: 40px; top: 11px; "
        );

        secondSvgElement.setAttribute(
          "style",
          "color: gray; position: absolute; right: 18px; top: 11px; "
        );
      }
    });
  };

  // MARK ATTENDANCE
  const markAttendance = async () => {
    //todo refactor
    let scores = [];
    setTimeout(() => {
      scores = getMatchScores();
    }, 1000);

    setTimeout(() => {
      setIconStyle(scores);
    }, 3000);
  };

  const getMatchScores = () => {
    let scores = [];
    scores = handleSimilarityScores(attendeeRoster, participantsNonMutable);

    setMatchResults(
      scores.map((match) => {
        console.log(match);
        return {
          matchResults,
          index: match.index,
          attendeeName: match.attendeeName,
          participantId: match.participantId,
          matchName: match.matchName,
          maxSimilarity: match.maxSimilarity,
        };
      })
    );

    return scores;
  };

  const setIconStyle = (scores) => {
    let attendanceRosterDivs = document.querySelectorAll(".attendance-roster");
    console.log(attendanceRosterDivs);

    attendanceRosterDivs.forEach((attendanceRosterDiv, i) => {
      const svgElements = attendanceRosterDiv.querySelectorAll("svg");

      console.log(svgElements);

      if (svgElements.length >= 1) {
        const firstSVGElement = svgElements[0];
        const secondSvgElement = svgElements[1];

        if (scores?.length >= 1 && parseFloat(scores[i]?.maxSimilarity) > 0.5) {
          console.log("yes");

          firstSVGElement.setAttribute("data-color", "green");
          secondSvgElement.setAttribute("data-color", "gray");

          firstSVGElement.setAttribute(
            "style",
            "color: green; position: absolute; right: 40px; top: 11px; transform: scale(1.3); "
          );

          secondSvgElement.setAttribute(
            "style",
            "color: gray; position: absolute; right: 18px; top: 11px; "
          );
        } else if (scores.length >= 1) {
          console.log("no");

          secondSvgElement.setAttribute("data-color", "red");
          firstSVGElement.setAttribute("data-color", "gray");

          secondSvgElement.setAttribute(
            "style",
            "color: red; position: absolute; right: 18px; top: 11px; transform: scale(1.3); "
          );

          firstSVGElement.setAttribute(
            "style",
            "color: gray; position: absolute; right: 40px; top: 11px; "
          );
        } else {
          console.log(scores[i]);
        }
      }
    });
  };
  //TODO END

  return (
    <div className="api-scrollview">
      <HorizontalLine height="5px" backgroundColor="#0d6efd" />
      <HorizontalLine height="15px" backgroundColor="#ffdc03" />

      <CountInfo
        contentDescription="Participants"
        contentLength={
          participantsNonMutable?.length === 0
            ? "..."
            : participantsNonMutable.length
        }
      />
      <CountInfo
        contentDescription="Roster"
        contentLength={matchResults?.length ? matchResults.length : "..."}
        // spanLeft="267px"
      />
      <section style={{ display: "flex" }}>
        <CountInfo
          contentDescription="Present"
          contentLength={presentResults?.length ? presentResults.length : "..."}
          spanLeft="130px"
        />
        <CountInfo
          contentDescription="Absent"
          contentLength={absentResults?.length ? absentResults.length : "..."}
          spanLeft="112px"
        />
      </section>

      <HorizontalLine height="" backgroundColor="#0d6efd" margin="0 0 7px 0" />

      {/* //todo start */}
      <Accordion
        style={{ position: "relative", width: "300px", marginBottom: "5px" }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ width: "300px" }}>
            {/* {copiedAll ? `Copied! ${timeLeft}` : "View All"} */}
            {`Enter Attendee Roster`}
          </Accordion.Header>
          <FontAwesomeIcon
            icon="fa-solid fa-rotate-right"
            title="Submit roster"
            style={
              submitIsDisabled
                ? { display: "none" }
                : {
                    zIndex: 4,
                    position: "absolute",
                    right: "60px",
                    top: "11px",
                    color: "gray",
                  }
            }
            onClick={handleAttendeeInput}
          />
          {/* <FontAwesomeIcon icon="fa-solid fa-save" size="sm" /> */}
          <Accordion.Body
            onChange={(event) =>
              event.target.value.length > 0
                ? setSubmitIsDisabled(false)
                : setSubmitIsDisabled(true)
            }
            as="textarea"
            placeholder={`Enter roster with semi-colon separator (i.e. "John Doe; Doe, Jane"). Click submit button.`}
            style={{
              overflow: "auto",
              height: "150px",
              width: "295px",
              border: "none",
            }}
          >
            {/* {allParticipantsString === "[]" ? "No Data Loaded" : allParticipantsString} */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* //todo END */}

      <AttendeeList
        isRenderable={isRenderable}
        renderList={attendeeRoster}
        checkHandler={checkHandler}
        xMarkHandler={xMarkHandler}
        listType="attendance-roster"
        isDeletable={false}
      />

      <HorizontalLine backgroundColor="#0d6efd" />

      <TimeStamp retrieveDate={retrieveDate} />

      <HorizontalLine backgroundColor="#0d6efd" margin="0 0 4px 0" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <ButtonData
          content="Refresh Participants"
          onClickHandler={handleInvokeApi}
          isDisabled={false}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <CopyToClipBoard
            allParticipants={participantsNonMutable}
            participantsMutable={participantsMutable}
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
