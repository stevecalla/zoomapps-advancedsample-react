/* globals zoomSdk */
import { React, useState } from 'react';
import Participants from "./Participants";
import Export from "./Export";
import BuyACoffee from "./BuyACoffee";
import Button from "react-bootstrap/Button";
// import { apis, invokeZoomAppsSdk, participants } from "../apis";
import { apis } from "../apis";
import "./ApiScrollview.css";

function ApiScrollview() {
  const [apiSearchText, setApiSearchText] = useState("");
  const [participants, setParticipants] = useState([]);

  const searchHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setApiSearchText(lowerCase);
  };

  const filteredApis = apis?.filter((api) => {
    if (apiSearchText === '') {
      return api;
    } else {
      return api.name.toLowerCase().includes(apiSearchText);
    }
  });

  const invokeZoomAppsSdk = api => () => {
    console.log('invokeAPI' + api);
    const { name, buttonName = '', options = null } = api
    const zoomAppsSdkApi = zoomSdk[name].bind(zoomSdk)
  
    zoomAppsSdkApi(options)
      .then(clientResponse => {
        console.log(`${buttonName || name} success with response: ${JSON.stringify(clientResponse)}`);
  
        console.log('test test test');
        console.log(buttonName);
        console.log(`${buttonName || name}`);
        
        if (`${buttonName || name}` === "getMeetingParticipants") {
          console.log(clientResponse);
          console.log(clientResponse.participants[0].screenName);

          clientResponse.participants.forEach((participant) => {
            !participants.includes(participant.screenName) 
              && setParticipants([...participants, participant.screenName])

          });

          console.log(participants);
        }
        return clientResponse;
      })
      .catch(clientError => {
        console.log(`${buttonName || name} error: ${JSON.stringify(clientError)}`);
      });
  }

  return (
    <>
      <div className="api-scrollview">
        <input placeholder="Search for an API"
          onChange={searchHandler}
          label="Search"
          id="api-scrollview-input"
        />

        <div className="api-buttons-list">
          {filteredApis?.map(api =>
            <Button 
              onClick={invokeZoomAppsSdk(api)}
              className="api-button"
              key={api.buttonName ||
                api.name} > {api.buttonName || api.name}
            </Button>
          )}

        </div>
        <hr className="hr-scroll-border"></hr>
      </div>

      {
        participants.length > 0 && 
        <Participants 
          handleParticipants={participants} 
        />
      }

      {
        <Export 
          handleParticipants={participants} 
        />
      }

      {
        <BuyACoffee />
      }

    </>
    )
}

export default ApiScrollview
