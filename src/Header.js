import React from "react";
import "./Header.css";

function FormHeader() {
  return (
    <div className="header">
      <img src={`${process.env.PUBLIC_URL}/media/peter-engineers-logo.png`} />
    </div>
  );
}

export default FormHeader;
