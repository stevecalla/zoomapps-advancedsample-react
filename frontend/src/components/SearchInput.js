import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from 'react';

const SearchInput = forwardRef(function SearchInput({event, onChangeHandler, onClickHandlerXmark}, ref) {
  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        placeholder="Search for participants"
        onChange={(event) => onChangeHandler(event)}
        label="Search"
        id="api-scrollview-input"
        style={{
          width: "300px",
          marginTop: "0px",
          marginBottom: "0px",
          padding: "7px",
          paddingLeft: "32px",
        }}
      />
      <FontAwesomeIcon
        icon="fa-search"
        size="lg"
        style={{
          position: "absolute",
          // right: "280px",
          left: "10px",
          top: "10px",
          color: "gray",
          backgroundColor: "white",
        }}
      />
      <FontAwesomeIcon
        title="Clear search"
        icon="fa-solid fa-xmark-circle"
        size="lg"
        style={{
          position: "absolute",
          // right: "20px",
          left: "272px",
          top: "10px",
          color: "gray",
        }}
        onClick={(event) => onClickHandlerXmark(event)}
      />
    </div>
  );
})

export default SearchInput;
