import React from "react";
import ReactDOM from "react-dom";
import useClickOutside from "../hooks/useClickOutside";

import "../styles.css";

export default function Modal({ children, show }) {
  const clickRef = React.useRef();
  const [clickOutside, setClickOutside] = React.useState(false);

  function onClickOutside() {
    setClickOutside(!clickOutside);
  }

  useClickOutside(clickRef, onClickOutside);

  return (
    show &&
    !clickOutside &&
    ReactDOM.createPortal(
      <div className="modal" ref={clickRef}>
        {children}
      </div>,
      document.querySelector("body")
    )
  );
}
