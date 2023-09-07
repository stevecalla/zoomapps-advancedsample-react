import React, { useState, useEffect, Suspense, lazy } from "react";

import AttendeeList from "./AttendeeList";
import SearchInput from "./SearchInput";
import CountInfo from "./CountInfo";
import HorizontalLine from "./HorizontalLine";
import TimeStamp from "./TimeStamp";
import ButtonData from "./ButtonData";

// import { mockParticipantData } from "../apis";
// import { getParticipantData } from "../utils/getParticipantData";
// import { sortHandlerScreenName } from "../utils/sort";

import "./ApiScrollview.css";

const ViewCopyLists = lazy(() => import("./ViewCopyLists"));
const BuyACoffee = lazy(() => import("./BuyACoffee"));

function Participants({
  handleInvokeApi,
  participantsMutable,
  participantsNonMutable = [],
  setParticipantsMutable,
  isRenderable,
  isUndoDeleteButtonDisabled,
  setIsUndoDeleteButtonDisabled,
  retrieveDate,

}) {
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

  // DELETE HANLDERS
  const deleteParticipantHandler = (event) => {
    let targetId = event.currentTarget.getAttribute("data-participantid");

    const updatedParticipantData = participantsMutable.filter(
      ({ participantId }) => {
        return targetId !== participantId;
      }
    );
    setParticipantsMutable(updatedParticipantData);
    setIsUndoDeleteButtonDisabled(false);
  };

  const revertDeletedParticipantHandler = () => {
    setParticipantsMutable(participantsNonMutable);
    setIsUndoDeleteButtonDisabled(true);
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
    setIsUndoDeleteButtonDisabled(true);
  };

  const clearSearchHandler = () => {//todo is it working
    let searchInputText = document.getElementById("api-scrollview-input");
    searchInputText.value = null;
    setParticipantsMutable(participantsNonMutable);
  };

  return (
    <div className="api-scrollview">
      <HorizontalLine height="5px" backgroundColor="#0d6efd" />
      <HorizontalLine height="15px" backgroundColor="#ffdc03" />

      <section style={{ display: "flex", width: "300px" }}>
        <CountInfo
          contentDescription="Participants"
          contentLength={
            participantsNonMutable?.length === 0
              ? "..."
              : participantsNonMutable?.length?.toLocaleString()
          }
          spanLeft="98px"
        />
        <CountInfo
          contentDescription="Filtered"
          contentLength={
            participantsMutable?.length
              ? participantsMutable.length.toLocaleString()
              : "..."
          }
          spanLeft="93px"
        />
      </section>

      <HorizontalLine height="" backgroundColor="#0d6efd" margin="0 0 7px 0" />

      <SearchInput
        onChangeHandler={searchHandler}
        onClickHandlerXmark={clearSearchHandler}
      />

      <AttendeeList
        isRenderable={isRenderable}
        renderList={participantsMutable}
        checkHandler={checkHandler}
        xMarkHandler={xMarkHandler}
        deleteParticipantHandler={deleteParticipantHandler}
        listType=""
      />

      <HorizontalLine backgroundColor="#0d6efd" />

      <TimeStamp retrieveDate={retrieveDate} />

      <HorizontalLine backgroundColor="#0d6efd" margin="0 0 4px 0" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <ButtonData
          content="Undo Deleted Participants"
          onClickHandler={revertDeletedParticipantHandler}
          isUndoDeleteButtonDisabled={isUndoDeleteButtonDisabled}
        />
        <ButtonData
          content="Get Current Participants"
          onClickHandler={handleInvokeApi} //fix
          isUndoDeleteButtonDisabled={false}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <ViewCopyLists
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

export default Participants;
