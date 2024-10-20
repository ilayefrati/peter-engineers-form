// PeopleContext.js
import React, { createContext, useState } from "react";

// Create a context to store the people data
export const TableContext = createContext();

// PeopleProvider will wrap the components that need access to the people state
export const TableContextProvider = ({ children }) => {
  const [table, setTable] = useState([]);

  // Function to handle input changes for a person
  const handleInputChange = (index, field, value) => {
    const newTable = [...table];
    newTable[index][field] = value;
    setTable(newTable);
  };

  // Function to create a new person (new row)
  const addRow = () => {
    setTable([
      ...table,
      {
        index: table.length + 1,
        material: "",
        deficiency: "",
        recommendation: "",
        severity: "",
        image: "",
      },
    ]);
  };

  return (
    <TableContext.Provider value={{ table, handleInputChange, addRow }}>
      {children}
    </TableContext.Provider>
  );
};
