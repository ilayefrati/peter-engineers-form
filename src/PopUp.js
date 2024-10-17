import { React, useState } from "react";
import "./PopUp.css";
import Button from "./Button";

function PopUp({ setVisible, type }) {
  const [localStatus, setLocalStatus] = useState(() => {
    try {
      const savedStatus = localStorage.getItem("status");
      return savedStatus
        ? JSON.parse(savedStatus)
        : [
            {
              criteria1: { value: "", type: "text" },
              criteria2: { value: "", type: "text" },
              criteria3: { value: "", type: "text" },
              criteria4: { value: "", type: "date" },
              criteria5: { value: "", type: "text" },
            },
            {
              criteria1: { value: "", type: "text" },
              criteria2: { value: "", type: "text" },
              criteria3: { value: "", type: "text" },
              criteria4: { value: "", type: "date" },
              criteria5: { value: "", type: "text" },
            },
            {
              criteria1: { value: "", type: "text" },
              criteria2: { value: "", type: "text" },
              criteria3: { value: "", type: "text" },
              criteria4: { value: "", type: "date" },
              criteria5: { value: "", type: "text" },
            },
            {
              criteria1: { value: "", type: "text" },
              criteria2: { value: "", type: "text" },
              criteria3: { value: "", type: "text" },
              criteria4: { value: "", type: "date" },
              criteria5: { value: "", type: "text" },
            },
          ];
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return [
        {
          criteria1: { value: "", type: "text" },
          criteria2: { value: "", type: "text" },
          criteria3: { value: "", type: "text" },
          criteria4: { value: "", type: "date" },
          criteria5: { value: "", type: "text" },
        },
        {
          criteria1: { value: "", type: "text" },
          criteria2: { value: "", type: "text" },
          criteria3: { value: "", type: "text" },
          criteria4: { value: "", type: "date" },
          criteria5: { value: "", type: "text" },
        },
        {
          criteria1: { value: "", type: "text" },
          criteria2: { value: "", type: "text" },
          criteria3: { value: "", type: "text" },
          criteria4: { value: "", type: "date" },
          criteria5: { value: "", type: "text" },
        },
        {
          criteria1: { value: "", type: "text" },
          criteria2: { value: "", type: "text" },
          criteria3: { value: "", type: "text" },
          criteria4: { value: "", type: "date" },
          criteria5: { value: "", type: "text" },
        },
      ];
    }
  });

  function handleInputChange(index, criteria, value) {
    const newStatus = [...localStatus]; // Create a new copy of the local status
    newStatus[index][criteria].value = value; // Modify the specific field's value
    setLocalStatus(newStatus); // Update the local state
  }

  function handleSave() {
    localStorage.setItem("status", JSON.stringify(localStatus)); // Save to localStorage
    setVisible(false); // Close the popup after saving
  }

  function handleClose() {
    setVisible(false); // Close the popup on cancel
  }

  return (
    <>
      <div className="overlay" onClick={handleClose}></div>
      <div className="pop-up-container">
        {type === "status" ? (
          <>
            <div className="title_and_lines">
              <hr className="left_line" />
              <h2 className="title">סטטוס דו"ח</h2>
              <hr className="right_line" />
            </div>
            <table className="status-table">
              <thead>
                <tr>
                  <th>אישור לקוח</th>
                  <th>בדק</th>
                  <th>ערך</th>
                  <th>תאריך</th>
                  <th>מהדורה</th>
                </tr>
              </thead>
              <tbody>
                {localStatus.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((criteria, idx) => (
                      <td key={idx}>
                        <input
                          type={row[criteria].type} // Dynamically set input type
                          value={row[criteria].value} // Access the value for the input
                          onChange={(e) =>
                            handleInputChange(index, criteria, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="buttons-container">
              <Button type="primary" text="שמור" onClick={handleSave} />
              <Button type="secondary" text="בטל" onClick={handleClose} />
            </div>
          </>
        ) : (
          <>
            <div className="title_and_lines">
              <hr className="left_line" />
              <h2 className="title">הוראות</h2>
              <hr className="right_line" />
            </div>
            <p>
              דרגת החומרה של אלמנט ודחיפות הביצוע יסומנו עפ"י הטבלה הבאה: <br/> (מדורג
              מהדחיפות הגבוהה אל הנמוכה){" "}
            </p>
            <img
              src="/media/instructions.png"
              className="instructions-img"
            />
            <Button type="primary" text="סגור" onClick={handleClose} />
          </>
        )}
      </div>
    </>
  );
}

export default PopUp;
