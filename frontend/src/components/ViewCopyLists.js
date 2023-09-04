import React, { useState, useEffect } from "react";

import ViewCopyItem from "./ViewCopyItem";

import Accordion from "react-bootstrap/Accordion";

function ViewCopyLists(props) {
  const { allParticipants = [], participantsMutable = [] } = props;

  return (
    <Accordion
      style={{ position: "relative", width: "300px", marginBottom: "5px" }}
    >
      <ViewCopyItem
        eventKeyProp={0}
        copyData={allParticipants}
        buttonContent="View All"
      />
      <ViewCopyItem
        eventKeyProp={1}
        copyData={participantsMutable}
        buttonContent="View Filtered"
      />
    </Accordion>
  );
}

export default ViewCopyLists;
