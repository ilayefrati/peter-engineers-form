import React, { useState, useEffect } from "react";
import "./ImagesUploader.css"; // Importing CSS for styling
import ImageAndTitle from "./ImageAndTitle";
import Button from "./Button";
import { Paragraph, TextRun, ImageRun, AlignmentType } from "docx"; // Import docx components
import { canStoreData, MAX_STORAGE_SIZE } from './utils/storageManager';

function ImagesUploader({ updateImagesUploaderDoc }) {
  const [images, setImages] = useState(() => {
    // Initialize images from localStorage if available, M
    const savedImages = localStorage.getItem('imagesData');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [showRenderedImages, setShowRenderedImages] = useState(false);
  const [error, setError] = useState(null);
  const [isStorageFull, setIsStorageFull] = useState(false);
  
  const MAX_IMAGE_SIZE = 600;
  const IMAGE_QUALITY = 0.5;

  // Function to check localStorage usage
  const checkStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length * 2) / 1024 / 1024; // Size in MB
      }
    }
    setIsStorageFull(total >= MAX_STORAGE_SIZE * 0.95); // Now using imported MAX_STORAGE_SIZE
    return total;
  };

  // Modify canAddImage to use the storage manager
  const canAddImage = async (base64String) => {
    const newImageSize = (base64String.length * 2); // Size in bytes
    if (!canStoreData(newImageSize)) {
      throw new Error('אין מספיק מקום לשמור את התמונה. נא למחוק תמונות קיימות ולנסות שוב.');
    }
    return true;
  };

  // Compress image and convert to base64
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_IMAGE_SIZE) {
              height *= MAX_IMAGE_SIZE / width;
              width = MAX_IMAGE_SIZE;
            }
          } else {
            if (height > MAX_IMAGE_SIZE) {
              width *= MAX_IMAGE_SIZE / height;
              height = MAX_IMAGE_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Use sharpen effect to maintain clarity despite compression
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const base64String = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
          resolve(base64String);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Save images to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('imagesData', JSON.stringify(images));
      setError(null);
    } catch (e) {
      setError('לא ניתן לשמור את התמונות. נא למחוק חלק מהתמונות ולנסות שוב.');
      // Revert to previous state if storage fails
      const savedImages = localStorage.getItem('imagesData');
      setImages(savedImages ? JSON.parse(savedImages) : []);
    }
  }, [images]);

  // Handle file selection (file, gallery, or camera)
  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    
    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const base64String = await compressImage(file);
          // Check if we can store the new image
          await canAddImage(base64String);
          return {
            id: Math.random().toString(36).substr(2, 9),
            base64: base64String,
            title: "",
          };
        })
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
    } catch (e) {
      setError(e.message || 'אירעה שגיאה בעת העלאת התמונות. נא לנסות שוב.');
    }
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
              alignment: AlignmentType.RIGHT,
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
                  transformation: { width: 300, height: 300 },
                }),
              ],
            }),
            new Paragraph({ text: "", spacing: { after: 700 } }),
          ];
        });

        updateImagesUploaderDoc(imageDocElements.flat());
      };

      generateDocElements();
    }
  }, [images, updateImagesUploaderDoc, showRenderedImages]);

  // Check storage on component mount and when images change
  useEffect(() => {
    checkStorageUsage();
  }, [images]);

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
      <div className="uploader-box">
        {!isStorageFull ? (
          <>
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
          </>
        ) : (
          <p className="max-images-message">הגעת למקסימום נפח האחסון. נא למחוק תמונות קיימות כדי להוסיף חדשות</p>
        )}
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
