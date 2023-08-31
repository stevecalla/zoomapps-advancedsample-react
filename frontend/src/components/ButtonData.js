import Button from "react-bootstrap/Button";

function ButtonData({content, onClickHandler, isDisabled}) {
  
  return (
    <Button
      onClick={onClickHandler}
      disabled={isDisabled}
      style={{ width: "300px", height: "38px" }}
    >
      {content}
    </Button>
  );  
}

export default ButtonData;