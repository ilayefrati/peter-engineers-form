import React, { createContext, useState, useEffect } from "react";
import {
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  TextDirection, // Use TextDirection for RTL
} from "docx";

// Create a context to store the table data
export const TableContext = createContext();

// TableContextProvider will wrap the components that need access to the table state
export const TableContextProvider = ({
  children,
  updateTableDoc,
  updateSumTableDoc,
}) => {
  const [table, setTable] = useState([]);

  // Function to handle input changes for a row, including image upload
  const handleInputChange = (index, field, value) => {
      const newTable = [...table];
      newTable[index][field] = value;
      setTable(newTable);
    }

  // Function to create a new row
  const addRow = () => {
    setTable([
      ...table,
      {
        index: table.length + 1, // Automatically set the index for "מס"ד"
        material: "",
        deficiency: "",
        recommendation: "",
        severity: "",
        image: "", // Empty image initially
      },
    ]);
  };

  // UseEffect to generate docx table content for both DataTable and SumTable
  useEffect(() => {
    // Define font size for table content
    const fontSize = 24; // 24 half-points is equivalent to 12pt

    // DataTable: Define table rows for the full DataTable
    const dataTableRows = table.map((row) => {
      const imageCell = row.image
        ? new TableCell({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: row.image.split(",")[1], // Extract base64 data from the string
                    transformation: {
                      width: 100,
                      height: 100,
                    },
                  }),
                ],
              }),
            ],
          })
        : new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "No Image", size: fontSize,language: "he-IL" })],
                alignment: AlignmentType.CENTER,
                font: "David"
              }),
            ],
          });

      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: String(row.index), size: fontSize,language: "he-IL" })],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.material, size: fontSize ,language: "he-IL"})],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.deficiency, size: fontSize ,language: "he-IL"})],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.recommendation, size: fontSize ,language: "he-IL"})],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.severity, size: fontSize,language: "he-IL"})],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
          imageCell, // Add image column
        ],
      });
    });

    // DataTable: Create the actual table for the docx file
    const dataTableElement = new Table({
      visuallyRightToLeft: true,
      rows: [
        // Add table header
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "מס\"ד", size: fontSize ,language: "he-IL"})],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "סוג חומר/אלמנט", size: fontSize,language: "he-IL" })],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "תיאור הליקוי", size: fontSize ,language: "he-IL"})],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "המלצה", size: fontSize,language: "he-IL" })],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "חומרה", size: fontSize ,language: "he-IL"})],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "תמונה", size: fontSize,language: "he-IL" })],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
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
    const sumTableRows = table.map((row) => (
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: String(row.index), size: fontSize,language: "he-IL" })],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.severity, size: fontSize,language: "he-IL" })],
                alignment: AlignmentType.CENTER,
                textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                font: "David"
              }),
            ],
          }),
        ],
      })
    ));

    // SumTable: Create the actual SumTable for the docx file
    const sumTableElement = new Table({
      visuallyRightToLeft: true,
      rows: [
        // Add table header
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "מס\"ד", size: fontSize,language: "he-IL" })],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "חומרה", size: fontSize,language: "he-IL" })],
                  alignment: AlignmentType.CENTER,
                  textDirection: TextDirection.RIGHT_TO_LEFT, // RTL
                  font: "David"
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

  }, [table, updateTableDoc, updateSumTableDoc]);

  return (
    <TableContext.Provider value={{ table, handleInputChange, addRow }}>
      {children}
    </TableContext.Provider>
  );
}

