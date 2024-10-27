import React from "react";
import "./ImageAndTitle.css";
import TextAndInput from "./TextAndInput";

function ImageAndTitle({ src, title, setTitle }) {
  return (
    <div className="image-and-title">
      {/* Pass the title and setTitle to TextAndInput */}
      <TextAndInput value={title} setValue={setTitle} />
      <img src={src} alt="uploaded" />
    </div>
  );
}

export default ImageAndTitle;
