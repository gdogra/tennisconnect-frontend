import { Area } from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";

// src/utils/cropImage.js
export default function getCroppedImg(imageSrc, pixelCrop, rotation = 0, filter = "none") {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to cropped size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Move the origin to center of canvas for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply filter
      ctx.filter = filter;

      // Draw image with offset back from center
      ctx.drawImage(
        image,
        pixelCrop.x - canvas.width / 2,
        pixelCrop.y - canvas.height / 2,
        image.width,
        image.height
      );

      // Return as File
      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");
        const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    };

    image.onerror = (err) => reject(err);
  });
}

