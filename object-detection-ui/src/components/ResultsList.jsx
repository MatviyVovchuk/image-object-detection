import React from "react";

const ResultsList = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-primary-300 mb-6">
        Detected Objects
      </h2>
      <div className="space-y-4">
        {results.map((obj, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 transition-all hover:bg-gray-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {obj.label}
                  </h3>
                  <p className="text-primary-300 font-semibold">
                    Confidence: {Math.round(obj.confidence * 100)}%
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <p>Position:</p>
                <p>
                  X: {obj.xmin.toFixed(2)} to {obj.xmax.toFixed(2)}
                </p>
                <p>
                  Y: {obj.ymin.toFixed(2)} to {obj.ymax.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
