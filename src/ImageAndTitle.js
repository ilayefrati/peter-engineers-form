import React from "react";
import "./ImageAndTitle.css";
import TextAndInput from "./TextAndInput";

function ImageAndTitle({ src, title, setTitle, imageId, index }) {
  return (
    <div className="image-and-title">
      <TextAndInput 
        label={1000 + index}
        value={title} 
        setValue={setTitle} 
      />
      <img src={src} alt="uploaded" />
    </div>
  );
}

export default ImageAndTitle;
