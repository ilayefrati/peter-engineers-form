// PeopleContext.js
import React, { createContext, useState } from "react";

// Create a context to store the people data
export const TableContext = createContext();

// PeopleProvider will wrap the components that need access to the people state
export const TableContextProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  // Function to handle input changes for a person
  const handleInputChange = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index][field] = value;
    setPeople(newPeople);
  };

  // Function to create a new person (new row)
  const createPerson = () => {
    setPeople([
      ...people,
      { id: people.length + 1, name: "", age: "", number: "" },
    ]);
  };

  return (
    <TableContext.Provider value={{ people, handleInputChange, createPerson }}>
      {children}
    </TableContext.Provider>
  );
};
