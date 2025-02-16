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
import { canStoreData, MAX_STORAGE_SIZE } from './utils/storageManager';

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

  const MAX_IMAGE_SIZE = 600;
  const IMAGE_QUALITY = 0.5;

  // Function to check localStorage usage
  const checkStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length * 2) / 1024 / 1024; // Size in MB
      }
    }
    return total;
  };

  // Function to estimate if new image can be stored
  const canAddImage = async (base64String) => {
    const currentUsage = checkStorageUsage();
    const newImageSize = (base64String.length * 2) / 1024 / 1024; // Size in MB
    
    if (currentUsage + newImageSize > MAX_STORAGE_SIZE) {
      throw new Error('אין מספיק מקום לשמור את התמונה. נא למחוק תמונות קיימות ולנסות שוב.');
    }
    return true;
  };

  // Add new compress image function
  const compressImage = (base64String) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_IMAGE_SIZE) {
            height *= MAX_IMAGE_SIZE / width;
            width = MAX_IMAGE_SIZE;
          }
        } else {
          if (height > MAX_IMAGE_SIZE) {
            width *= MAX_IMAGE_SIZE / height;
            height = MAX_IMAGE_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Use sharpen effect to maintain clarity despite compression
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    });
  };

  // Save table data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(table));
  }, [table]);

  // Modify handleInputChange to use storage manager
  const handleInputChange = async (
    index,
    field,
    value,
    deficiencyIndex = null,
    recommendationIndex = null
  ) => {
    const newTable = [...table];

    if (field === "image") {
      try {
        const compressedImage = await compressImage(value);
        const newImageSize = (compressedImage.length * 2); // Size in bytes
        
        if (!canStoreData(newImageSize)) {
          throw new Error('אין מספיק מקום לשמור את התמונה. נא למחוק תמונות קיימות ולנסות שוב.');
        }
        
        newTable[index][field] = compressedImage;
      } catch (e) {
        console.error('Error handling image:', e);
        alert(e.message || 'שגיאה בשמירת התמונה. נא לנסות שוב.');
        return;
      }
    } else if (field === "deficiencies") {
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
    
    try {
      setTable(newTable);
    } catch (e) {
      console.error('Error updating table:', e);
      alert('שגיאה בשמירת הנתונים. נא למחוק חלק מהתמונות ולנסות שוב.');
    }
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
                        width: 150, // Set desired width
                        height: 150, // Set desired height
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

      // DataTable: Create the actual DataTable for the docx file
      const dataTableElement = new Table({
        visuallyRightToLeft: true,
        width: {
          size: 100,
          type: WidthType.AUTO,
        },
        columnWidths: [1000, 1000, 1000, 1000, 1000, 1000, 3000],  // One value for each column
        rows: [
          // Add table header
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
        alignment: AlignmentType.CENTER,
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
        columnWidths: [1000, 1000],  // Two columns for SumTable
        rows: [
          // Add table header
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                margins: cellPadding,
                shading: {
                  fill: "3f6cb1",
                },
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
                  fill: "3f6cb1",
                },
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
          ...sumTableRows,
        ],
        alignment: AlignmentType.CENTER,
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
