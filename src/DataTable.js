import React, { useContext } from "react";
import { TableContext } from "./TableContextProvider"; // Import the context
import "./DataTable.css";

const DataTable = () => {
  const { table, handleInputChange, addRow } = useContext(TableContext); // Access the context

  const handleImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(index, "image", reader.result); // Store the base64 image data
      };
      reader.readAsDataURL(file); // Convert image file to base64
    }
  };

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>מס"ד</th>
            <th>סוג חומר/אלמנט</th>
            <th>תיאור הליקוי</th>
            <th>המלצה</th>
            <th>חומרה</th>
            <th>תמונה</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr key={index}>
              <td>{row.index}</td>
              <td>
                <input
                  type="text"
                  value={row.material}
                  onChange={(e) =>
                    handleInputChange(index, "material", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.deficiency}
                  onChange={(e) =>
                    handleInputChange(index, "deficiency", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.recommendation}
                  onChange={(e) =>
                    handleInputChange(index, "recommendation", e.target.value)
                  }
                />
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
                  <option value="1 - בהקדם וללא דיחוי">
                    1 - בהקדם וללא דיחוי
                  </option>
                  <option value="2 - בהקדם">2 - בהקדם</option>
                  <option value="3 - דחיפות נמוכה">3 - דחיפות נמוכה</option>
                </select>
              </td>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                />
                {row.image && (
                  <img
                    src={row.image}
                    alt="Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      marginTop: "10px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-row-container">
        <button onClick={addRow} className="add-row">
          +
        </button>
      </div>
    </div>
  );
};

export default DataTable;
