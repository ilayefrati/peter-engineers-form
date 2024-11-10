import { React, useState, useEffect } from "react";
import "./PopUp.css";
import Button from "./Button";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Hebrew } from "flatpickr/dist/l10n/he.js"; // Import Hebrew locale
import {
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  AlignmentType,
  TextDirection,
  WidthType,
} from "docx";

function PopUp({ setVisible, type, updateStatusDoc }) {
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

  // Generate the document table on initial load if there's existing status data
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("status"));
    if (savedStatus && savedStatus.length > 0) {
      updateStatusDoc([convertStatusToDocTable()]);
    }
  }, []); // Run only on initial mount

  function handleInputChange(index, criteria, value) {
    const newStatus = [...localStatus];
    newStatus[index][criteria].value = value;
    setLocalStatus(newStatus);
  }

  function convertStatusToDocTable() {
    const fontSize = 24;
    const savedStatus = JSON.parse(localStorage.getItem("status")) || [];

    return new Table({
      visuallyRightToLeft: true,
      alignment: AlignmentType.CENTER,
      width: { 
        size: 100, 
        type: WidthType.AUTO, 
    }, 
    columnWidths: [1000, 1000, 1000], 
  
      rows: [
        new TableRow({
          children: ["אישור לקוח", "בדק", "ערך", "תאריך", "מהדורה"].map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header,
                        size: fontSize,
                        language: "he-IL",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              })
          ),
        }),
        ...savedStatus.map(
          (row) =>
            new TableRow({
              children: Object.values(row).map(
                (cell) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell.value || " ",
                            size: fontSize,
                            language: "he-IL",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        textDirection: TextDirection.RIGHT_TO_LEFT,
                        font: "David",
                      }),
                    ],
                  })
              ),
            })
        ),
      ],
    });
  }

  function handleSave() {
    localStorage.setItem("status", JSON.stringify(localStatus));
    updateStatusDoc([convertStatusToDocTable()]); // Generate doc only when saving
    setVisible(false);
  }

  function handleClose() {
    setVisible(false);
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
            <div className="status-table-container">
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
                          {row[criteria].type === "date" ? (
                            <input
                              type="text" // flatpickr works with text input
                              placeholder="dd/mm/yyyy"
                              value={row[criteria].value}
                              ref={(el) => {
                                if (el) {
                                  flatpickr(el, {
                                    locale: Hebrew,
                                    dateFormat: "d/m/Y",
                                    onChange: (selectedDates) => {
                                      const formattedDate =
                                        selectedDates[0].toLocaleDateString(
                                          "he-IL"
                                        );
                                      handleInputChange(
                                        index,
                                        criteria,
                                        formattedDate
                                      );
                                    },
                                  });
                                }
                              }}
                              onChange={() => {}} // Prevent default onChange
                              required
                            />
                          ) : (
                            <input
                              type={row[criteria].type}
                              value={row[criteria].value}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  criteria,
                                  e.target.value
                                )
                              }
                              required
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
              דרגת החומרה של אלמנט ודחיפות הביצוע יסומנו עפ"י הטבלה הבאה: <br />{" "}
              (מדורג מהדחיפות הגבוהה אל הנמוכה)
            </p>
            <img
              src={`${process.env.PUBLIC_URL}/media/instructions.png`}
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
