import { invokeZoomAppsSdk } from "../apis";
// import "../assets/images/";

import buyCoffee from "./assets/images/bmc-button.png"

function BuyACoffee() {
  
  const api = {
    name: "openUrl",
    options: {
      url: "https://www.buymeacoffee.com/stevecalla",
    }
  }

  return (
      <img 
        // src="./bmc-button.png" 
        src={buyCoffee}
        alt="Buy Me A Coffee"
        onClick={invokeZoomAppsSdk(api)}

      style={{ 
        width: "300px",
        height: "60px",
        boxShadow: "0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important", 
      }}/>
      
    //</a>
  );  

}

export default BuyACoffee;