import Button from "react-bootstrap/Button";

function CountInfo({contentDescription, contentLength}) {
  
  return (
    <p
    style={{
      position: "relative",
      margin: "0",
      width: "200px",
      paddingLeft: "5px",
    }}
  >
    {`${contentDescription}:`}
    <span
      style={{
        position: "absolute",
        left: "268px",
      }}
    >
      {contentLength}
    </span>
  </p>
  );  
}

export default CountInfo;