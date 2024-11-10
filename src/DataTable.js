import React, { useContext, useRef } from "react";
import { TableContext } from "./TableContextProvider";
import "./DataTable.css";

const DataTable = () => {
  const { table, handleInputChange, addRow, addDeficiency, addRecommendation } =
    useContext(TableContext);
  const tableBodyRef = useRef(null);

  const handleImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>מס"ד</th>
              <th>חומר</th>
              <th>אלמנט</th>
              <th>תיאור הליקוי</th>
              <th>המלצה</th>
              <th>חומרה</th>
              <th>תמונה</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef}>
            {table.map((row, index) => (
              <tr key={index}>
                <td>{row.index}</td>
                <td>
                  <select
                    name="materials"
                    value={row.material}
                    onChange={(e) =>
                      handleInputChange(index, "material", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="">בחר סוג חומר</option>
                    <option value="פלדה">פלדה</option>
                    <option value="בטון">בטון</option>
                    <option value="אחר">אחר</option>
                  </select>
                  {row.material === "אחר" && (
                    <input
                      type="text"
                      className="input-field table-other-input"
                      value={row.materialOther || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "materialOther",
                          e.target.value
                        )
                      }
                      placeholder="הכנס חומר אחר"
                    />
                  )}
                </td>
                <td>
                  <select
                    name="elements"
                    value={row.element}
                    onChange={(e) =>
                      handleInputChange(index, "element", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="">בחר סוג אלמנט</option>
                    <option value="קורה">קורה</option>
                    <option value="עמוד">עמוד</option>
                    <option value="דיאגונל">דיאגונל</option>
                    <option value="חיפוי">חיפוי</option>
                    <option value="מעקה">מעקה</option>
                    <option value="מרדך">מרדך</option>
                    <option value="סולם">סולם</option>
                    <option value="בסיס">בסיס</option>
                    <option value="תמיכה">תמיכה</option>
                    <option value="אחר">אחר</option>
                  </select>
                  {row.element === "אחר" && (
                    <input
                      type="text"
                      className="input-field table-other-input"
                      value={row.elementOther || ""}
                      onChange={(e) =>
                        handleInputChange(index, "elementOther", e.target.value)
                      }
                      placeholder="הכנס אלמנט אחר"
                    />
                  )}
                </td>
                <td>
                  {row.deficiencies.map((deficiency, dIndex) => (
                    <div key={dIndex} className="deficiency-row">
                      <select
                        value={deficiency.value || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "deficiencies",
                            e.target.value,
                            dIndex,
                            null
                          )
                        }
                        className="form-select"
                      >
                        <option value="">בחר ליקוי</option>
                        <option value="סדק">קורוזיה מתקדמת</option>
                        <option value="חלודה קלה">חלודה קלה</option>
                        <option value="התפוררות">התפוררות</option>
                        <option value="שבר">שבר</option>
                        <option value="סדיקה">סדיקה</option>
                        <option value="פגיעה מכנית">פגיעה מכנית</option>
                        <option value="אלמנט חסר">אלמנט חסר</option>
                        <option value="לא ניתן לבחון את האלמנט">
                          לא ניתן לבחון את האלמנט
                        </option>
                        <option value="ירידה בעובי דופן">
                          ירידה בעובי דופן
                        </option>
                        <option value="ברזל זיון חשוף">ברזל זיון חשוף</option>
                        <option value="אלמנט לא מופיע בתוכנית">
                          אלמנט לא מופיע בתוכנית
                        </option>
                        <option value="אחר">אחר</option>
                      </select>
                      {deficiency.value === "אחר" && (
                        <input
                          type="text"
                          className="input-field table-other-input"
                          value={deficiency.customValue || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "deficiencyOther",
                              e.target.value,
                              dIndex,
                              null
                            )
                          }
                          placeholder="הכנס ליקוי אחר"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addDeficiency(index)}
                    className="add-deficiency"
                  >
                    +
                  </button>
                </td>
                <td>
                  {row.recommendations.map((recommendation, rIndex) => (
                    <div key={rIndex} className="recommendation-row">
                      <select
                        value={recommendation.value || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "recommendations",
                            e.target.value,
                            null,
                            // i had to send null there because this is the dIndex and i need to match the handleInputChange parameters
                            rIndex
                          )
                        }
                        className="form-select"
                      >
                        <option value="">בחר המלצה</option>
                        <option value="שיקום">שיקום</option>
                        <option value="ניקוי וצביעה">ניקוי וצביעה</option>
                        <option value="החלפת אלמנט">החלפת אלמנט</option>
                        <option value="השלמת אלמנט">השלמת אלמנט</option>
                        <option value="ניקוי ובחינה חוזרת">
                          ניקוי ובחינה חוזרת
                        </option>
                        <option value="חיזוק האלמנט">חיזוק האלמנט</option>
                        <option value="ביצוע בדיקת עובי דופן">
                          ביצוע בדיקת עובי דופן
                        </option>
                        <option value="השלמת ברגים">השלמת ברגים</option>
                        <option value="הסרת ההפרעה">הסרת ההפרעה</option>
                        <option value="הידוק ברגים">הידוק ברגים</option>
                        <option value="אחר">אחר</option>
                      </select>
                      {recommendation.value === "אחר" && (
                        <input
                          type="text"
                          className="input-field table-other-input"
                          value={recommendation.customValue || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "recommendationOther",
                              e.target.value,
                              null,
                              rIndex
                            )
                          }
                          placeholder="הכנס המלצה אחרת"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addRecommendation(index)}
                    className="add-recommendation"
                  >
                    +
                  </button>
                </td>
                <td>
                  <select
                    name="severities"
                    id="severities"
                    value={row.severity}
                    onChange={(e) =>
                      handleInputChange(index, "severity", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="">בחר רמת חומרה</option>
                    <option value="1">1 - בהקדם וללא דיחוי</option>
                    <option value="2">2 - בהקדם</option>
                    <option value="3">3 - דחיפות נמוכה</option>
                  </select>
                </td>
                <td>
                  <label className="image-input-label">
                    <input
                      className="image-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(index, e.target.files[0])
                      }
                    />
                  </label>
                  {row.image && (
                    <img
                      src={row.image}
                      alt="Preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        margin: "10px",
                        objectFit: "cover",
                        objectPosition: "center center",
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="add-row-container">
        <button onClick={() => addRow(tableBodyRef)} className="add-row">
          +
        </button>
      </div>
    </div>
  );
};

export default DataTable;
