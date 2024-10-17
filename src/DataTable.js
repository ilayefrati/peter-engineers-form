// Table.js
import React, { useContext } from "react";
import { TableContext } from "./TableContextProvider"; // Import the context
import './DataTable.css'

const DataTable = () => {
  const { people, handleInputChange, createPerson } = useContext(TableContext); // Access the context

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, index) => (
            <tr key={index}>
              <td>{person.id}</td>
              <td>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={person.age}
                  onChange={(e) =>
                    handleInputChange(index, "age", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={person.number}
                  onChange={(e) =>
                    handleInputChange(index, "number", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={createPerson} className="addRow">
        Add Row
      </button>
    </div>
  );
};

export default DataTable;
