import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImageUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all
        ${
          isDragActive
            ? "border-primary-400 bg-primary-900/20"
            : "border-gray-600 hover:border-primary-500 bg-gray-800"
        }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <svg
          className={`mx-auto h-12 w-12 mb-4 ${
            isDragActive ? "text-primary-400" : "text-gray-400"
          }`}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-lg text-gray-300">
          {isDragActive
            ? "Drop the image here..."
            : "Drag and drop an image, or click to select"}
        </p>
        <p className="mt-2 text-sm text-gray-400">PNG, JPG, JPEG up to 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
