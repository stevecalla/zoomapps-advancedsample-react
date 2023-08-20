import { React } from 'react';
// import { participants } from "../apis";
import "./ApiScrollview.css";

function Participants(props) {
  const { handleParticipants } = props;

  return (
    <div className="api-scrollview">
      <div className="api-buttons-list">
        {handleParticipants?.map((participant, index) =>
            <p 
              key={index} 
              style={{ width: '100%', cursor: 'default', color: 'white', backgroundColor: '#0d6efd', borderRadius: '7px', textAlign: 'center', padding: '7px', }}   
              >
                {participant}
            </p>
        )}
      </div>
      <hr className="hr-scroll-border"></hr>
    </div>
  )
}

export default Participants;