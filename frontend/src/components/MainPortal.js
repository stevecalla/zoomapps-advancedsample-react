import React, { useState, useEffect } from "react";

import Participants from "./Participants";
import Attendance from "./Attendance";

import { mockParticipantData } from "../apis";
import { getParticipantData } from "../utils/getParticipantData";
import { sortHandlerScreenName } from "../utils/sort";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export const MainPortal = () => {

  const [participantsNonMutable, setParticipantsOriginal] = useState([]); //original array
  const [participantsMutable, setParticipantsMutable] = useState(); //mutable copy of original

  const [isRenderable, setIsRenderable] = useState(false); //render date/time
  const [isDisabled, setIsDisabled] = useState(true); //enable delete button

  //INITIAL API CALL
  useEffect(() => {
    //todo
    // timeout allows the api to configure preventing error
    setTimeout(() => {
      handleInvokeApi();
      setIsRenderable(true); //used to update date/time
      setIsDisabled(true); //enable the restore deleted button
    }, 2000);
    /* eslint-disable */
  }, []);

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
        setRetrieveDate(!retrieveDate); //get timestamp info
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
      <Tabs
        defaultActiveKey="attendance"
        // defaultActiveKey="participants"
        id="justify-tab-example"
        className="mb-3 flex-nowrap"
        fill
        style={{ flexWrap: "nowrap", width: "300px", }}
      >
        <Tab eventKey="participants" title="Participants">
          <Participants />
        </Tab>
        <Tab eventKey="attendance" title="Attendance">
          <Attendance />
          {console.log(document.URL)}
        </Tab>
      </Tabs>
  );
};

export default MainPortal;
