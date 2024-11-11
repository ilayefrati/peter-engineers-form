import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Header from "./Header";
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
} from "docx";

function App() {
  const [statusTableElements, setStatusTableElements] = useState([]);
  const [openingParagraphElements, setOpeningParagraphElements] = useState([]);
  const [tableElements, setTableElements] = useState([]);
  const [sumTableElements, setSumTableElements] = useState([]);
  const [imagesUploaderElements, setImagesUploaderElements] = useState([]);

  const imageURL = `${process.env.PUBLIC_URL}/media/instructions.png`;

  async function getImage() {
    const response = await fetch(imageURL);
    const imageBlob = await response.blob();
    return await imageBlob.arrayBuffer();
  }

  const handleGenerateDoc = async () => {
    const instructionsImageData = await getImage();

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            ...openingParagraphElements,
            new Paragraph({ text: "", spacing: { after: 400 } }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'דרגת החומרה של אלמנט ודחיפות הביצוע יסומנו עפ"י הטבלה הבאה: (מדורג מהדחיפות הגבוהה אל הנמוכה)',
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
            new Paragraph({ text: "", spacing: { after: 400 } }),
            ...sumTableElements,
            new Paragraph({ text: "", spacing: { after: 400 } }),
            ...imagesUploaderElements,
            new Paragraph({ text: "", spacing: { after: 400 } }),
            ...tableElements,
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const file = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      saveAs(file, "example.docx");
    });
  }

  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("status"));
    if (savedStatus && savedStatus.length > 0) {
      const statusTable = convertStatusToDocTable(savedStatus);
      setStatusTableElements([statusTable]);
    }
  }, []);

  function convertStatusToDocTable(statusData) {
    const fontSize = 24;
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
      <Header />
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
