import { React, useState } from "react";
import "./TextAndInput.css";

function TextAndInput({ label,placeholder,type }) {
  const [data, setData] = useState("");

  function handleChange(e) {
    setData(e.target.value);
  }

  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <input
        placeholder={placeholder || "הכנס טקסט"}
        className="input-field"
        type={type || "text"}
        value={data}
        onChange={handleChange}
        required
      />
    </div>
  );
}

export default TextAndInput;
