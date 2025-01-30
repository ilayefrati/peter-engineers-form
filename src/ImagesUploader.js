import React, { useState, useEffect } from "react";
import "./ImagesUploader.css"; // Importing CSS for styling
import ImageAndTitle from "./ImageAndTitle";
import Button from "./Button";
import { Paragraph, TextRun, ImageRun, AlignmentType } from "docx"; // Import docx components

function ImagesUploader({ updateImagesUploaderDoc }) {
  const [images, setImages] = useState(() => {
    // Initialize images from localStorage if available
    const savedImages = localStorage.getItem('imagesData');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [showRenderedImages, setShowRenderedImages] = useState(false);

  // Save images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('imagesData', JSON.stringify(images));
  }, [images]);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection (file, gallery, or camera)
  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    const newImages = await Promise.all(
      files.map(async (file) => {
        const base64String = await fileToBase64(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          base64: base64String, // Store base64 version for localStorage
          title: "",
        };
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Update image title
  const handleTitleChange = (id, newTitle) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, title: newTitle } : img
      )
    );
  };

  // Remove single image from preview
  const handleRemoveImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Clear all images from preview
  const handleClearImages = () => {
    // Clear images from state
    setImages([]);
    setShowRenderedImages(false);

    // Clear image titles from localStorage (from 1000 to 1100)
    for (let i = 1000; i < 1100; i++) {
      localStorage.removeItem(String(i));
    }
  };

  // Handle rendering the images
  const handleRenderImages = () => {
    setShowRenderedImages(true);
  };

  // UseEffect to generate docx elements when images are updated
  useEffect(() => {
    if (showRenderedImages) {
      const generateDocElements = async () => {
        const imageDocElements = images.map((image, index) => {
          // Convert base64 string to ArrayBuffer
          const base64Data = image.base64.split(',')[1];
          const binaryString = window.atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const imageBuffer = bytes.buffer;

          // Get title from localStorage or use image.title or default
          const storedTitle = localStorage.getItem(String(1000 + index));
          const titleText = storedTitle || image.title || "Untitled Image";

          return [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: titleText,
                  bold: true,
                  underline: true,
                  language: "he-IL",
                }),
              ],
              font: "David",
            }),
            new Paragraph({ text: "", spacing: { after: 100 } }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: { width: 150, height: 150 },
                }),
              ],
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
          ];
        });

        updateImagesUploaderDoc(imageDocElements.flat());
      };

      generateDocElements();
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
          <p>העלה תמונה</p>
        </label>
        <input
          id="cameraInput"
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleImageChange}
          className="input-file"
        />
        <label htmlFor="cameraInput">
          <div className="camera-icon" />
          <p>צלם תמונה</p>
        </label>
      </div>

      {/* Preview selected images */}
      <div className="preview-section">
        {images.map((image) => (
          <div key={image.id} className="preview-item">
            <img 
              src={image.base64}
              alt="preview" 
              className="preview-img" 
            />
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
          {images.map((image, index) => (
            <div key={image.id} className="rendered-item">
              <ImageAndTitle
                src={image.base64}
                title={image.title}
                setTitle={(newTitle) => handleTitleChange(image.id, newTitle)}
                imageId={image.id}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImagesUploader;
