import React from "react";
import './ImageAndTitle.css';
import TextAndInput from './TextAndInput';

function ImageAndTitle({ src }) {
  return (
    <div className="image-and-title">
      <TextAndInput />
      <img src={src} alt="uploaded" />
    </div>
  );
}

export default ImageAndTitle;
