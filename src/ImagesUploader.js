import React, { useState, useEffect } from "react";
import "./ImagesUploader.css"; // Importing CSS for styling
import ImageAndTitle from "./ImageAndTitle";
import Button from "./Button";
import { Paragraph, TextRun, ImageRun, AlignmentType } from "docx"; // Import docx components

function ImagesUploader({ updateImagesUploaderDoc }) {
  const [images, setImages] = useState([]);
  const [showRenderedImages, setShowRenderedImages] = useState(false);

  // Handle file selection (file, gallery, or camera)
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9), // Unique ID for each image
      file: URL.createObjectURL(file),
      rawFile: file,
      title: "", // Add title field for each image, initially empty
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Update image title
  const handleTitleChange = (id, newTitle) => {
    setImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, title: newTitle } : img))
    );
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

  // Helper function to convert file to ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // UseEffect to generate docx elements when images are updated
  useEffect(() => {
    if (showRenderedImages) {
      // Generate doc elements with image data
      const generateDocElements = async () => {
        const imageDocElements = await Promise.all(
          images.map(async (image) => {
            const imageBuffer = await readFileAsArrayBuffer(image.rawFile); // Read image as ArrayBuffer
            return [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: image.title || "Untitled Image", bold: true, underline:true, language: "he-IL"}), // Title as bold text
                ],
                font: "David"
              }),
              new Paragraph({ text: "", spacing: { after: 100 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: imageBuffer, // Use the ArrayBuffer for the image
                    transformation: { width: 150, height: 150 }, // Size the image
                  }),
                ],
              }),
              new Paragraph({ text: "", spacing: { after: 200 } }),
            ];
          })
        );

        updateImagesUploaderDoc(imageDocElements.flat()); // Flatten to pass as a single array of elements
      };

      generateDocElements(); // Call the function to generate doc elements
    }
  }, [images, updateImagesUploaderDoc, showRenderedImages]);

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
            {/* Only render image without title in the preview */}
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

      {/* Rendered images in a column, after user presses "אשר" */}
      {showRenderedImages && (
        <div className="rendered-images">
          {images.map((image) => (
            <div key={image.id} className="rendered-item">
              <ImageAndTitle
                src={image.file}
                title={image.title}
                setTitle={(newTitle) => handleTitleChange(image.id, newTitle)} // Pass setTitle to ImageAndTitle for rendered images
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImagesUploader;
