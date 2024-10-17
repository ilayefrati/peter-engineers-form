import React, { useState } from "react";
import "./OpeningParagraph.css";
import TextAndInput from "./TextAndInput";

function OpeningParagraph() {
  const [meterial, setMeterial] = useState("");
  const [locationType, setLocationType] = useState("");
  const [customLocationType, setCustomLocationType] = useState(""); // For custom location type
  const [location, setLocation] = useState(""); // For the specific location

  return (
    <>
      <div className="initial-info-container">
        <TextAndInput label="לכבוד:" />
        <TextAndInput label="תאריך:" type="date" placeholder="הזן תאריך" />
        <TextAndInput label="לידי:" />
        <TextAndInput label="פרוייקט:" />
      </div>
      <div className="text-paragraph-top">
        <div className="form-group">
          <label htmlFor="meterials" className="form-label">
            הנדון: דו"ח סקר ויזואלי לאלמנטי קונסטרוקציה
          </label>
          <select
            name="meterials"
            id="meterials"
            value={meterial}
            onChange={(e) => setMeterial(e.target.value)}
            className="form-select"
          >
            <option value="">בחר אופציה</option>
            <option value="פלדה">פלדה</option>
            <option value="בטון">בטון</option>
            <option value="פלדה ובטון">פלדה ובטון</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="locations" className="form-label">
            מיקום:
          </label>
          <select
            name="locations"
            id="locations"
            value={locationType}
            onChange={(e) => {
              setLocationType(e.target.value);
              // Clear the custom location type if a predefined option is selected
              if (e.target.value !== "אחר") setCustomLocationType("");
            }}
            className="form-select"
          >
            <option value="">בחר אופציה</option>
            <option value="מתקן">מתקן</option>
            <option value="גשר">גשר</option>
            <option value="מאצרה">מאצרה</option>
            <option value="מבנה">מבנה</option>
            <option value="אזור">אזור</option>
            <option value="אחר">אחר</option>
          </select>

          {locationType === "אחר" && (
            <input
              type="text"
              className="input-field"
              placeholder="הכנס סוג מיקום"
              value={customLocationType} // This should hold the custom type
              onChange={(e) => setCustomLocationType(e.target.value)}
            />
          )}

          <input
            type="text"
            className="input-field"
            placeholder="הכנס מיקום"
            value={location} // This is for the specific location
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      <div className="text-paragraph-bottom">
        <p>
          בתאריך <TextAndInput type="date" /> נערך סיור ב -{" "}
          {locationType === "אחר" && customLocationType
            ? customLocationType
            : locationType || "_________"}{" "}
          הנ"ל ע"י מהנדס <TextAndInput />
          מטרת הסקר הינה בדיקה וויזואלית לקונס' {meterial || "_________"} ב -{" "}
          {locationType === "אחר" && customLocationType
            ? customLocationType
            : locationType || "_________"}{" "}
          {location || "_________"} ומתן חוות דעת למצב של <TextAndInput />
          הבדיקה וחוות הדעת אינם כוללים התייחסות למצבי קיצון או למקרים אקסצנטרים
          (רעידת אדמה, פעולות חריגות/עומסים חריגים במבנה וכד').
        </p>
      </div>
    </>
  );
}

export default OpeningParagraph;
