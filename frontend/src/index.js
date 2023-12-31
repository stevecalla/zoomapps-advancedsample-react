import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createHashHistory } from "history";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faXmarkCircle,
  faSearch,
  faCheck,
  faXmark,
  faCopy,
  faClipboard,
  faRotateRight,
  faSave,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faTrash,
  faXmarkCircle,
  faSearch,
  faCheck,
  faXmark,
  faCopy,
  faClipboard,
  faRotateRight,
  faSave,
  faCloud,
  
);

const history = createHashHistory();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
