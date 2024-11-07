import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Hebrew } from "flatpickr/dist/l10n/he.js"; // Import Hebrew locale
import "./TextAndInput.css";

function TextAndInput({ label, placeholder, type, value, setValue }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (type === "date") {
      // Initialize flatpickr only if type is "date"
      flatpickr(inputRef.current, {
        locale: Hebrew, // Set to Hebrew locale
        dateFormat: "d/m/Y", // Custom date format (dd/mm/yyyy)
        onChange: (selectedDates) => {
          const formattedDate = selectedDates[0].toLocaleDateString("he-IL"); // Format to only show date
          setValue(formattedDate);
        },
      });
    }
  }, [type, setValue]);

  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <input
        ref={inputRef}
        placeholder={placeholder || (type === "date" ? "dd/mm/yyyy" : "הכנס טקסט")}
        className="input-field"
        type={type === "date" ? "text" : type} // Set to "text" if type is "date" for compatibility with flatpickr
        value={value}
        onChange={type === "date" ? () => {} : handleChange} // Disable onChange for date input
        required
      />
    </div>
  );
}

export default TextAndInput;
