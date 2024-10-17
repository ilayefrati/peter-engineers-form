import { React, useState } from "react";
import "./FirstPage.css";
import Header from "./Header";
import OpeningParagraph from "./OpeningParagraph";
import Button from "./Button";
import PopUp from "./PopUp";
import ContactInfo from "./ContactInfo";

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
    <>
      <Header />
      <div className="classic-page first-page">
        <OpeningParagraph />
        <div className="buttons-container">
          <Button 
          type="primary" 
          text='סטטוס דו"ח' 
          onClick={onClickStatus} />
          <Button
            type="secondary"
            text="הוראות"
            onClick={onClickInstructions}
          />
        </div>
        {visible && <PopUp setVisible={setVisible} type={type} />}
      </div>
      <ContactInfo numPage="1"/>
    </>
  );
}

export default FirstPage;
