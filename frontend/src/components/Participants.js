import React, { useState, useEffect } from "react";
// import { participants } from "../apis";

import Button from "react-bootstrap/Button";
import "./ApiScrollview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Participants(props) {
  const { handleParticipants } = props;
  const [participantSearchText, setParticipantSearchText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    handleParticipants.length
  );
  const [dateStamp, setDateStamp] = useState("");
  const [timeStamp, setTimeStamp] = useState("");

  const mockParticipants = [
    "Steve Calla",
    "Calla, Steve",
    "Barry Jones",
    "Jones, Barry",
    "Alexander, Jose",
  ];
  // const [participants, setParticipants] = useState(mockParticipants);
  const [participants, setParticipants] = useState(handleParticipants);
  console.log(participants);

  const searchHandler = (e) => {
    console.log(e);

    //eliminate undefined
    let searchBoxTarget =
      e.target?.value === undefined ? "" : e.target?.value?.toLowerCase();
    let deleteIconTarget =
      e.currentTarget?.previousElementSibling?.value === undefined
        ? ""
        : e.currentTarget?.previousElementSibling?.value.toLowerCase();

    // console.log('1');
    // console.log(searchBoxTarget);
    // console.log(e.target.value === undefined);
    // console.log(e.target?.value);
    // console.log('2');
    // console.log(deleteIconTarget);
    // console.log(e.currentTarget.previousElementSibling?.value === undefined);
    // console.log(e.currentTarget?.previousElementSibling?.value);
    // console.log('3');
    // console.log(e.target?.value?.toLowerCase() ? e.target?.value?.toLowerCase() : e.currentTarget?.previousElementSibling?.value.toLowerCase())

    let searchInputText = searchBoxTarget ? searchBoxTarget : deleteIconTarget;
    let lowerCase = searchInputText;
    setParticipantSearchText(lowerCase);
  };

  const filteredParticipants = participants?.sort().filter((participant) => {
    if (participantSearchText === "") {
      return participant;
    } else {
      return participant.toLowerCase().includes(participantSearchText);
    }
  });

  const resetSearchInputValue = (event) => {
    // console.log(event);
    // console.log(event.target);
    // console.log(event.currentTarget);
    // console.log(event.currentTarget.previousElementSibling);
    let searchInputText = event.currentTarget.previousElementSibling;
    searchInputText.value = "";
    searchHandler(event);
  };

  const deleteParticipant = (event) => {
    let participantName = event.currentTarget.getAttribute("data-name");
    const updatedParticipantData = participants.filter((participant) => {
      console.log(participant + " " + participantName);
      return participant !== participantName;
    });
    console.log(updatedParticipantData);
    setParticipants(updatedParticipantData);
    console.log(participants);
    setIsDisabled(false);
  };

  const restoreList = () => {
    // setParticipants(mockParticipants);
    setParticipants(handleParticipants);
    setIsDisabled(true);
  };

  const getDate = () => {
    //GET TODAY'S dateListlet date = new Date();
    let date = new Date();
    console.log(date);

    // set options for date
    let options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    setDateStamp(Intl.DateTimeFormat("en-US", options).format(date));
    // "Mon, Aug 21, 2023"
    getTime(date);
  };

  const getTime = (date) => {
    // set options for hour minute timezone
    let options = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    setTimeStamp(Intl.DateTimeFormat("en-US", options).format(date));
    // "12:34 PM MDT"
  };

  useEffect(() => {
    getDate();
  });

  return (
    <div className="api-scrollview">
      <p>Total Participants: {numberOfParticipants} </p>
      <p>Date: {dateStamp}</p>
      <p>Time: {timeStamp}</p>
      <div style={{ position: "relative" }}>
        <input
          placeholder="Search for participants"
          onChange={searchHandler}
          label="Search"
          id="api-scrollview-input"
          style={{ width: "75%", padding: "7px" }}
        />
        <FontAwesomeIcon
          icon="fa-solid fa-xmark-circle"
          size="lg"
          // icon="fa-trash"
          style={{
            position: "absolute",
            right: "85px",
            top: "20px",
            color: "gray",
          }}
          className=""
          onClick={resetSearchInputValue}
        />
      </div>
      <div className="api-buttons-list">
        {filteredParticipants?.map((participant, index) => (
          <div key={index} style={{ position: "relative" }}>
            <p
              style={{
                width: "98%",
                cursor: "default",
                color: "white",
                backgroundColor: "#0d6efd",
                borderRadius: "7px",
                textAlign: "center",
                padding: "7px",
              }}
            >
              {participant}
            </p>
            <FontAwesomeIcon
              icon="fa-trash"
              className=""
              data-target={`${index}`}
              data-name={`${participant}`}
              onClick={deleteParticipant}
              style={{
                position: "absolute",
                right: "20px",
                top: "10px",
                color: "white",
              }}
            />
          </div>
        ))}
      </div>
      <hr className="hr-scroll-border"></hr>
      <Button
        onClick={restoreList}
        disabled={isDisabled}
        style={{ width: "300px", height: "38px" }}
      >
        Restore Deleted Participants
      </Button>
    </div>
  );
}

export default Participants;
