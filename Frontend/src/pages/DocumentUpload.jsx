import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";

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
    <motion.div
      className="min-h-screen flex items-center justify-center bg-cover bg-center mt-0.5"
      style={{ backgroundImage: `url('${assets.Rectangle}')` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white bg-opacity-80 p-8 rounded-2xl max-w-4xl w-full mb-18"
        style={{ boxShadow: "0 10px 50px rgba(0,0,0,0.8)" }}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-12 text-black text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Upload Court Case PDF
        </motion.h2>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <label className="block w-full mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <div className="cursor-pointer px-4 py-2 border-2 border-black rounded-lg text-black hover:bg-gray-100 hover:text-black transition truncate">
              {file ? file.name : "Choose PDF File"}
            </div>
          </label>
          <motion.button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 px-6 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Processing..." : "Upload & Analyze"}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              className="mt-8 bg-white bg-opacity-90 p-6 rounded-lg text-black"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <h3 className="font-semibold text-xl mb-2">Summary</h3>
              <p className="mb-4">{result.summary}</p>
              <h3 className="font-semibold text-xl mb-2">Legal Sections</h3>
              <p>{result.sections}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DocumentUpload;