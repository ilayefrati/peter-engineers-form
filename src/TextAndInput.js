import React from "react";
import "./TextAndInput.css";

function TextAndInput({ label, placeholder, type, value, setValue }) {
  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <input
        placeholder={placeholder || "הכנס טקסט"}
        className="input-field"
        type={type || "text"}
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
}

export default TextAndInput;
