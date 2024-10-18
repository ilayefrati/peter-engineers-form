import React, { useState } from "react";
import "./ImagesUploader.css"; // Importing CSS for styling
import ImageAndTitle from "./ImageAndTitle";
import Button from "./Button";

function ImagesUploader() {
  const [images, setImages] = useState([]);
  const [showRenderedImages, setShowRenderedImages] = useState(false);

  // Handle file selection (file, gallery, or camera)
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9), // Unique ID for each image
      file: URL.createObjectURL(file),
      rawFile: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Remove single image from preview
  const handleRemoveImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Clear all images from preview
  const handleClearImages = () => {
    setImages([]);
    setShowRenderedImages(false); // Clear rendered images as well
  };

  // Handle rendering the images
  const handleRenderImages = () => {
    setShowRenderedImages(true);
  };

  return (
    <div className="container">
      {/* Image selection (file, gallery, camera) */}
      <div className="uploader-box">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="input-file"
        />
        <label htmlFor="fileInput">
          <div className="upload-icon" />
          <p>העלה/צלם תמונה</p>
        </label>
      </div>

      {/* Preview selected images */}
      <div className="preview-section">
        {images.map((image) => (
          <div key={image.id} className="preview-item">
            <img src={image.file} alt="preview" className="preview-img" />
            <button
              onClick={() => handleRemoveImage(image.id)}
              className="remove-button"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Clear and Render buttons */}
      <div className="buttons-container">
        <Button type="primary" text="אשר" onClick={handleRenderImages} />
        <Button type="secondary" text="נקה" onClick={handleClearImages} />
      </div>
      {/* Rendered images in a column */}
      {showRenderedImages && (
        <div className="rendered-images">
          {images.map((image) => (
            <div key={image.id} className="rendered-item">
              <ImageAndTitle src={image.file} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImagesUploader;
