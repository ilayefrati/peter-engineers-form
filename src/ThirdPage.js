import React from "react";
import "./ThirdPage.css";
import Header from "./Header";
import ContactInfo from "./ContactInfo";
import ImagesUploader from './ImagesUploader';

function ThirdPage() {
  return (
    <>
      <Header />
      <div className="classic-page third-page">
        <ImagesUploader/>
      </div>
      <ContactInfo numPage="3" />
    </>
  );
}

export default ThirdPage;
