// SumTable.js
import React, { useContext } from "react";
import { TableContext } from "./TableContextProvider"; // Import the context
import './SumTable.css'

const SumTable = () => {
  const { people } = useContext(TableContext); // Access the people array from context

  return (
    <div className="sum-table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, index) => (
            <tr key={index}>
              <td>{person.id}</td>
              <td>{person.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SumTable;
