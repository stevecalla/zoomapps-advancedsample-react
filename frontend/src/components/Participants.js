import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { invokeZoomAppsSdk, mockParticipantData } from "../apis";
import BuyACoffee from "./BuyACoffee";

import { getDate, getTime } from "../utils/dateInfo";
import { sortHandlerScreenName } from "../utils/sort";
import { getParticipantData } from "../utils/getParticipantData";

import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ApiScrollview.css";
import "./styles/spinner.css";

// import CopyToClipBoard from "./CopyToClipBoard";
const CopyToClipBoard = lazy(() => import("./CopyToClipBoard"));

function Participants() {
  const [participants, setParticipants] = useState([]); //original array
  const [participantsCopy, setParticipantsCopy] = useState(); //mutable copy of original
  const [renderParticipants, setRenderParticipants] = useState(false);

  const [participantSearchText, setParticipantSearchText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const [dateStamp, setDateStamp] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const inputFocusRef = useRef(null);

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

  // CREATE PARTICIPANTS ARRAY & SORT
  useEffect(() => {
    let sortedParticipants = sortHandlerScreenName(participants);
    setParticipantsCopy(sortedParticipants);
    /* eslint-disable */
  }, [participants]);

  //get date
  useEffect(() => {
    setDateStamp(getDate());
    setTimeStamp(getTime());
  }, [dateStamp, timeStamp]);

  // GET PARTICIPANT DATA FROM API
  const handleInvokeApi = async () => {
    try {
      let clientResponse = await getParticipantData("getMeetingParticipants");

      // clientResponse?.participants ? console.log(clientResponse?.participants) : console.log(clientResponse);

      //fix //todo  prod = clientResponse.participants; dev = mockParticipationData
      // const mode = "dev";
      const mode = "prod";

      setParticipantLists(clientResponse);

      // let sortedParticipants = sortHandlerScreenName(
      //   mode === "dev" ? mockParticipantData : clientResponse.participants
      // );
      // setParticipants(sortedParticipants);
      // setParticipantsCopy(sortedParticipants);
      // setIsDisabled(true);

    } catch (error) {
      console.error("Error:", error);
      // alert(error);
    }
  };
  // handleInvokeAPI2();

  const setParticipantLists = (clientResponse) => {
      //fix //todo  prod = clientResponse.participants; dev = mockParticipationData
      // const mode = "dev";
      const mode = "prod";
    let sortedParticipants = sortHandlerScreenName(
      mode === "dev" ? mockParticipantData : clientResponse.participants
    );
    setParticipants(sortedParticipants);
    setParticipantsCopy(sortedParticipants);
    setIsDisabled(true);
  };

  // const handleInvokeApiOriginal = async () => {
  //   console.log("api invoked");
  //   setDateStamp(getDate());
  //   setTimeStamp(getTime());

  //   try {
  //     // Define your API configuration
  //     const apiConfig = {
  //       name: "getMeetingParticipants", // Replace with the actual API name
  //       buttonName: null, // Optional, replace with a button name
  //       options: null, // Optional, replace with API options
  //     };

  //     // Call the invokeZoomAppsSdk function
  //     const clientResponse = await invokeZoomAppsSdk(apiConfig)();
  //     //convert response to an array
  //     // convertObjectToArray(clientResponse);

  //     //fix //todo  prod = clientResponse.participants; dev = mockParticipationData
  //     const mode = "dev";
  //     // const mode = "prod";

  //     let sortedParticipants = sortHandlerScreenName(
  //       mode === "dev" ? mockParticipantData : clientResponse.participants
  //     );
  //     setParticipants(sortedParticipants);
  //     setParticipantsCopy(sortedParticipants);
  //     setIsDisabled(true);
  //     console.log("Received clientResponse:", clientResponse);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  //Filter the participants array based on search input
  const filteredParticipants = participantsCopy?.filter(({ screenName }) => {
    if (participantSearchText === "") {
      return screenName;
    } else {
      return screenName.toLowerCase().includes(participantSearchText);
    }
  });

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
    searchHandler(event);
  };

  return (
    <div className="api-scrollview">
      <hr
        className="hr-scroll-border"
        style={{
          margin: "0",
          height: "5px",
          borderRadius: "5px",
          backgroundColor: "#0d6efd",
        }}
      ></hr>
      <hr
        className="hr-scroll-border"
        style={{
          margin: "0",
          height: "15px",
          borderRadius: "5px",
          backgroundColor: "#ffdc03",
        }}
      ></hr>
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
      <div className="api-buttons-list" style={{ height: "300px" }}>
        {renderParticipants ? (
          filteredParticipants?.map(({ screenName, participantId }, index) => (
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

export default Participants;
