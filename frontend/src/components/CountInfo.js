import Button from "react-bootstrap/Button";

function CountInfo({countDescription, contentLength}) {
  
  return (
    <p
    style={{
      position: "relative",
      margin: "0",
      width: "200px",
      paddingLeft: "5px",
    }}
  >
    {`${countDescription}:`}
    <span
      style={{
        position: "absolute",
        left: "175px",
        left: "268px",
      }}
    >
      {contentLength}
    </span>
  </p>
  );  
}

export default CountInfo;