import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_DOCUMENTATION_API_URL;

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/process-pdf`, formData);
      setResult(res.data);
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Court Case PDF</h2>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">📋 Summary</h3>
          <p>{result.summary}</p>
          <h3 className="font-semibold text-lg mt-4 mb-2">📚 Legal Sections</h3>
          <p>{result.sections}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;