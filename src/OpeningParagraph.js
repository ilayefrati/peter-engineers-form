import React, { useState, useEffect } from "react";
import "./OpeningParagraph.css";
import TextAndInput from "./TextAndInput";
import { Paragraph, TextRun, AlignmentType } from "docx";

function OpeningParagraph({ updateDoc }) {
  const [meterial, setMeterial] = useState("");
  const [locationType, setLocationType] = useState("");
  const [customLocationType, setCustomLocationType] = useState("");
  const [location, setLocation] = useState("");

  const [recipient, setRecipient] = useState("");
  const [date, setDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [project, setProject] = useState("");

  const [surveyDate, setSurveyDate] = useState("");
  const [engineer, setEngineer] = useState("");
  const [opinion, setOpinion] = useState("");

  // Update doc elements whenever any of the form fields change
  useEffect(() => {
    const docElements = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing
        children: [
          new TextRun({
            text: `לכבוד: ${recipient || "_________"}`,
            font: "David",
            size: 24,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }), // Space after the first paragraph

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing

        children: [
          new TextRun({
            text: `תאריך: ${date || "_________"}`,
            font: "David",
            size: 24,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }), // Space after the first paragraph

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing

        children: [
          new TextRun({
            text: `לידי: ${contactPerson || "_________"}`,
            font: "David",
            size: 24,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }), // Space after the first paragraph

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing

        children: [
          new TextRun({
            text: `פרוייקט: ${project || "_________"}`,
            font: "David",
            size: 24,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 400 } }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing

        children: [
          new TextRun({
            text: `הנדון: דו"ח סקר ויזואלי לאלמנטי קונסטרוקציה ${
              meterial || "_________"
            }`,
            font: "David",
            size: 32,
            bold: true,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing

        children: [
          new TextRun({
            text: `מיקום: ${
              locationType === "אחר" && customLocationType
                ? customLocationType
                : locationType || "_________"
            } ${location || "_________"}`,
            font: "David",
            size: 32,
            bold: true,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),

      new Paragraph({ text: "", spacing: { after: 400 } }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, after: 200 }, // 1.5 line spacing

        children: [
          new TextRun({
            text: `בתאריך ${surveyDate || "_________"} נערך סיור ב - ${
              locationType === "אחר" && customLocationType
                ? customLocationType
                : locationType || "_________"
            } הנ"ל ע"י מהנדס ${
              engineer || "_________"
            }מטרת הסקר הינה בדיקה וויזואלית לקונסטרוקציית ${
              meterial || "_________"
            } ב - ${
              locationType === "אחר" && customLocationType
                ? customLocationType
                : locationType || "_________"
            } ${location || "_________"} ומתן חוות דעת למצב של ${
              opinion || "_________"
            } הבדיקה וחוות הדעת אינם כוללים התייחסות למצבי קיצון או למקרים אקסצנטרים (רעידת אדמה, פעולות חריגות/עומסים חריגים במבנה וכדומה)`,
            font: "David",
            size: 24,
            rtl: true,
            language: "he-IL",
          }),
        ],
      }),
    ];

    // Pass the generated doc elements to the parent
    updateDoc(docElements);
  }, [
    recipient,
    date,
    contactPerson,
    project,
    meterial,
    locationType,
    customLocationType,
    location,
    surveyDate,
    engineer,
    opinion,
    updateDoc,
  ]);

  return (
    <>
      <div className="initial-info-container">
        <div className="half-cont">
          <TextAndInput
            label="תאריך:"
            type="date"
            value={date}
            setValue={setDate}
          />
          <TextAndInput
            label="פרוייקט:"
            value={project}
            setValue={setProject}
          />
        </div>
        <div className="half-cont">
          <TextAndInput
            label="לכבוד:"
            value={recipient}
            setValue={setRecipient}
          />
          <TextAndInput
            label="לידי:"
            value={contactPerson}
            setValue={setContactPerson}
          />
        </div>
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
              value={customLocationType}
              onChange={(e) => setCustomLocationType(e.target.value)}
            />
          )}

          <input
            type="text"
            className="input-field"
            placeholder="הכנס מיקום"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      <div className="text-paragraph-bottom">
        <p>
          בתאריך{" "}
          <TextAndInput
            type="date"
            value={surveyDate}
            setValue={setSurveyDate}
          />{" "}
          נערך סיור ב -{" "}
          {locationType === "אחר" && customLocationType
            ? customLocationType
            : locationType || "_________"}{" "}
          הנ"ל ע"י מהנדס{" "}
          <TextAndInput value={engineer} setValue={setEngineer} />.
        </p>
        <p>
          מטרת הסקר הינה בדיקה וויזואלית לקונס' {meterial || "_________"} ב -{" "}
          {locationType === "אחר" && customLocationType
            ? customLocationType
            : locationType || "_________"}{" "}
          {location || "_________"} ומתן חוות דעת למצב של{" "}
          <TextAndInput value={opinion} setValue={setOpinion} />.
        </p>
        <p>
          הבדיקה וחוות הדעת אינם כוללים התייחסות למצבי קיצון או למקרים אקסצנטרים
          (רעידת אדמה, פעולות חריגות/עומסים חריגים במבנה וכד').
        </p>
      </div>
    </>
  );
}

export default OpeningParagraph;
