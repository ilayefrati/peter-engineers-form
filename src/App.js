import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import FormHeader from "./Header";
import ContactInfo from "./ContactInfo";
import FirstPage from "./FirstPage";
import { TableContextProvider } from "./TableContextProvider";
import SumTable from "./SumTable";
import DataTable from "./DataTable";
import ImagesUploader from "./ImagesUploader";
import Button from "./Button";
import "./App.css";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TextDirection,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Footer,
  Header,
} from "docx";

function App() {
  const [statusTableElements, setStatusTableElements] = useState([]);
  const [openingParagraphElements, setOpeningParagraphElements] = useState([]);
  const [tableElements, setTableElements] = useState([]);
  const [sumTableElements, setSumTableElements] = useState([]);
  const [imagesUploaderElements, setImagesUploaderElements] = useState([]);

  const instructionsURL = `${process.env.PUBLIC_URL}/media/instructions.png`;
  const footerURL = `${process.env.PUBLIC_URL}/media/FormFooter.png`;
  const headerURL = `${process.env.PUBLIC_URL}/media/peter-engineers-logo.png`;

  async function getImage(imageURL) {
    const response = await fetch(imageURL);
    const imageBlob = await response.blob();
    return await imageBlob.arrayBuffer();
  }

  const handleGenerateDoc = async () => {
    const instructionsImageData = await getImage(instructionsURL);
    const footerImageData = await getImage(footerURL);
    const headerImageData = await getImage(headerURL);

    const doc = new Document({
      sections: [
        {
          properties: {
            // Ensure footer appears on the first page as well
            footerType: {
              default: true,
              first: false,
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: headerImageData,
                      transformation: { width: 600, height: 70 },
                    }),
                  ],
                }),
                new Paragraph({ text: "", spacing: { after: 200 } }), // Add spacing after the header
              ],
            }),
           
          },
          children: [
            ...openingParagraphElements,
            new Paragraph({ text: "", spacing: { after: 400 } }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'דרגת החומרה של אלמנט ודחיפות הביצוע יסומנו עפ"י הטבלה הבאה:',
                  size: 24,
                  language: "he-IL",
                }),
                new TextRun({
                  text: "",
                  break: 1,
                }),
                new TextRun({
                  text: "מדורג מהדחיפות הגבוהה אל הנמוכה",
                  size: 24,
                  language: "he-IL",
                }),
              ],
              font: "David",
              alignment: AlignmentType.CENTER,
              textDirection: TextDirection.RIGHT_TO_LEFT,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: instructionsImageData,
                  transformation: { width: 200, height: 50 },
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "", spacing: { after: 400 } }),
            ...statusTableElements,
            new Paragraph({ children: [], pageBreakBefore: true }),
            ...sumTableElements,
            new Paragraph({ children: [], pageBreakBefore: true }),
            ...imagesUploaderElements,
            new Paragraph({ children: [], pageBreakBefore: true }),
            ...tableElements,
          ],

          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: footerImageData,
                      transformation: { width: 600, height: 100 },
                    }),
                  ],
                }),
              ],
            }),
          },
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const file = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(file, "example.docx");
    });
  };

  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("status"));
    if (savedStatus && savedStatus.length > 0) {
      const statusTable = convertStatusToDocTable(savedStatus);
      setStatusTableElements([statusTable]);
    }
  }, []);

  function convertStatusToDocTable(statusData) {
    const fontSize = 24;
    const cellPadding = {
      top: 100,   // Top padding in twips (1/20th of a point)
      bottom: 100, // Bottom padding in twips
      left: 100,  // Left padding in twips
      right: 100, // Right padding in twips
    };
    return new Table({
      visuallyRightToLeft: true,
      alignment: AlignmentType.CENTER,
      width: {
        size: 100,
        type: WidthType.AUTO,
      },
      columnWidths: [1000, 1000, 1000],
      rows: [
        new TableRow({
          children: ["אישור לקוח", "בדק", "ערך", "תאריך", "מהדורה"].map(
            (header) =>
              new TableCell({
                margins: cellPadding, // Apply padding to the header cells
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header,
                        size: fontSize,
                        language: "he-IL",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    textDirection: TextDirection.RIGHT_TO_LEFT,
                    font: "David",
                  }),
                ],
              })
          ),
        }),
        ...statusData.map(
          (row) =>
            new TableRow({
              children: Object.values(row).map(
                (cell) =>
                  new TableCell({
                    margins: cellPadding, // Apply padding to the header cells
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell.value || " ",
                            size: fontSize,
                            language: "he-IL",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        textDirection: TextDirection.RIGHT_TO_LEFT,
                        font: "David",
                      }),
                    ],
                  })
              ),
            })
        ),
      ],
    });
  }

  return (
    <>
      <FormHeader />
      <div className="classic-page">
        <FirstPage
          updateDoc={setOpeningParagraphElements}
          updateStatusDoc={setStatusTableElements}
        />
        <TableContextProvider
          updateTableDoc={setTableElements}
          updateSumTableDoc={setSumTableElements}
        >
          <SumTable />
          <ImagesUploader updateImagesUploaderDoc={setImagesUploaderElements} />
          <DataTable />
        </TableContextProvider>
        <div className="buttons-container">
          <Button type="primary" text='שלח דו"ח' />
          <Button
            type="secondary"
            text='הורד דו"ח'
            onClick={handleGenerateDoc}
          />
        </div>
      </div>
      <ContactInfo />
    </>
  );
}

export default App;
