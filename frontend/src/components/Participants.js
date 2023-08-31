import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { mockParticipantData } from "../apis";

import HorizontalLine from "./HorizontalLine";
import TimeStamp from "./TimeStamp";
import ButtonData from "./ButtonData";

import { getParticipantData } from "../utils/getParticipantData";
import { sortHandlerScreenName } from "../utils/sort";
// import { getDate, getTime } from "../utils/dateInfo";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import "./ApiScrollview.css";
import "./styles/spinner.css";
import SearchInput from "./SearchInput";

const CopyToClipBoard = lazy(() => import("./CopyToClipBoard"));
const BuyACoffee = lazy(() => import("./BuyACoffee"));

function Participants() {
  const [participantsNonMutable, setParticipantsOriginal] = useState([]); //original array
  const [participantsMutable, setParticipantsMutable] = useState(); //mutable copy of original
  const [renderParticipants, setRenderParticipants] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const inputFocusRef = useRef(null);
  const [retrieveDate, setRetrieveDate] = useState(false);

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
    }, 2000);
    /* eslint-disable */
  }, []);

  // CREATE participantsNonMutable ARRAY & SORT
  useEffect(() => {
    setParticipantsMutable(participantsNonMutable);
    /* eslint-disable */
  }, [participantsNonMutable]);

  // useEffect(() => {
  //   setRetrieveDate(!retrieveDate);
  // }, [])

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
    setParticipantsMutable(participantsNonMutable);
    setIsDisabled(true);
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
          }}
        >
          {participantsNonMutable?.length === 0
            ? "..."
            : participantsNonMutable.length}
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
          {participantsMutable?.length ? participantsMutable.length : "..."}
        </span>
      </p>
      
      <HorizontalLine height="" backgroundColor="#0d6efd" margin="0 0 7px 0" />

      <SearchInput
        onChangeHandler={searchHandler}
        onClickHandlerXmark={clearSearchHandler}
        ref={inputFocusRef}
      />

      <div className="api-buttons-list" style={{ height: "300px" }}>
        {renderParticipants ? (
          participantsMutable?.map(({ screenName, participantId }, index) => (
            <div
              key={participantId}
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
                {`${index + 1}) ${screenName}`}
              </p>
              <FontAwesomeIcon
                title="Verified"
                icon="fa-solid fa-check"
                size="lg"
                className=""
                data-participantid={`${participantId - 1000}`}
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
                data-participantid={`${participantId + 1000}`}
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
                data-participantid={`${participantId}`}
                data-screenname={`${screenName}`}
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
            filteredParticipants={participantsMutable}
          />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <BuyACoffee />
        </Suspense>
      </div>
    </div>
  );
}

export default Participants;
