import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Participants from "./Participants";
import Attendance from "./Attendance";

export const MainPortal = () => {
  return (
      <Tabs
        // defaultActiveKey="attendance"
        defaultActiveKey="participants"
        id="justify-tab-example"
        className="mb-3 flex-nowrap"
        fill
        style={{ flexWrap: "nowrap", width: "300px", }}
      >
        <Tab eventKey="participants" title="Participants">
          Tab content for Participants
          <Participants />
        </Tab>
        <Tab eventKey="attendance" title="Attendance">
          Tab content for Attendance
          <Attendance />
          {console.log(document.URL)}
        </Tab>
      </Tabs>
  );
};

export default MainPortal;
