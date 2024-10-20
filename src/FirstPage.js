import { React, useState } from "react";
import "./FirstPage.css";
import OpeningParagraph from "./OpeningParagraph";
import Button from "./Button";
import PopUp from "./PopUp";

function FirstPage() {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState();
  function onClickStatus() {
    setVisible(true);
    setType("status");
  }
  function onClickInstructions() {
    setVisible(true);
    setType("instructions");
  }
  return (
    <div className="first-page">
      <OpeningParagraph />
      <div className="buttons-container">
        <Button type="primary" text='סטטוס דו"ח' onClick={onClickStatus} />
        <Button type="secondary" text="הוראות" onClick={onClickInstructions} />
      </div>
      {visible && <PopUp setVisible={setVisible} type={type} />}
    </div>
  );
}

export default FirstPage;
