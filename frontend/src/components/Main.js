import React from "react";
import { Route } from "react-router-dom";
import Header from "./Header";
import Participants from "./Participants";

export const Main = () => {
  return (
    <div>
      <Header
        navLinks={{ 
          participants: "Participants", 
          tracker: "Attendance" 
        }}
      />
      <Route path="/participants">
        <Participants />
      </Route>
      <Route path="/tracker">
        <Participants />
      </Route>
    </div>
  );
};
