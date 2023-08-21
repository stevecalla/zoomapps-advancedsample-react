import { invokeZoomAppsSdk } from "../apis";
import "../assets/images/";

function BuyACoffee() {
  const api = {
    name: "openUrl",
    options: {
      url: "https://www.buymeacoffee.com/stevecalla",
    }
  }

  return (
      <img 
        src="./bmc-button.png" 
        alt="Buy Me A Coffee"
        onClick={invokeZoomAppsSdk(api)}

      style={{ 
        height: "41px !important", 
        width: "174px !important",
        boxShadow: "0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important", 
      }}/>
      
    //</a>
  );  

}

export default BuyACoffee;