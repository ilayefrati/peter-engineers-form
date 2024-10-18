import React from "react";
import "./SecondPage.css";
import Header from "./Header";
import ContactInfo from "./ContactInfo";
import SumTable from "./SumTable";

function SecondPage() {
  return (
    <>
      <Header />
      <div className="classic-page second-page">
        <SumTable />
      </div>
      <ContactInfo numPage="2" />
    </>
  );
}

export default SecondPage;
