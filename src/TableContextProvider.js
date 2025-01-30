import React, { createContext, useState, useEffect } from "react";
import {
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  TextDirection,
  WidthType,
} from "docx";

// Create a context to store the table data
export const TableContext = createContext();

// TableContextProvider will wrap the components that need access to the table state
export const TableContextProvider = ({
  children,
  updateTableDoc,
  updateSumTableDoc,
  buttonClicked,
}) => {
  const [table, setTable] = useState(() => {
    // Initialize table from localStorage if available
    const savedTable = localStorage.getItem('tableData');
    return savedTable ? JSON.parse(savedTable) : [];
  });

  // Save table data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(table));
  }, [table]);

  // Function to handle input changes for a row, including image and deficiency
  const handleInputChange = (
    index,
    field,
    value,
    deficiencyIndex = null,
    recommendationIndex = null
  ) => {
    const newTable = [...table];

    if (field === "deficiencies") {
      if (!newTable[index][field][deficiencyIndex]) {
        newTable[index][field][deficiencyIndex] = {
          value: "",
          customValue: "",
        };
      }
      newTable[index][field][deficiencyIndex].value = value;
    } else if (field === "deficiencyOther") {
      newTable[index].deficiencies[deficiencyIndex].customValue = value;
    } else if (field === "recommendations") {
      if (!newTable[index][field][recommendationIndex]) {
        newTable[index][field][recommendationIndex] = {
          value: "",
          customValue: "",
        };
      }
      newTable[index][field][recommendationIndex].value = value;
    } else if (field === "recommendationOther") {
      newTable[index].recommendations[recommendationIndex].customValue = value;
    } else {
      newTable[index][field] = value;
    }
    setTable(newTable);
  };

  // Function to add a new deficiency
  const addDeficiency = (index) => {
    const newTable = [...table];
    newTable[index].deficiencies.push({ value: "", customValue: "" });
    setTable(newTable);
  };

  const addRecommendation = (index) => {
    const newTable = [...table];
    newTable[index].recommendations.push({ value: "", customValue: "" });
    setTable(newTable);
  };

  // Function to create a new row
  const addRow = (tableBodyRef) => {
    setTable((prevTable) => {
      const newRow = {
        index: prevTable.length + 1,
        material: "",
        materialOther: "",
        element: "",
        elementOther: "",
        deficiencies: [{ value: "", customValue: "" }],
        recommendations: [{ value: "", customValue: "" }],
        severity: "",
        image: "",
      };
      return [...prevTable, newRow];
    });

    setTimeout(() => {
      if (tableBodyRef.current) {
        let tableScroll = document.getElementById("table-scroll");
        if (tableScroll) {
          tableScroll.scrollTop = tableScroll.scrollHeight;
          tableScroll.scrollLeft = tableScroll.scrollWidth;
        }
      }
    }, 100);
  };

  // UseEffect to generate docx table content for both DataTable and SumTable
  useEffect(() => {
    if (buttonClicked) {
      const fontSize = 24;
      const cellPadding = {
        top: 100, // Top padding in twips (1/20th of a point)
        bottom: 100, // Bottom padding in twips
        left: 100, // Left padding in twips
        right: 100, // Right padding in twips
      };
      const dataTableRows = table.map((row) => {
        const imageCell = row.image
          ? new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER, // Center horizontally within the paragraph
                  children: [
                    new ImageRun({
                      data: row.image.split(",")[1],
                      transformation: {
                        width: 80, // Set desired width
                        height: 80, // Set desired height
                      },
                    }),
                  ],
                }),
              ],
              verticalAlign: "center", // Center vertically within the cell
              margins: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100,
              },
            })
          : new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "No Image",
                      size: fontSize,
                      language: "he-IL",
                    }),
                  ],
                  font: "David",
                }),
              ],
              verticalAlign: "center",
            });

        return new TableRow({
          children: [
            new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(row.index),
                      size: fontSize,
                      language: "he-IL",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT,
                  font: "David",
                }),
              ],
            }),
            new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        row.material === "אחר"
                          ? row.materialOther
                          : row.material,
                      size: fontSize,
                      language: "he-IL",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT,
                  font: "David",
                }),
              ],
            }),
            new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        row.element === "אחר" ? row.elementOther : row.element,
                      size: fontSize,
                      language: "he-IL",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT,
                  font: "David",
                }),
              ],
            }),
            new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: row.deficiencies.map(
                (deficiency) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text:
                          deficiency.value === "אחר"
                            ? deficiency.customValue
                            : deficiency.value,
                        size: fontSize,
                        language: "he-IL",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  })
              ),
            }),
            new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: row.recommendations.map(
                (recommendation) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text:
                          recommendation.value === "אחר"
                            ? recommendation.customValue
                            : recommendation.value,
                        size: fontSize,
                        language: "he-IL",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  })
              ),
            }),
            new TableCell({
              margins: cellPadding, // Apply padding to the header cells
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: row.severity,
                      size: fontSize,
                      language: "he-IL",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT,
                  font: "David",
                }),
              ],
            }),
            imageCell,
          ],
        });
      });

      // DataTable: Create the actual table for the docx file
      const dataTableElement = new Table({
        visuallyRightToLeft: true,
        width: {
          size: 100,
          type: WidthType.AUTO,
        },
        columnWidths: [1000, 1000, 1000],

        rows: [
          // Add table header
          new TableRow({
            children: [
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'מס"ד',
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "חומר",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "אלמנט",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "תיאור הליקוי",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "המלצה",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "חומרה",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "תמונה",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
            ],
          }),
          ...dataTableRows, // Add the rows
        ],
        alignment: AlignmentType.CENTER, // Center the table itself
      });

      // Pass the DataTable to App
      updateTableDoc([dataTableElement]);

      // SumTable: Define table rows for SumTable (only index and severity)
      const sumTableRows = table.map(
        (row) =>
          new TableRow({
            children: [
              new TableCell({
                margins: cellPadding, // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: String(row.index),
                        size: fontSize,
                        language: "he-IL",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding, // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: row.severity,
                        size: fontSize,
                        language: "he-IL",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
            ],
          })
      );

      // SumTable: Create the actual SumTable for the docx file
      const sumTableElement = new Table({
        visuallyRightToLeft: true,
        width: {
          size: 100,
          type: WidthType.AUTO,
        },
        columnWidths: [1000, 1000, 1000],

        rows: [
          // Add table header
          new TableRow({
            children: [
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'מס"ד',
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1", // Light blue color (hexadecimal)
                }, // Apply padding to the header cells // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "חומרה",
                        size: fontSize,
                        language: "he-IL",
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              }),
            ],
          }),
          ...sumTableRows, // Add the rows
        ],
        alignment: AlignmentType.CENTER, // Center the table itself
      });

      // Pass the SumTable to App
      updateSumTableDoc([sumTableElement]);
    }
  }, [buttonClicked]);

  return (
    <TableContext.Provider
      value={{
        table,
        setTable,
        addRow,
        handleInputChange,
        addDeficiency,
        addRecommendation,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
