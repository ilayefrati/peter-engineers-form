import React from "react";
import "./Button.css";

function Button({ type, text, onClick }) {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
