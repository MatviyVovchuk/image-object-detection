import React, { useState } from "react";
import axios from "axios";
import ImageUploader from "./components/ImageUploader";
import ResultsList from "./components/ResultsList";

const API_BASE_URL = "http://127.0.0.1:8000";

const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.objects);
      setProcessedImage(`${API_BASE_URL}${response.data.image_url}`);
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Error processing image: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-300 mb-4">
            Object Detection
          </h1>
          <p className="text-gray-400 text-lg">
            Upload an image to detect objects within it
          </p>
        </div>

        <div className="space-y-8">
          <ImageUploader onImageUpload={handleImageUpload} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {preview && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
                <h2 className="text-xl font-semibold text-primary-300 mb-4">
                  Original Image
                </h2>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {processedImage && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
                <h2 className="text-xl font-semibold text-primary-300 mb-4">
                  Processed Image
                </h2>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error("Error loading processed image");
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!image || isLoading}
            className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md 
              ${
                !image || isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 transition-colors"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Process Image"
            )}
          </button>

          <ResultsList results={results} />
        </div>
      </div>
    </div>
  );
};

export default App;
